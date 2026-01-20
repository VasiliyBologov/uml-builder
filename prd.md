PRD — Web Architecture Diagram Builder

Target AI: JetBrains Junie AI
Role: Senior Staff Engineer + Product Architect
Goal: Design & implement a browser-based visual editor for distributed backend architectures

1. Product Vision

Build a web-based architecture diagramming tool that allows engineers to visually model distributed monoliths / macro-services systems with:

backend services

databases (Mongo, Redis, Elastic, etc.)

message queues (RabbitMQ, Kafka)

workers (custom schedulers, not cron)

synchronous (REST, gRPC) and async interactions

external APIs

The tool must support interactive editing, clear semantics, and export/import for documentation and onboarding.

2. Target Users

Backend engineers

Tech leads / architects

Onboarding new team members

Teams with:

large services

multiple repositories

service-owned databases

event-driven + RPC communication

3. Core Use Cases
   UC-1: Create architecture diagram

User opens browser → creates new diagram → adds services, databases, queues, workers.

UC-2: Model a distributed monolith

Each service may:

expose REST + gRPC

own multiple databases

use multiple Redis instances

publish / consume RabbitMQ events

UC-3: Manage dependencies

User visually connects:

service → service (REST / gRPC)

service → queue (publish)

worker → queue (consume)

service → database

Each connection has typed semantics.

UC-4: Iterate & refactor

User can:

add/remove nodes

add/remove connections

rename responsibilities

regroup services visually

UC-5: Export / share

User exports diagram as:

PNG / SVG

JSON (machine-readable)

Mermaid (optional)

4. Non-Goals

No runtime monitoring

No deployment automation

No code generation (initially)

No cloud-provider lock-in (AWS-only etc.)

5. Functional Requirements
   5.1 Canvas & Interaction

Infinite zoomable canvas

Drag & drop nodes

Pan / zoom

Multi-select

Undo / redo

Keyboard shortcuts

5.2 Node Types (first-class)
Service

Properties:

name

description / responsibility

protocols: REST / gRPC

tags (core, legacy, critical)

color / group

Database

Types:

MongoDB

Redis

PostgreSQL

ElasticSearch

Properties:

db name

collections / indices (text list)

ownership (linked service)

Queue

Types:

RabbitMQ

Kafka

Generic queue

Properties:

exchange / topic

event names

Worker

Properties:

name

trigger type (queue / time-based custom)

description

External API

Properties:

name

provider

protocol

5.3 Connection Types (Typed Edges)

Each edge MUST have a semantic type:

Type	Meaning
REST	synchronous HTTP
gRPC	synchronous RPC
Publish	async event publish
Consume	async event consume
Read	DB read
Write	DB write

Edge properties:

label (e.g. OrderCreated)

direction

optional notes

Visual requirements:

solid line = sync

dashed line = async

arrowheads for direction

5.4 Grouping & Layers

Support:

swimlanes (Clients / API / Core / Workers / Data / External)

visual grouping (bounded context)

collapse / expand groups

6. UX Requirements

No clutter by default

One service = one visual block

Infrastructure shown as dependencies, not exploded internals

Details visible on selection (side panel)

Legend always visible or togglable

7. Data Model (Internal)
   Diagram
   {
   "id": "uuid",
   "name": "Order System",
   "nodes": [],
   "edges": [],
   "metadata": {}
   }

Node
{
"id": "uuid",
"type": "service | db | queue | worker | external",
"name": "Order Service",
"properties": {},
"position": { "x": 0, "y": 0 }
}

Edge
{
"id": "uuid",
"from": "nodeId",
"to": "nodeId",
"type": "grpc | rest | publish | consume | read | write",
"label": "OrderCreated"
}

8. Export / Import
   Must support:

JSON (lossless)

PNG / SVG (visual)

Mermaid (best-effort)

Example Mermaid mapping:

Service → node

Queue → [[Queue]]

Async → dashed arrow

9. Architecture Constraints (for implementation)
   Frontend

React + TypeScript

Canvas engine: React Flow / Konva / Fabric.js

State: local + persisted JSON

No backend required for MVP

Optional Backend (later)

Save/load diagrams

Team sharing

Versioning

10. Quality Attributes

Deterministic layout (no random jumps)

Fast interaction with 100+ nodes

Clear visual hierarchy

Schema versioning for diagrams

11. AI Agent Expectations (Junie)

As the implementing agent, you MUST:

design clean domain models

keep UI logic separated from domain logic

prioritize readability over visual flair

provide extensibility for new node/edge types

include clear README and architecture notes

12. Success Criteria

Engineer can model a real distributed monolith in <30 minutes

Diagram is understandable without explanation

Exported JSON can be reviewed in code review

Tool becomes source of truth for system architecture

13. Stretch Goals (Optional)

Diff between diagrams

Change history

Validation (cycles, forbidden deps)

Sequence flow highlight

C4 level switching

14. Tone & Philosophy

This tool is:

for engineers

not a drawing app

not a cloud marketing diagram

architecture-first, semantics-first