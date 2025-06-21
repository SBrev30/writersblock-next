import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Sentry from '@sentry/react';
import { 
  ReactFlow, 
  ReactFlowProvider, 
  useNodesState, 
  useEdgesState, 
  useReactFlow,
  Background, 
  Controls, 
  MiniMap, 
  Handle, 
  Position,
  ConnectionLineType,
  NodeTypes
} from 'reactflow';
import { 
  User, 
  BookOpen, 
  Edit2, 
  Copy, 
  Trash2, 
  RefreshCw,
  FileText,
  Clock
} from 'lucide-react';

// Type definitions (same as before)
interface CharacterNodeData {
  name: string;
  role: string;
  description?: string;
}

interface PlotNodeData {
  title: string;
  type: string;
  description?: string;
}

interface AnalysisResults {
  overallScore: number;
  conflicts: Array<{ severity: string }>;
  recommendations: string[];
}

// Enhanced Error Test Button Component
const SentryErrorTestButton: React.FC = () => {
  const handleError = () => {
    try {
      throw new Error("This is your first error from EnhancedCanvas!");
    } catch (error) {
      // Manually capture the error with additional context
      Sentry.captureException(error, {
        tags: {
          component: 'EnhancedCanvas',
          action: 'manual_error_test'
        },
        extra: {
          timestamp: new Date().toISOString(),
          userAction: 'clicked_error_button'
        }
      });
      throw error; // Re-throw to trigger error boundary
    }
  };

  return (
    <button 
      onClick={handleError}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      🚨 Break the Canvas World
    </button>
  );
};

// Mock providers with error handling
const MasterCanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const useCloudStorage = (userId: string) => {
  return {
    saveToCloud: async () => {
      // Simulate potential cloud storage errors
      if (Math.random() > 0.8) {
        const error = new Error('Cloud storage connection failed');
        Sentry.captureException(error, {
          tags: { service: 'cloud_storage' },
          extra: { userId }
        });
        throw error;
      }
    },
    loadFromCloud: async () => {
      // Simulate loading errors
      if (Math.random() > 0.9) {
        throw new Error('Failed to load from cloud');
      }
    },
    syncStatus: 'synced' as const,
    isOnline: true
  };
};

const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  
  const setValueWithErrorHandling = (newValue: any) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      Sentry.captureException(error, {
        tags: { service: 'local_storage' },
        extra: { key, attemptedValue: newValue }
      });
    }
  };
  
  return [value, setValueWithErrorHandling];
};

const useAutoSave = (data: any) => {
  return {
    lastSaved: null as Date | null,
    isSaving: false
  };
};

