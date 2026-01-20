import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import CloudIcon from '@mui/icons-material/Cloud'
import StorageIcon from '@mui/icons-material/Storage'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import DnsIcon from '@mui/icons-material/Dns'
import WorkspacesIcon from '@mui/icons-material/Workspaces'

type Kind = 'service' | 'db' | 'queue' | 'external' | 'worker'

type Data = {
  label: string
  kind: Kind
}

const bgForKind: Record<Kind, string> = {
  service: '#E3F2FD',
  db: '#E8F5E9',
  queue: '#FFF3E0',
  external: '#F3E5F5',
  worker: '#ECEFF1',
}

const borderForKind: Record<Kind, string> = {
  service: '#64B5F6',
  db: '#81C784',
  queue: '#FFB74D',
  external: '#BA68C8',
  worker: '#90A4AE',
}

export const BoxNode = memo(({ data }: NodeProps<Data>) => {
  const kind = data.kind
  const isWorker = kind === 'worker'

  return (
    <div
      style={{
        position: 'relative',
        padding: '10px 14px',
        minWidth: 120,
        minHeight: 48,
        background: bgForKind[kind],
        border: `2px ${isWorker ? 'dashed' : 'solid'} ${borderForKind[kind]}`,
        borderRadius: kind === 'service' || kind === 'queue' ? 12 : 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
        <span style={{ display: 'inline-flex', color: borderForKind[kind] }}>
          {kind === 'service' && <DnsIcon fontSize="small" />}
          {kind === 'db' && <StorageIcon fontSize="small" />}
          {kind === 'queue' && <SettingsEthernetIcon fontSize="small" />}
          {kind === 'external' && <CloudIcon fontSize="small" />}
          {kind === 'worker' && <WorkspacesIcon fontSize="small" />}
        </span>
        <span>{data.label}</span>
      </div>

      {/* Four targets to allow attaching TO any side */}
      <Handle id="t-target" type="target" position={Position.Top} />
      <Handle id="r-target" type="target" position={Position.Right} />
      <Handle id="b-target" type="target" position={Position.Bottom} />
      <Handle id="l-target" type="target" position={Position.Left} />

      {/* Four sources to allow connecting FROM any side */}
      <Handle id="t-source" type="source" position={Position.Top} />
      <Handle id="r-source" type="source" position={Position.Right} />
      <Handle id="b-source" type="source" position={Position.Bottom} />
      <Handle id="l-source" type="source" position={Position.Left} />
    </div>
  )
})
