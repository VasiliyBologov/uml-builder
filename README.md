Web Architecture Diagram Builder (MVP)

An engineering-first visual editor to model distributed monoliths and service architectures. Built with React, TypeScript, and React Flow. No backend required for MVP; diagrams persist in localStorage and can be exported/imported as JSON/PNG/SVG.

Quick start

Prerequisites: Node 18+

Install dependencies: npm install
Start dev server: npm run dev
Build for production: npm run build
Preview production build: npm run preview

Open the printed local URL (typically http://localhost:5173).

Core features (from PRD)
- Polished UI built with Material UI (MUI) + custom theme
- Infinite, zoomable canvas (React Flow)
- Palette to add node types: service, db, queue, worker, external
- Custom node visuals + resizing:
  - Service — rounded rectangle
  - Database — cylinder shape
  - External — cloud shape
  - Queue — pill/rounded capsule
  - Worker — dashed border rectangle
  - Drag node corners to resize; size persists to JSON
- Typed connections (edges): rest, grpc, publish, consume, read, write
  - Solid line = synchronous (REST/gRPC, DB read/write)
  - Dashed line = async (publish/consume)
- Side panel (MUI) to edit selected node name and selected edge label/type
- Export: JSON (lossless), PNG, SVG
- Import: JSON
- Persistence: autosave to localStorage

Data model
Defined in src/domain/types.ts: NodeType (service|db|queue|worker|external), EdgeType (grpc|rest|publish|consume|read|write), ArchNode, ArchEdge, Diagram (versioned).

Architecture notes
- Domain (schema) is isolated from UI in src/domain/types.ts to enable future backends and validators.
- UI built with React Flow + MUI and a left-side control panel; no backend per MVP.
- Export uses html-to-image for PNG/SVG and native Blob download for JSON.
- State source of truth is React Flow node/edge state; conversions to/from domain schema are centralized in App.tsx.
- Node size is persisted in domain model (ArchNode.size: { w, h }). Existing JSON without size remains compatible.

Roadmap / stretch goals
- Custom renderers per node type (icons/colors) and groups/swimlanes
- Undo/redo, multi-select enhancements, keyboard shortcuts
- Validation (cycles, forbidden deps), deterministic layout helpers
- Mermaid export
- Team sharing, versioning, schema evolution

License
Private/internal for now.