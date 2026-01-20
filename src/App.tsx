import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  MiniMap,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  OnSelectionChangeParams,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { BoxNode } from './nodes/BoxNode'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  CssBaseline,
  Divider,
  Stack,
  Paper,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ImageIcon from '@mui/icons-material/Image'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage'
import DnsIcon from '@mui/icons-material/Dns'
import CloudIcon from '@mui/icons-material/Cloud'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { toPng, toSvg } from 'html-to-image'

type Kind = 'service' | 'db' | 'queue' | 'external' | 'worker'

const nodeTypes = { box: BoxNode }

type SaveState = {
  nodes: Node[]
  edges: Edge[]
}

const STORAGE_KEY = 'uml-builder:mvp:diagram'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
})

const defaultNodes: Node[] = [
  { id: 'svc', type: 'box', position: { x: 220, y: 120 }, data: { label: 'Service', kind: 'service' as Kind } },
  { id: 'db', type: 'box', position: { x: 600, y: 200 }, data: { label: 'Database', kind: 'db' as Kind } },
  { id: 'ext', type: 'box', position: { x: 140, y: 380 }, data: { label: 'External', kind: 'external' as Kind } },
  { id: 'q', type: 'box', position: { x: 420, y: 420 }, data: { label: 'Queue', kind: 'queue' as Kind } },
]

export default function App() {
  // restore from storage
  const stored = safeLoad()
  const [nodes, setNodes, onNodesChange] = useNodesState(stored?.nodes ?? defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(stored?.edges ?? [])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const flowWrapperRef = useRef<HTMLDivElement>(null)

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection }, eds))
  }, [setEdges])

  // selection change
  const onSelectionChange = useCallback(({ nodes: selNodes }: OnSelectionChangeParams) => {
    setSelectedNodeId(selNodes?.[0]?.id ?? null)
  }, [])

  // autosave
  useEffect(() => {
    const payload: SaveState = { nodes, edges }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [nodes, edges])

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId])

  // actions
  const addNode = (kind: Kind) => {
    const id = `${kind}-${Math.random().toString(36).slice(2, 7)}`
    const position = { x: 160 + Math.random() * 480, y: 120 + Math.random() * 360 }
    setNodes(nds => nds.concat({ id, type: 'box', position, data: { label: prettyKind(kind), kind } }))
  }

  const deleteSelected = () => {
    setNodes(nds => nds.filter(n => !n.selected))
    setEdges(eds => eds.filter(e => !e.selected))
    setSelectedNodeId(null)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const parsed = JSON.parse(text) as SaveState
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          setNodes(parsed.nodes)
          setEdges(parsed.edges)
        }
      } catch {}
    }
    input.click()
  }

  const exportPng = async () => {
    if (!flowWrapperRef.current) return
    const dataUrl = await toPng(flowWrapperRef.current, { cacheBust: true })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'diagram.png'
    a.click()
  }

  const resetDiagram = () => {
    setNodes(defaultNodes)
    setEdges([])
    setSelectedNodeId(null)
  }

  const onLabelChange = (value: string) => {
    if (!selectedNode) return
    setNodes(nds => nds.map(n => n.id === selectedNode.id ? ({ ...n, data: { ...(n.data as any), label: value } }) : n))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* App bar */}
        <AppBar position="fixed" elevation={1}>
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Web Architecture Diagram Builder</Typography>
            <Button color="inherit" startIcon={<RefreshIcon />} onClick={resetDiagram}>Reset</Button>
            <Button color="inherit" startIcon={<FileUploadIcon />} onClick={importJson}>Import JSON</Button>
            <Button color="inherit" startIcon={<FileDownloadIcon />} onClick={exportJson}>Export JSON</Button>
            <Button color="inherit" startIcon={<ImageIcon />} onClick={exportPng}>Export PNG</Button>
            <Button color="inherit" startIcon={<DeleteOutlineIcon />} onClick={deleteSelected}>Delete Selected</Button>
          </Toolbar>
        </AppBar>

        {/* Left palette */}
        <Box sx={{ width: 220, borderRight: 1, borderColor: 'divider', pt: 7, p: 1 }}>
          <Typography variant="subtitle2" sx={{ px: 1, pb: 1, color: 'text.secondary' }}>Palette</Typography>
          <Stack spacing={1}>
            <PaletteButton icon={<DnsIcon />} label="Service" onClick={() => addNode('service')} />
            <PaletteButton icon={<StorageIcon />} label="Database" onClick={() => addNode('db')} />
            <PaletteButton icon={<SettingsEthernetIcon />} label="Queue" onClick={() => addNode('queue')} />
            <PaletteButton icon={<CloudIcon />} label="External" onClick={() => addNode('external')} />
            <PaletteButton icon={<WorkspacesIcon />} label="Worker" onClick={() => addNode('worker')} />
          </Stack>
        </Box>

        {/* Canvas and right inspector */}
        <Box sx={{ flex: 1, position: 'relative', pt: 7 }}>
          <Box ref={flowWrapperRef} sx={{ position: 'absolute', inset: 0 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              onSelectionChange={onSelectionChange}
            >
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </Box>
        </Box>

        {/* Inspector */}
        <Box sx={{ width: 280, borderLeft: 1, borderColor: 'divider', pt: 7, p: 2 }}>
          <Typography variant="subtitle2" sx={{ pb: 1, color: 'text.secondary' }}>Inspector</Typography>
          {selectedNode ? (
            <Stack spacing={2}>
              <TextField
                size="small"
                label="Name"
                value={(selectedNode.data as any)?.label ?? ''}
                onChange={(e) => onLabelChange(e.target.value)}
              />
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography variant="body2">{prettyKind((selectedNode.data as any)?.kind as Kind)}</Typography>
              </Paper>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">Select a node to edit its properties</Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function safeLoad(): SaveState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SaveState
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null
    return parsed
  } catch {
    return null
  }
}

function prettyKind(kind: Kind): string {
  switch (kind) {
    case 'service': return 'Service'
    case 'db': return 'Database'
    case 'queue': return 'Queue'
    case 'external': return 'External'
    case 'worker': return 'Worker'
  }
}

function PaletteButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Button variant="outlined" startIcon={icon as any} onClick={onClick} sx={{ justifyContent: 'flex-start' }}>
      {label}
    </Button>
  )
}
