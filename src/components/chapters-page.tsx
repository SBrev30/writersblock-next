import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, FileText, Clock, TrendingUp, MoreHorizontal, Edit3, Eye } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  targetWordCount: number;
  status: 'outline' | 'draft' | 'revision' | 'final';
  lastModified: Date;
  createdAt: Date;
  tags: string[];
  notes: string;
  order: number;
}

interface ChaptersPageProps {
  projectId: string;
  projectTitle: string;
  onBack: () => void;
  onSelectChapter?: (chapterId: string) => void;
  onCreateChapter?: () => void;
  onEditChapter?: (chapterId: string) => void;
}

const sampleChapters: Chapter[] = [
  {
    id: '1',
    title: 'Chapter 1: Origin',
    description: 'Introduction to the protagonist and their first encounter with Sylandria, the Dark Elf princess who will change everything.',
    wordCount: 2847,
    targetWordCount: 3000,
    status: 'draft',
    lastModified: new Date('2024-01-15T14:30:00'),
    createdAt: new Date('2023-12-01T10:00:00'),
    tags: ['introduction', 'sylandria', 'mana'],
    notes: 'Need to expand the training sequence and add more dialogue between characters.',
    order: 1
  },
  {
    id: '2',
    title: 'Chapter 2: The Training',
    description: 'Protagonist begins mana control training with Dark Elf techniques, learning about the true nature of the dimensional threat.',
    wordCount: 1923,
    targetWordCount: 3000,
    status: 'outline',
    lastModified: new Date('2024-01-14T16:20:00'),
    createdAt: new Date('2023-12-02T09:00:00'),
    tags: ['training', 'mana-control', 'dark-elves'],
    notes: 'Focus on the contrast between human and Dark Elf mana channeling techniques.',
    order: 2
  },
  {
    id: '3',
    title: 'Chapter 3: The Alliance',
    description: 'Political tensions rise as humans and Dark Elves negotiate an unprecedented alliance against the demon threat.',
    wordCount: 0,
    targetWordCount: 3000,
    status: 'outline',
    lastModified: new Date('2024-01-13T11:45:00'),
    createdAt: new Date('2023-12-03T14:30:00'),
    tags: ['politics', 'alliance', 'demons'],
    notes: 'Explore the cultural barriers and mutual distrust that must be overcome.',
    order: 3
  },
  {
    id: '4',
    title: 'Chapter 4: Blood Pacts',
    description: 'Discovery of ancient blood pact rituals that can enhance both human and Dark Elf abilities, but at what cost?',
    wordCount: 2156,
    targetWordCount: 3000,
    status: 'revision',
    lastModified: new Date('2024-01-12T13:15:00'),
    createdAt: new Date('2023-12-04T16:00:00'),
    tags: ['blood-pacts', 'magic-system', 'sacrifice'],
    notes: 'The ritual scene needs more emotional weight and clearer consequences.',
    order: 4
  },
  {
    id: '5',
    title: 'Chapter 5: The Wellspring',
    description: 'Journey to the heart of the dimensional rift where the true scope of the demon invasion becomes clear.',
    wordCount: 2945,
    targetWordCount: 3000,
    status: 'final',
    lastModified: new Date('2024-01-11T09:30:00'),
    createdAt: new Date('2023-12-05T12:00:00'),
    tags: ['wellspring', 'dimensional-rift', 'revelation'],
    notes: 'This chapter is complete and ready for publication.',
    order: 5
  }
];

export function ChaptersPage({ 
  projectId, 
  projectTitle, 
  onBack, 
  onSelectChapter, 
  onCreateChapter,
  onEditChapter 
}: ChaptersPageProps) {
  const [chapters] = useState<Chapter[]>(sampleChapters);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'lastModified' | 'wordCount'>('order');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const statuses = ['all', 'outline', 'draft', 'revision', 'final'];

  const filteredAndSortedChapters = chapters
    .filter(chapter => {
      const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chapter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chapter.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || chapter.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'order':
          return a.order - b.order;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'wordCount':
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'outline':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'revision':
        return 'bg-orange-100 text-orange-800';
      case 'final':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'outline':
        return '📋';
      case 'draft':
        return '✏️';
      case 'revision':
        return '🔄';
      case 'final':
        return '✅';
      default:
        return '📄';
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

  const getProgressPercentage = (wordCount: number, targetWordCount: number) => {
    if (targetWordCount === 0) return 0;
    return Math.min((wordCount / targetWordCount) * 100, 100);
  };

  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
  const totalTargetWords = chapters.reduce((sum, chapter) => sum + chapter.targetWordCount, 0);
  const overallProgress = Math.round((totalWords / totalTargetWords) * 100);

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
                  Projects
                </button>
                <span className="text-[#889096]">›</span>
                <span className="text-gray-900">{projectTitle}</span>
              </nav>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 font-inter">
                    Chapters
                  </h1>
                  <p className="text-[#889096] mt-1">
                    {filteredAndSortedChapters.length} chapters • {formatWordCount(totalWords)} / {formatWordCount(totalTargetWords)} words • {overallProgress}% complete
                  </p>
                </div>
                
                <button
                  onClick={onCreateChapter}
                  className="flex items-center gap-2 px-4 py-2 bg-[#A5F7AC] hover:bg-[#A5F7AC]/80 rounded-lg transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  New Chapter
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#889096]" />
              <input
                type="text"
                placeholder="Search chapters..."
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="order">Chapter Order</option>
              <option value="title">Title</option>
              <option value="lastModified">Last Modified</option>
              <option value="wordCount">Word Count</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-[#F9FAFB] rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-medium">Overall Progress</span>
              <span className="text-gray-600">{formatWordCount(totalWords)} / {formatWordCount(totalTargetWords)} words</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-[#A5F7AC] h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">{overallProgress}% complete</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedChapters.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No chapters found</h3>
                <p className="text-[#889096]">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredAndSortedChapters.map(chapter => (
                <div
                  key={chapter.id}
                  className="bg-white rounded-lg border border-[#C6C5C5] p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getStatusIcon(chapter.status)}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{chapter.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chapter.status)}`}>
                            {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-[#889096] text-sm mb-4">{chapter.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-600">
                            {formatWordCount(chapter.wordCount)} / {formatWordCount(chapter.targetWordCount)} words
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#A5F7AC] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(chapter.wordCount, chapter.targetWordCount)}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags and Notes */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {chapter.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {chapter.notes && (
                          <div className="bg-[#F9FAFB] rounded-lg p-3">
                            <p className="text-sm text-gray-600 italic">{chapter.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-xs text-[#889096] mt-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Modified {formatDate(chapter.lastModified)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{Math.round(getProgressPercentage(chapter.wordCount, chapter.targetWordCount))}% complete</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onSelectChapter?.(chapter.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Read Chapter"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => onEditChapter?.(chapter.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Chapter"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedChapters.map(chapter => (
                <div
                  key={chapter.id}
                  className="bg-white rounded-lg border border-[#C6C5C5] p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(chapter.status)}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chapter.status)}`}>
                        {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{chapter.title}</h3>
                  <p className="text-[#889096] text-sm mb-4 line-clamp-3">{chapter.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">
                        {formatWordCount(chapter.wordCount)} / {formatWordCount(chapter.targetWordCount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#A5F7AC] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(chapter.wordCount, chapter.targetWordCount)}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {chapter.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {chapter.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{chapter.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-[#889096]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(chapter.lastModified)}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onSelectChapter?.(chapter.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Read"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onEditChapter?.(chapter.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
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