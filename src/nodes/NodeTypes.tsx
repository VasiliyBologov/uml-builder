import React from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { NodeResizer } from '@reactflow/node-resizer'
import { Box, Typography, useTheme } from '@mui/material'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import StorageIcon from '@mui/icons-material/Storage'
import DnsIcon from '@mui/icons-material/Dns'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import LanIcon from '@mui/icons-material/Lan'

export type ArchData = { label: string; nodeType: string }

const titleSx = { fontWeight: 500, lineHeight: 1.2 }

export function ServiceNode(props: NodeProps<ArchData>) {
  const { selected, data } = props
  const theme = useTheme()
  return (
    <Box sx={{
      height: '100%', width: '100%', boxSizing: 'border-box',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 1.5,
      boxShadow: selected ? `0 0 0 3px ${theme.palette.primary.main}33` : '0 1px 2px rgba(0,0,0,0.06)',
      p: 1.2,
    }}>
      <NodeResizer isVisible={selected} minWidth={120} minHeight={60} lineStyle={{ borderColor: theme.palette.primary.main }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DnsIcon color="primary" fontSize="small" />
        <Typography variant="body2" sx={titleSx}>{data.label}</Typography>
      </Box>
    </Box>
  )
}

export function WorkerNode(props: NodeProps<ArchData>) {
  const { selected, data } = props
  const theme = useTheme()
  return (
    <Box sx={{
      height: '100%', width: '100%', boxSizing: 'border-box',
      background: theme.palette.background.paper,
      border: `1px dashed ${theme.palette.warning.main}`,
      borderRadius: 1,
      p: 1,
    }}>
      <NodeResizer isVisible={selected} minWidth={120} minHeight={60} lineStyle={{ borderColor: theme.palette.warning.main }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WorkHistoryIcon color="warning" fontSize="small" />
        <Typography variant="body2" sx={titleSx}>{data.label}</Typography>
      </Box>
    </Box>
  )
}

export function QueueNode(props: NodeProps<ArchData>) {
  const { selected, data } = props
  const theme = useTheme()
  return (
    <Box sx={{
      height: '100%', width: '100%', boxSizing: 'border-box',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: 999,
      p: 1,
    }}>
      <NodeResizer isVisible={selected} minWidth={120} minHeight={48} lineStyle={{ borderColor: theme.palette.secondary.main }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
        <LanIcon color="secondary" fontSize="small" />
        <Typography variant="body2" sx={titleSx}>{data.label}</Typography>
      </Box>
    </Box>
  )
}

export function ExternalNode(props: NodeProps<ArchData>) {
  const { selected, data } = props
  const theme = useTheme()
  return (
    <Box sx={{
      height: '100%', width: '100%', boxSizing: 'border-box',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.info.main}`,
      borderRadius: 1.5,
      boxShadow: selected ? `0 0 0 3px ${theme.palette.info.main}33` : '0 1px 2px rgba(0,0,0,0.06)',
      p: 1.2,
    }}>
      <NodeResizer isVisible={selected} minWidth={120} minHeight={60} lineStyle={{ borderColor: theme.palette.info.main }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudQueueIcon color="info" fontSize="small" />
        <Typography variant="body2" sx={titleSx}>{data.label}</Typography>
      </Box>
    </Box>
  )
}

export function DbNode(props: NodeProps<ArchData>) {
  const { selected, data } = props
  const theme = useTheme()
  return (
    <Box sx={{
      height: '100%', width: '100%', boxSizing: 'border-box',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.success.main}`,
      borderRadius: 1.5,
      boxShadow: selected ? `0 0 0 3px ${theme.palette.success.main}33` : '0 1px 2px rgba(0,0,0,0.06)',
      p: 1.2,
    }}>
      <NodeResizer isVisible={selected} minWidth={120} minHeight={60} lineStyle={{ borderColor: theme.palette.success.main }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon color="success" fontSize="small" />
        <Typography variant="body2" sx={titleSx}>{data.label}</Typography>
      </Box>
    </Box>
  )
}

export const nodeTypes = {
  service: ServiceNode,
  worker: WorkerNode,
  queue: QueueNode,
  external: ExternalNode,
  db: DbNode,
}
