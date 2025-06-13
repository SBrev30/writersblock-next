# WritersBlock Next

Advanced writing platform for visual storytellers built with Next.js and React.

## Features

### Core Writing Tools
- **Rich Text Editor**: Full-featured editor with formatting, auto-save, and page breaks
- **Projects Management**: Organize writing projects with chapters, word count tracking, and progress monitoring
- **Notes System**: Categorized note-taking with real-time sync for characters, places, plots, and misc notes
- **Visual Canvas**: Interactive mind-mapping with drag-and-drop nodes and connections

### Project Organization
- **Chapter Management**: Create, edit, and organize chapters with word count goals and status tracking
- **Project Library**: Visual bookshelf interface for browsing and managing multiple writing projects
- **Progress Tracking**: Real-time word count and completion percentage tracking
- **Status Dashboard**: Overview of development progress and feature completion

### Advanced Features
- **Integration Support**: Connect with Notion and Google Docs for importing content
- **History Tracking**: Comprehensive change log for all edits, creations, and deletions
- **Responsive Design**: Optimized for different screen sizes and zoom levels
- **Theme System**: Light/dark mode with system preference detection

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/           # React components
│   ├── App.tsx          # Main application component
│   ├── Editor.tsx       # Rich text editor
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── NotesPanel.tsx   # Notes management panel
│   ├── Canvas.tsx       # Visual brainstorming canvas
│   ├── projects-page.tsx # Projects overview
│   ├── chapters-page.tsx # Chapter management
│   ├── History.tsx      # Change tracking
│   └── Integration.tsx  # External integrations
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useAutoSave.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── main.tsx            # Application entry point
```

## Key Components

### Editor
- Multi-page support with automatic page breaks
- Rich formatting options (fonts, sizes, alignment)
- Real-time word counting
- Auto-save functionality
- Responsive design that adapts to screen size and zoom level

### Projects & Chapters
- Project overview with progress tracking
- Chapter management with status tracking (outline, draft, revision, final)
- Filtering and sorting capabilities
- List and grid view modes

### Notes System
- Categorized notes (Person, Place, Plot, Misc)
- Real-time filtering and organization
- Quick add functionality
- Sample data for demonstration

### Canvas
- Visual mind-mapping tool
- Drag-and-drop node creation
- Connection system between nodes
- Different node types (text, character, location, plot)
- Zoom and pan controls

## Development Status

### Completed Features ✅
- Rich Text Editor with formatting
- Visual Canvas with node connections
- Project Library with Kanban boards
- Notes System with categorization
- Theme System (Light/Dark)
- Responsive Design
- Projects and Chapters management
- History tracking
- Integration framework

### Planned Features 🚧
- AI Integration for story development
- Real-time collaboration
- Advanced import/export capabilities
- Enhanced planning tools
- Mobile app version

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:3000

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License - see LICENSE file for details.
