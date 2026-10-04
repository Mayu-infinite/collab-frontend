# CollabHub

> **A collaborative workspace for writing, sharing, and managing documents in real time.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![TipTap](https://img.shields.io/badge/Editor-TipTap-0F0F0F)](https://tiptap.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

CollabHub is a full-stack collaborative document workspace built around a rich-text editor and real-time communication. Create documents, share them through invite codes, control member access, and see edits and cursor activity update across connected clients.

## ✨ Features

- 📝 **Rich-text editing** powered by TipTap
- ⚡ **Real-time collaboration** with Socket.IO
- 👥 **Shared documents** with Owner, Editor, and Viewer roles
- 🔗 **Invite-based collaboration** for joining shared documents
- 🔐 **Authentication** with email/password and Google OAuth entry point
- 💾 **Automatic persistence** with debounced document saves
- 👀 **Live remote cursors** for collaborative editing
- 📊 **Workspace dashboard** with owned, shared, recent, and searchable documents
- 🧩 **Extensible editor** with tables, images, links, lists, highlights, tasks, alignment, and more
- 🌓 **Theme support** with light/dark mode

## 🧠 Why CollabHub?

Collaborative editors look simple from the outside: type something and everyone sees it.

The interesting engineering problem is keeping multiple connected clients synchronized while maintaining a responsive editing experience.

CollabHub explores that problem through:

- real-time document updates
- concurrent client communication
- collaborative editing
- permission-aware document access
- persistent document storage
- client-side throttling and debouncing

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Next.js App    │
                    │   React + TypeScript│
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
          ┌─────────────┐             ┌─────────────┐
          │ REST API    │             │  Socket.IO  │
          │             │             │             │
          │ Auth        │             │ Live edits  │
          │ Documents   │             │ Cursors     │
          │ Users       │             │ Collaboration│
          └──────┬──────┘             └──────┬──────┘
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  Collaborative     │
                    │  TipTap Editor     │
                    └─────────────────────┘
```

The frontend separates application concerns into routes, UI components, hooks, API services, shared utilities, and TypeScript types.

```text
src/
├── app/          # routes, layouts, dashboard and auth flows
├── components/   # reusable UI and editor components
├── hooks/        # client-side hooks
├── lib/          # shared utilities and API client
├── services/     # auth, document and user service layers
├── styles/       # application styling
└── types/        # shared TypeScript types
```

## 🔄 Collaboration Flow

A typical editing session follows this pattern:

```text
User edits document
        │
        ▼
   TipTap Editor
        │
        ├──────────────► Debounced REST Save
        │
        ▼
    Socket.IO
        │
        ▼
 Collaboration Server
        │
        ├──────────────► Other connected clients
        │
        ▼
 Remote document update
        │
        ▼
   TipTap Editor
```

Cursor positions are also exchanged over Socket.IO so collaborators can see each other's active editing positions.

The editor throttles outgoing document and cursor events to avoid unnecessary traffic while preserving a responsive experience.

## 🛠️ Editor

The TipTap-based editor currently supports:

- Headings
- Bold / italic / underline
- Ordered and unordered lists
- Task lists
- Text alignment
- Highlights
- Links
- Images
- Tables
- Subscript / superscript
- Placeholders
- Character count

The editor also supports image paste/drop handling and dynamically displays collaboration state such as save status and read-only access.

## 🔐 Document Roles

Documents support three access levels:

| Role | Capabilities |
| --- | --- |
| **Owner** | Manage and delete the document |
| **Editor** | Edit document content |
| **Viewer** | Read-only access |

The dashboard exposes the current user's role and whether they can edit or delete a document.

## 📡 Real-Time Communication

Socket.IO is used for live collaboration events including:

- document content updates
- cursor position updates
- cursor removal
- read-only notifications

On the client, outgoing events are throttled and document persistence is debounced so frequent editor updates do not result in excessive network or database requests.

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | TipTap |
| Real-time communication | Socket.IO Client |
| HTTP client | Axios |
| UI primitives | Radix UI |
| Icons | Lucide React |
| Notifications | Sonner |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- A running backend API compatible with the frontend

### Clone

```bash
git clone https://github.com/Mayu-infinite/collab-frontend.git
cd collab-frontend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Set the value to the URL of your running backend.

### Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```text
collab-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── dashboard/
│   │   └── simple/
│   ├── components/
│   │   ├── editor/
│   │   └── tiptap-extension/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   │   ├── auth/
│   │   ├── document/
│   │   ├── interfaces/
│   │   └── user/
│   ├── styles/
│   └── types/
├── package.json
└── README.md
```

## 📌 Project Status

CollabHub is an actively developed project focused on real-time collaborative document editing.

The frontend is designed as a standalone Next.js application and communicates with a backend through REST APIs and Socket.IO.

## 🤝 Contributing

Contributions and suggestions are welcome.

```text
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request
```

## 📄 License

No license is currently specified for this repository.
