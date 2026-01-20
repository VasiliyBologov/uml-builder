export const SCHEMA_VERSION = 1 as const

export type Diagram = {
  id: string
  name: string
  nodes: ArchNode[]
  edges: ArchEdge[]
  metadata: Record<string, unknown>
  version: typeof SCHEMA_VERSION
}

export type NodeType = 'service' | 'db' | 'queue' | 'worker' | 'external'

export type EdgeType = 'grpc' | 'rest' | 'publish' | 'consume' | 'read' | 'write'

export type Position = { x: number; y: number }
export type Size = { w: number; h: number }

export type ArchNode = {
  id: string
  type: NodeType
  name: string
  properties: Record<string, unknown>
  position: Position
  size?: Size
}

export type ArchEdge = {
  id: string
  from: string
  to: string
  type: EdgeType
  label?: string
}

export const makeEmptyDiagram = (name = 'Untitled Diagram'): Diagram => ({
  id: crypto.randomUUID(),
  name,
  nodes: [],
  edges: [],
  metadata: {},
  version: SCHEMA_VERSION,
})

export const isAsyncEdge = (t: EdgeType) => t === 'publish' || t === 'consume'
