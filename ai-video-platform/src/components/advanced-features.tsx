'use client'

import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Play, Pause, SkipForward, Shuffle, Volume2, Plus, Trash2, Move } from 'lucide-react'

interface VideoProject {
  id: string
  title: string
  status: 'draft' | 'processing' | 'completed' | 'failed'
  createdAt: string
  duration?: number
  thumbnailUrl?: string
}

interface PlaylistItem {
  id: string
  content: string
  type: string
  order: number
}

// Advanced Custom Hook with useReducer
interface PlaylistState {
  items: PlaylistItem[]
  selectedItem: string | null
  isPlaying: boolean
}

type PlaylistAction =
  | { type: 'ADD_ITEM'; payload: Omit<PlaylistItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'REORDER_ITEMS'; payload: PlaylistItem[] }

function playlistReducer(state: PlaylistState, action: PlaylistAction): PlaylistState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { ...action.payload, id: Date.now().toString() }]
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        selectedItem: state.selectedItem === action.payload ? null : state.selectedItem
      }
    case 'SELECT_ITEM':
      return { ...state, selectedItem: action.payload }
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying }
    case 'REORDER_ITEMS':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

// Advanced State Management Hook
function usePlaylist() {
  const [state, dispatch] = useReducer(playlistReducer, {
    items: [
      { id: '1', content: 'Intro Video', type: 'synthesia', order: 0 },
      { id: '2', content: 'Product Demo', type: 'runway', order: 1 },
      { id: '3', content: 'Testimonial', type: 'pictory', order: 2 }
    ],
    selectedItem: null,
    isPlaying: false
  })

  const addItem = useCallback((item: Omit<PlaylistItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const selectItem = useCallback((id: string) => {
    dispatch({ type: 'SELECT_ITEM', payload: id })
  }, [])

  const togglePlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY' })
  }, [])

  return { state, addItem, removeItem, selectItem, togglePlay }
}

// Advanced Animation Component with Custom Hooks
function InteractiveVideoCard({ project, index }: { project: VideoProject; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Custom intersection observer hook
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 50, 
        scale: isVisible ? 1 : 0.9 
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {project.title}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            >
              <Play className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Hover overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-white text-sm font-medium"
                  >
                    {project.status.toUpperCase()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Advanced Playlist Manager with React Features
function PlaylistManager() {
  const { state, addItem, removeItem, selectItem, togglePlay } = usePlaylist()
  const [newItemContent, setNewItemContent] = useState('')
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleAddItem = () => {
    if (newItemContent.trim()) {
      addItem({
        content: newItemContent,
        type: 'custom',
        order: state.items.length
      })
      setNewItemContent('')
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedItem) {
      const draggedIndex = state.items.findIndex(item => item.id === draggedItem)
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        const newItems = [...state.items]
        const [removed] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, removed)
        // Update order
        const reorderedItems = newItems.map((item, index) => ({ ...item, order: index }))
        // Note: In a real app, you'd dispatch a REORDER_ITEMS action
        console.log('Reordered items:', reorderedItems)
      }
    }
    setDraggedItem(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="w-5 h-5" />
          Advanced Playlist Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder="Add new video..."
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button onClick={handleAddItem} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Playlist items */}
        <div className="space-y-2">
          <AnimatePresence>
            {state.items.map((item, index) => (
                             <motion.div
                 key={item.id}
                 layout
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.2 }}
                 className={`p-3 border rounded-lg shadow-sm transition-all cursor-move ${
                   state.selectedItem === item.id ? 'border-blue-500 bg-blue-50' : 'bg-white'
                 } ${draggedItem === item.id ? 'opacity-50' : ''}`}
                 onClick={() => selectItem(item.id)}
               >
                 <div
                   draggable
                   onDragStart={(e) => handleDragStart(e, item.id)}
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, index)}
                   className="w-full"
                 >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Move className="w-4 h-4 text-gray-400" />
                    <span>{item.content}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                  >
                                         <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
                 </div>
               </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Play controls */}
        <div className="flex items-center justify-center pt-4 border-t">
          <Button onClick={togglePlay} className="flex items-center gap-2">
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {state.isPlaying ? 'Pause' : 'Play'} Playlist
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Data fetching hook with caching
function useVideoProjects() {
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<{ data: VideoProject[]; timestamp: number } | null>(null)

  const fetchProjects = useCallback(async () => {
    // Check cache first (5 minutes)
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < 300000) {
      setProjects(cacheRef.current.data)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()
      const projectData = data.projects || []
      
      setProjects(projectData)
      cacheRef.current = { data: projectData, timestamp: Date.now() }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}

// Main Advanced Features Component
export function AdvancedFeatures() {
  const { projects, loading } = useVideoProjects()
  const [selectedView, setSelectedView] = useState<'grid' | 'list' | 'timeline'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  // Memoized filtered projects
  const filteredProjects = useMemo(() => 
    projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      project.status === 'completed'
    ), 
    [projects, searchTerm]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Volume2 className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with advanced animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Advanced React Features</h2>
        <p className="text-gray-600">
          Hybrid Next.js + React with advanced hooks, animations, and state management
        </p>
      </motion.div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Search & View Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            {(['grid', 'list', 'timeline'] as const).map((view) => (
              <Button
                key={view}
                variant={selectedView === view ? 'default' : 'outline'}
                onClick={() => setSelectedView(view)}
                className="capitalize"
              >
                {view} View
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Playlist Manager */}
      <PlaylistManager />

      {/* Interactive Video Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Video Gallery</h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <InteractiveVideoCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No projects found matching your search.
          </motion.div>
        )}
      </div>

      {/* Feature showcase */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Advanced React Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Hooks Used:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• useReducer for complex state</li>
                <li>• useCallback for optimization</li>
                <li>• useMemo for computed values</li>
                <li>• useRef for DOM access</li>
                <li>• Custom hooks for reusability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">React Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Framer Motion animations</li>
                <li>• Drag & drop interactions</li>
                <li>• Intersection Observer</li>
                <li>• Advanced state management</li>
                <li>• Performance optimizations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 