// Enhanced Character Node with Error Handling
const CharacterNode = Sentry.withSentryProfiling(({ data, id }: { data: CharacterNodeData; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.name || 'Unnamed Character');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'protagonist': return 'bg-green-100 border-green-300 text-green-800';
      case 'antagonist': return 'bg-red-100 border-red-300 text-red-800';
      case 'supporting': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'minor': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleEdit = () => {
    try {
      if (isEditing) {
        if (!data) {
          throw new Error('Character data is undefined');
        }
        data.name = editValue;
        setIsEditing(false);
        
        // Track successful edit
        Sentry.addBreadcrumb({
          message: 'Character name edited',
          category: 'user_action',
          data: { characterId: id, newName: editValue }
        });
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { component: 'CharacterNode', action: 'edit' },
        extra: { characterId: id, data }
      });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${getRoleColor(data?.role || 'minor')} min-w-[200px]`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-gray-400" />
      
      <div className="flex items-center justify-between mb-2">
        <User className="w-4 h-4" />
        <button
          onClick={handleEdit}
          className="p-1 hover:bg-white/50 rounded"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      
      {isEditing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          className="w-full bg-transparent border-none outline-none font-bold text-sm"
          autoFocus
        />
      ) : (
        <div className="font-bold text-sm mb-1">{data?.name || 'Unnamed'}</div>
      )}
      
      <div className="text-xs opacity-75 capitalize">{data?.role || 'minor'}</div>
      {data?.description && (
        <div className="text-xs mt-2 opacity-90">{data.description.substring(0, 50)}...</div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-gray-400" />
    </div>
  );
});

// Enhanced Plot Node with Error Handling
const PlotNode = Sentry.withSentryProfiling(({ data, id }: { data: PlotNodeData; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.title || 'Untitled Plot');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'conflict': return 'bg-red-100 border-red-300 text-red-800';
      case 'resolution': return 'bg-green-100 border-green-300 text-green-800';
      case 'twist': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleEdit = () => {
    try {
      if (isEditing) {
        if (!data) {
          throw new Error('Plot data is undefined');
        }
        data.title = editValue;
        setIsEditing(false);
        
        // Track successful edit
        Sentry.addBreadcrumb({
          message: 'Plot title edited',
          category: 'user_action', 
          data: { plotId: id, newTitle: editValue }
        });
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { component: 'PlotNode', action: 'edit' },
        extra: { plotId: id, data }
      });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${getTypeColor(data?.type || 'event')} min-w-[200px]`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-gray-400" />
      
      <div className="flex items-center justify-between mb-2">
        <BookOpen className="w-4 h-4" />
        <button
          onClick={handleEdit}
          className="p-1 hover:bg-white/50 rounded"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      
      {isEditing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          className="w-full bg-transparent border-none outline-none font-bold text-sm"
          autoFocus
        />
      ) : (
        <div className="font-bold text-sm mb-1">{data?.title || 'Untitled'}</div>
      )}
      
      <div className="text-xs opacity-75 capitalize">{data?.type || 'event'}</div>
      {data?.description && (
        <div className="text-xs mt-2 opacity-90">{data.description.substring(0, 50)}...</div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-gray-400" />
    </div>
  );
});

// Mock CanvasToolbar with error test button
const CanvasToolbar: React.FC<{
  onCreateNode: (type: string) => void;
  onTemplate: (templateId: string) => void;
  onSave: () => void;
  onLoad: () => void;
  lastSaved: Date | null;
  isSaving: boolean;
  selectedNodes: string[];
  onAnalyzeAI: () => void;
  isAnalyzing: boolean;
  syncStatus: string;
  isOnline: boolean;
  canvasMode: string;
  onModeChange: (mode: string) => void;
  onGenerateMasterCanvas: () => void;
}> = (props) => {
  return (
    <div className="canvas-toolbar space-y-4">
      <div>Canvas Toolbar</div>
      <SentryErrorTestButton />
    </div>
  );
};

// Mock CharacterPopup component
const CharacterPopup: React.FC<{
  character: any;
  position: { x: number; y: number };
  onClose: () => void;
  onExpand: () => void;
}> = ({ character, position, onClose, onExpand }) => {
  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg border p-4 z-50"
      style={{ left: position.x, top: position.y }}
    >
      <h3>{character?.name || 'Unknown Character'}</h3>
      <button onClick={onClose}>Close</button>
      <button onClick={onExpand}>Expand</button>
    </div>
  );
};

