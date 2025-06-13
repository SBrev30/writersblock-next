import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { Editor } from './Editor';
import { NotesPanel } from './NotesPanel';
import { Canvas } from './Canvas';
import { ProjectsPage } from './projects-page';
import { History } from './History';
import { Integration } from './Integration';
import { StatusDashboard } from './StatusDashboard';
import { Search } from 'lucide-react';
import { EditorContent, Note } from '../types';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notesPanelCollapsed, setNotesPanelCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('write');
  
  const [editorContent, setEditorContent] = useState<EditorContent>({
    title: 'Origin',
    content: '<p>I thought learning to channel mana was difficult until I met Sylandria. The Dark Elf princess moved like shadow given form, her mana control making my six months of training look like a child playing with matches beside a master pyromancer.</p><p>"Your kind wastes so much energy," she told me during our first training session, her silver eyes narrowing as she watched me manifest a mana blade. "You leak mana like a sieve."</p><p>She placed her obsidian hand over mine, and I felt a strange pulling sensation as she absorbed the excess mana I couldn\'t properly control. The blue markings on my arm dimmed momentarily.</p><p>"The demons call your world \'The Wellspring\'," she explained later. "They\'ve been planning this invasion for centuries. Vazriel needs human Channelers—not as opponents, but as batteries. Your awakened abilities are merely side effects of his ritual beginning."</p><p>When I asked why she was helping us, her expression darkened. "Self-preservation, human. If Vazriel succeeds, all worlds collapse. Besides," her lips curved into a rare smile, "my house has a particular interest in your bloodline. Those markings you carry... they\'re not entirely human in origin."</p><p>The alliance between humans and Dark Elves reshapes the power dynamics in this new world. Dark Elf nobles begin seeking out specific human Channelers with unique mana signatures, revealing that certain human bloodlines carry traces of ancient cross-dimensional contact. These special Channelers discover they can form blood pacts with Dark Elves, dramatically enhancing both parties\' abilities.</p>',
    wordCount: 87,
    lastSaved: new Date(),
  });

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Sarah Character Profile',
      content: 'Protagonist, age 28, journalist investigating mysterious occurrences in small town',
      category: 'Person' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'The Old Oak Tree',
      content: 'Central location in the story. Ancient oak with mystical properties. Located at forest edge.',
      category: 'Place' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'The Journal Mystery',
      content: 'Sarah discovers a journal containing predictions about town events. Key plot device.',
      category: 'Plot' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleEditorChange = useCallback((content: EditorContent) => {
    setEditorContent(content);
  }, []);

  const handleAddNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const handleEditNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'write':
        return (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <Editor
                content={editorContent}
                onChange={handleEditorChange}
              />
            </div>
            
            <NotesPanel
              notes={notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              isCollapsed={notesPanelCollapsed}
            />
          </div>
        );

      case 'projects':
        return (
          <ProjectsPage onBack={() => setActiveView('write')} />
        );
      
      case 'canvas':
        return <Canvas />;

      case 'dashboard':
        return <StatusDashboard />;

      case 'history':
        return <History onBack={() => setActiveView('settings')} />;

      case 'integrations':
        return <Integration onBack={() => setActiveView('settings')} />;

      case 'planning':
      case 'outline':
      case 'plot':
      case 'characters':
      case 'world-building':
        return (
          <div className="flex-1 flex items-center justify-center bg-white rounded-t-[17px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{activeView.replace('-', ' ')}</h2>
              <p className="text-gray-600">Planning tools coming soon</p>
            </div>
          </div>
        );

      case 'files':
      case 'settings':
      case 'help':
      case 'help-topics':
      case 'get-started':
      case 'ask-question':
      case 'get-feedback':
        return (
          <div className="flex-1 flex items-center justify-center bg-white rounded-t-[17px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{activeView.replace('-', ' ')}</h2>
              <p className="text-gray-600">Coming soon</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <Editor
                content={editorContent}
                onChange={handleEditorChange}
              />
            </div>
            
            <NotesPanel
              notes={notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              isCollapsed={notesPanelCollapsed}
            />
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#F9FAFB] flex font-inter overflow-hidden">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {(activeView === 'write' || activeView === 'projects') && (
          <div className="h-[72px] flex items-end justify-between px-6 pb-3">
            <Breadcrumb />
            
            <div className="bg-[#FAF9F9] rounded-[20px] h-[29px] w-[171px] flex items-center px-3 gap-2">
              <Search className="w-[17px] h-[17px] text-[#889096]" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent text-sm text-gray-600 outline-none flex-1 font-inter"
              />
            </div>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}

export default App;