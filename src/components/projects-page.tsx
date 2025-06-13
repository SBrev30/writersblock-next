import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, FileText, Clock, TrendingUp, Users, MapPin, Layers } from 'lucide-react';
import { ChaptersPage } from './chapters-page';

interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  wordCount: number;
  targetWordCount: number;
  completionPercentage: number;
  lastModified: Date;
  createdAt: Date;
  chapterCount: number;
  status: 'planning' | 'writing' | 'editing' | 'complete';
}

interface ProjectsPageProps {
  onBack: () => void;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'The Mana Chronicles',
    description: 'A fantasy epic about humans learning to channel mana and forming alliances with Dark Elves to fight an interdimensional demon invasion.',
    genre: 'Fantasy',
    wordCount: 45000,
    targetWordCount: 80000,
    completionPercentage: 56,
    lastModified: new Date('2024-01-15'),
    createdAt: new Date('2023-12-01'),
    chapterCount: 8,
    status: 'writing'
  },
  {
    id: '2',
    title: 'Digital Shadows',
    description: 'A cyberpunk thriller exploring AI consciousness and digital identity in a near-future world.',
    genre: 'Sci-Fi',
    wordCount: 23000,
    targetWordCount: 70000,
    completionPercentage: 33,
    lastModified: new Date('2024-01-10'),
    createdAt: new Date('2024-01-01'),
    chapterCount: 4,
    status: 'writing'
  },
  {
    id: '3',
    title: 'Midnight in Paris',
    description: 'A romantic drama set against the backdrop of Parisian art galleries and hidden family secrets.',
    genre: 'Romance',
    wordCount: 67000,
    targetWordCount: 75000,
    completionPercentage: 89,
    lastModified: new Date('2024-01-12'),
    createdAt: new Date('2023-11-15'),
    chapterCount: 12,
    status: 'editing'
  },
  {
    id: '4',
    title: 'The Last Detective',
    description: 'A noir mystery following Detective Sarah Chen as she investigates a series of connected cold cases.',
    genre: 'Mystery',
    wordCount: 12000,
    targetWordCount: 60000,
    completionPercentage: 20,
    lastModified: new Date('2024-01-08'),
    createdAt: new Date('2024-01-05'),
    chapterCount: 3,
    status: 'planning'
  },
  {
    id: '5',
    title: 'Echoes of Tomorrow',
    description: 'A hard science fiction novel about time manipulation and its consequences on human relationships.',
    genre: 'Sci-Fi',
    wordCount: 89000,
    targetWordCount: 90000,
    completionPercentage: 99,
    lastModified: new Date('2024-01-14'),
    createdAt: new Date('2023-10-20'),
    chapterCount: 15,
    status: 'complete'
  }
];

export function ProjectsPage({ onBack }: ProjectsPageProps) {
  const [projects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'chapters'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'lastModified' | 'progress' | 'wordCount'>('lastModified');

  const statuses = ['all', 'planning', 'writing', 'editing', 'complete'];
  const genres = ['all', ...Array.from(new Set(projects.map(p => p.genre)))];

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesGenre = filterGenre === 'all' || project.genre === filterGenre;
      return matchesSearch && matchesStatus && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'progress':
          return b.completionPercentage - a.completionPercentage;
        case 'wordCount':
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('chapters');
  };

  const handleBackToProjects = () => {
    setCurrentView('overview');
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'writing':
        return 'bg-blue-100 text-blue-800';
      case 'editing':
        return 'bg-orange-100 text-orange-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Layers className="w-4 h-4" />;
      case 'writing':
        return <FileText className="w-4 h-4" />;
      case 'editing':
        return <TrendingUp className="w-4 h-4" />;
      case 'complete':
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (currentView === 'chapters' && selectedProject) {
    return (
      <ChaptersPage
        projectId={selectedProject.id}
        projectTitle={selectedProject.title}
        onBack={handleBackToProjects}
      />
    );
  }

  return (
    <div className="h-screen bg-[#F9FAFB] flex flex-col font-inter">
      {/* Header */}
      <div className="bg-white border-b border-[#C6C5C5] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#889096]" />
            </button>
            
            <div className="flex-1">
              <nav className="flex items-center space-x-2 text-sm text-[#889096] font-semibold mb-2">
                <button onClick={onBack} className="hover:text-gray-700 transition-colors">
                  Write
                </button>
                <span className="text-[#889096]">›</span>
                <span className="text-gray-900">Projects</span>
              </nav>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 font-inter">
                    Your Writing Projects
                  </h1>
                  <p className="text-[#889096] mt-1">
                    {filteredAndSortedProjects.length} projects • {projects.reduce((sum, p) => sum + p.wordCount, 0).toLocaleString()} total words
                  </p>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-[#A5F7AC] hover:bg-[#A5F7AC]/80 rounded-lg transition-colors font-semibold">
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#889096]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#889096]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="lastModified">Last Modified</option>
              <option value="title">Title</option>
              <option value="progress">Progress</option>
              <option value="wordCount">Word Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-[#889096]">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className="bg-white rounded-lg border border-[#C6C5C5] p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(project.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            {project.genre}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[#889096] text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">
                        {formatWordCount(project.wordCount)} / {formatWordCount(project.targetWordCount)} words
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#A5F7AC] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-[#889096]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{project.chapterCount} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{project.completionPercentage}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(project.lastModified)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}