// Enhanced Canvas Flow with Error Boundary
const CanvasFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'exploratory' | 'master'>('exploratory');
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [popupCharacter, setPopupCharacter] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [masterCanvasLoading, setMasterCanvasLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  // Enhanced hooks with error handling
  const { syncStatus, isOnline } = useCloudStorage('user-id');
  const [canvasData, setCanvasData] = useLocalStorage('canvas-data', { nodes: [], edges: [] });
  const { lastSaved, isSaving } = useAutoSave({ nodes, edges });

  const nodeTypes: NodeTypes = useMemo(() => ({
    character: CharacterNode,
    plot: PlotNode,
  }), []);

  // Enhanced functions with error tracking
  const createNode = (type: string) => {
    try {
      console.log('Create node:', type);
      Sentry.addBreadcrumb({
        message: 'Node created',
        category: 'user_action',
        data: { nodeType: type }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'create_node' },
        extra: { nodeType: type }
      });
    }
  };

  const loadTemplate = (templateId: string) => {
    try {
      console.log('Load template:', templateId);
      Sentry.addBreadcrumb({
        message: 'Template loaded',
        category: 'user_action',
        data: { templateId }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'load_template' },
        extra: { templateId }
      });
    }
  };

  const handleToolbarAction = (action: string) => {
    try {
      console.log('Toolbar action:', action);
      Sentry.addBreadcrumb({
        message: 'Toolbar action performed',
        category: 'user_action',
        data: { action }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'toolbar_action' },
        extra: { action }
      });
    }
  };

  const onConnect = useCallback(() => {
    try {
      // Connection logic here
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'node_connection' }
      });
    }
  }, []);

  const onSelectionChange = useCallback(() => {
    try {
      // Selection logic here
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'selection_change' }
      });
    }
  }, []);

  // Primary Toolbar Component
  const PrimaryToolbar = ({ 
    selectedNodes, 
    onAction, 
    position 
  }: { 
    selectedNodes: string[]; 
    onAction: (action: string) => void;
    position: { x: number; y: number };
  }) => {
    if (selectedNodes.length === 0) return null;

    return (
      <div
        className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-50"
        style={{
          left: position.x,
          top: position.y - 50,
          transform: 'translateX(-50%)'
        }}
      >
        <button
          onClick={() => onAction('duplicate')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('delete')}
          className="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#F9FAFB] flex font-inter relative">
      {/* Canvas Toolbar */}
      <div className="w-64 bg-white border-r border-[#C6C5C5] p-4 overflow-y-auto">
        <CanvasToolbar
          onCreateNode={createNode}
          onTemplate={loadTemplate}
          onSave={() => {}}
          onLoad={() => {}}
          lastSaved={lastSaved}
          isSaving={isSaving}
          selectedNodes={selectedNodes}
          onAnalyzeAI={() => {}}
          isAnalyzing={false}
          syncStatus={syncStatus}
          isOnline={isOnline}
          canvasMode={canvasMode}
          onModeChange={setCanvasMode}
          onGenerateMasterCanvas={() => {}}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            className="bg-[#F9FAFB]"
            nodesDraggable={canvasMode === 'exploratory'}
            nodesConnectable={canvasMode === 'exploratory'}
            elementsSelectable={true}
          >
            <Background color="#E2E8F0" size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'character': return '#A5F7AC';
                  case 'plot': return '#FEE2E2';
                  case 'research': return '#E0E7FF';
                  case 'chapter': return '#F3E8FF';
                  default: return '#F3F4F6';
                }
              }}
            />
          </ReactFlow>

          {/* Primary Toolbar - Only show in exploratory mode */}
          {showToolbar && canvasMode === 'exploratory' && (
            <PrimaryToolbar
              selectedNodes={selectedNodes}
              onAction={handleToolbarAction}
              position={toolbarPosition}
            />
          )}

          {/* Character Popup */}
          {showCharacterPopup && popupCharacter && (
            <CharacterPopup
              character={popupCharacter}
              position={popupPosition}
              onClose={() => setShowCharacterPopup(false)}
              onExpand={() => {
                setShowCharacterPopup(false);
                console.log('Navigate to character profile');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main Canvas Component with Error Boundary
const Canvas = () => {
  return (
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Canvas Error</h2>
          <p className="text-gray-600 mb-4">Something went wrong with the canvas component.</p>
          <p className="text-sm text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )}>
      <MasterCanvasProvider>
        <ReactFlowProvider>
          <CanvasFlow />
        </ReactFlowProvider>
      </MasterCanvasProvider>
    </Sentry.ErrorBoundary>
  );
};

export default Canvas;