'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import VideoPlayer from '@/components/VideoPlayer'
import { 
  Search,
  Upload,
  Video,
  Play,
  Download,
  Zap,
  Wand2,
  Image as ImageIcon,
  Users,
  Bell,
  User,
  Settings,
  Plus,
  Folder,
  Palette,
  BarChart3,
  Clock,
  Star,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'

// Navigation type
type NavigationSection = 'dashboard' | 'projects' | 'assets' | 'brand-kit'

// Video creation types
interface VideoCreationJob {
  id: string
  title: string
  source: string
  sourceType: 'url' | 'file'
  status: 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: string
  estimatedTime?: string
}

// Mock data for template galleries
const avatarTemplates = [
  { id: 1, title: 'Avatar Marketing Video', category: 'Business' },
  { id: 2, title: 'Video Avatar', category: 'Education' },
  { id: 3, title: 'Product Avatar', category: 'Product' },
  { id: 4, title: 'Product Explained', category: 'Tutorial' },
  { id: 5, title: 'Presenter Avatar', category: 'Presenter' },
  { id: 6, title: 'Face Swap', category: 'Creative' },
  { id: 7, title: 'Basic Link-to-Video', category: 'Simple' },
  { id: 8, title: 'Photo Avatar', category: 'Photo' }
]

const productTemplates = [
  { id: 1, title: 'Online Business', views: '2.3M', category: 'Business' },
  { id: 2, title: 'Influencer Review', views: '1.8M', category: 'Review' },
  { id: 3, title: 'Product Demo', views: '3.1M', category: 'Demo' },
  { id: 4, title: 'Tech Review', views: '890K', category: 'Tech' },
  { id: 5, title: 'Fashion Brand', views: '1.2M', category: 'Fashion' },
  { id: 6, title: 'Beauty Product', views: '2.7M', category: 'Beauty' },
  { id: 7, title: 'Food & Lifestyle', views: '1.5M', category: 'Lifestyle' },
  { id: 8, title: 'Travel Vlog', views: '920K', category: 'Travel' }
]

const videoAvatars = [
  { id: 1, name: 'Sarah', style: 'Professional' },
  { id: 2, name: 'Michael', style: 'Casual' },
  { id: 3, name: 'Emma', style: 'Trendy' },
  { id: 4, name: 'David', style: 'Executive' },
  { id: 5, name: 'Lisa', style: 'Creative' },
  { id: 6, name: 'James', style: 'Tech' },
  { id: 7, name: 'Anna', style: 'Elegant' },
  { id: 8, name: 'Robert', style: 'Authority' },
  { id: 9, name: 'Maya', style: 'Energetic' }
]

const recentProjects = [
  { id: 1, title: 'Client 2 Moira Nail Career Line', duration: '1:12 mins long', progress: 85, status: 'completed', views: 1250 },
  { id: 2, title: 'Cybro DR Rone Power Strip with A...', duration: '1:18 mins long', progress: 92, status: 'processing', views: 890 },
  { id: 3, title: 'Beauty Product Launch Campaign', duration: '2:15 mins long', progress: 100, status: 'completed', views: 3400 },
  { id: 4, title: 'Tech Review - Latest Smartphone', duration: '1:45 mins long', progress: 67, status: 'processing', views: 0 }
]

const assetLibrary = [
  { id: 1, name: 'Corporate Logo.png', type: 'image', size: '2.4 MB', dateAdded: '2024-01-15' },
  { id: 2, name: 'Background Music.mp3', type: 'audio', size: '5.1 MB', dateAdded: '2024-01-14' },
  { id: 3, name: 'Product Demo.mp4', type: 'video', size: '45.2 MB', dateAdded: '2024-01-13' },
  { id: 4, name: 'Brand Colors.json', type: 'color', size: '1.2 KB', dateAdded: '2024-01-12' },
  { id: 5, name: 'Company Intro.mov', type: 'video', size: '128.7 MB', dateAdded: '2024-01-11' },
  { id: 6, name: 'Voice Over Script.txt', type: 'text', size: '3.4 KB', dateAdded: '2024-01-10' }
]

const brandElements = [
  { id: 1, name: 'Primary Logo', type: 'logo', category: 'branding' },
  { id: 2, name: 'Secondary Logo', type: 'logo', category: 'branding' },
  { id: 3, name: 'Brand Colors', type: 'color-palette', category: 'colors' },
  { id: 4, name: 'Typography', type: 'font', category: 'typography' },
  { id: 5, name: 'Brand Guidelines', type: 'document', category: 'guidelines' },
  { id: 6, name: 'Social Media Kit', type: 'template', category: 'social' }
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeNav, setActiveNav] = useState<NavigationSection>('dashboard')
  const [isCreatingVideo, setIsCreatingVideo] = useState(false)
  const [videoJobs, setVideoJobs] = useState<VideoCreationJob[]>([])
  const [showJobModal, setShowJobModal] = useState(false)
  const [currentJob, setCurrentJob] = useState<VideoCreationJob | null>(null)
  const [projects, setProjects] = useState(recentProjects)
  const [completedVideos, setCompletedVideos] = useState<any[]>([])
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  // Fetch completed videos from API
  const fetchCompletedVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setCompletedVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    }
  }

  // Load videos on component mount
  useEffect(() => {
    fetchCompletedVideos()
  }, [])

  // URL validation function
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Extract domain name from URL
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch (_) {
      return 'Unknown Source'
    }
  }

  // Handle video play
  const handlePlayVideo = (video: any) => {
    setSelectedVideo(video)
    setShowVideoPlayer(true)
  }

  // Handle video download
  const handleDownloadVideo = (video: any) => {
    // In a real app, this would download the actual video file
    alert(`Downloading video: ${video.title}`)
  }

  // Generate random progress
  const generateProgress = () => Math.floor(Math.random() * 30) + 10

  // Simulate video creation process
  const simulateVideoCreation = async (job: VideoCreationJob) => {
    const updateProgress = (progress: number) => {
      setVideoJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, progress, status: progress === 100 ? 'completed' : 'processing' } : j
      ))
      if (currentJob?.id === job.id) {
        setCurrentJob(prev => prev ? { ...prev, progress, status: progress === 100 ? 'completed' : 'processing' } : null)
      }
    }

    // Simulate processing stages
    const stages = [
      { progress: 15, delay: 1000, message: 'Analyzing content...' },
      { progress: 35, delay: 1500, message: 'Generating script...' },
      { progress: 55, delay: 2000, message: 'Creating visuals...' },
      { progress: 75, delay: 2500, message: 'Adding effects...' },
      { progress: 90, delay: 1500, message: 'Finalizing video...' },
      { progress: 100, delay: 1000, message: 'Complete!' }
    ]

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay))
      updateProgress(stage.progress)
    }

    // Add to projects when complete
    const newProject = {
      id: Date.now(),
      title: job.title,
      duration: `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} mins long`,
      progress: 100,
      status: 'completed' as const,
      views: 0
    }

    setProjects(prev => [newProject, ...prev])
  }

  const handleCreateVideo = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a URL or upload a file first')
      return
    }

    if (!isValidUrl(searchTerm)) {
      alert('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setIsCreatingVideo(true)

    // Create new video job
    const newJob: VideoCreationJob = {
      id: Date.now().toString(),
      title: `AI Video from ${getDomainFromUrl(searchTerm)}`,
      source: searchTerm,
      sourceType: 'url',
      status: 'processing',
      progress: 5,
      createdAt: new Date().toISOString(),
      estimatedTime: '3-5 minutes'
    }

    setVideoJobs(prev => [newJob, ...prev])
    setCurrentJob(newJob)
    setShowJobModal(true)
    setSearchTerm('')

    try {
      // Start the video creation simulation
      await simulateVideoCreation(newJob)
    } catch (error) {
      // Handle error
      setVideoJobs(prev => prev.map(j => 
        j.id === newJob.id ? { ...j, status: 'failed', progress: 0 } : j
      ))
    } finally {
      setIsCreatingVideo(false)
    }
  }

  const handleUploadFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*,audio/*,image/*,text/*,application/*'
    input.multiple = false
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setIsCreatingVideo(true)

        // Create new video job for file upload
        const newJob: VideoCreationJob = {
          id: Date.now().toString(),
          title: `AI Video from ${file.name}`,
          source: file.name,
          sourceType: 'file',
          status: 'processing',
          progress: 10,
          createdAt: new Date().toISOString(),
          estimatedTime: '2-4 minutes'
        }

        setVideoJobs(prev => [newJob, ...prev])
        setCurrentJob(newJob)
        setShowJobModal(true)

        try {
          // Simulate file upload and processing
          await simulateVideoCreation(newJob)
        } catch (error) {
          setVideoJobs(prev => prev.map(j => 
            j.id === newJob.id ? { ...j, status: 'failed', progress: 0 } : j
          ))
        } finally {
          setIsCreatingVideo(false)
        }
      }
    }
    
    input.click()
  }

  const handleTemplateClick = (template: any) => {
    setIsCreatingVideo(true)

    const newJob: VideoCreationJob = {
      id: Date.now().toString(),
      title: `${template.title} Video`,
      source: template.title,
      sourceType: 'url',
      status: 'processing',
      progress: 8,
      createdAt: new Date().toISOString(),
      estimatedTime: '2-3 minutes'
    }

    setVideoJobs(prev => [newJob, ...prev])
    setCurrentJob(newJob)
    setShowJobModal(true)

    simulateVideoCreation(newJob).finally(() => setIsCreatingVideo(false))
  }

  // Video Creation Modal Component
  const VideoJobModal = ({ job, isOpen, onClose }: { 
    job: VideoCreationJob | null, 
    isOpen: boolean, 
    onClose: () => void 
  }) => {
    if (!isOpen || !job) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Creating Video</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  {job.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : job.status === 'failed' ? (
                    <AlertCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{job.title}</h4>
                  <p className="text-sm text-gray-400">
                    {job.sourceType === 'url' ? 'From URL' : 'From File'}: {job.source}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      job.status === 'completed' ? 'bg-green-500' : 
                      job.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>

              {job.estimatedTime && job.status === 'processing' && (
                <p className="text-sm text-gray-400">
                  Estimated time: {job.estimatedTime}
                </p>
              )}

              {job.status === 'completed' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Video created successfully!</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setActiveNav('projects')}
                    >
                      View in Projects
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {job.status === 'failed' && (
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed to create video. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderNavigationContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8">
                <h1 className="text-4xl font-bold mb-4">Create marketing videos from links or materials</h1>
                <div className="flex items-center justify-center space-x-4 max-w-lg mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Paste your link here..."
                      className="bg-white text-gray-900 border-0 h-12 pl-4 pr-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isCreatingVideo && handleCreateVideo()}
                      disabled={isCreatingVideo}
                    />
                    <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 h-12 px-8"
                    onClick={handleCreateVideo}
                    disabled={isCreatingVideo}
                  >
                    {isCreatingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Video'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-6 border-white text-white hover:bg-white hover:text-gray-900"
                    onClick={handleUploadFile}
                    disabled={isCreatingVideo}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <a href="/materials">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-12 px-6 border-white text-white hover:bg-white hover:text-gray-900"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Materials Studio
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Active Jobs */}
            {videoJobs.filter(job => job.status === 'processing').length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Active Jobs</h2>
                <div className="space-y-4">
                  {videoJobs.filter(job => job.status === 'processing').map((job) => (
                    <Card key={job.id} className="bg-gray-800 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            <div>
                              <h3 className="font-medium text-white">{job.title}</h3>
                              <p className="text-sm text-gray-400">{job.source}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setCurrentJob(job)
                              setShowJobModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{job.progress}% complete</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* AI Creation Tools */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">AI Creation Tools</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {avatarTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group"
                    onClick={() => !isCreatingVideo && handleTemplateClick(template)}
                  >
                    <div className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-white mb-1">{template.title}</h3>
                      <p className="text-xs text-gray-400">{template.category}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Product Avatar Templates */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Product Avatar Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {productTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group overflow-hidden"
                    onClick={() => !isCreatingVideo && handleTemplateClick(template)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 relative">
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded px-2 py-1">
                        <span className="text-xs text-white">{template.views} views</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1">{template.title}</h3>
                      <p className="text-sm text-gray-400">{template.category}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Projects */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedVideos.length > 0 ? (
                  completedVideos.slice(0, 2).map((video) => (
                    <Card key={video.id} className="bg-gray-800 border-gray-700">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500 rounded-lg w-24 h-16 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 ml-4">
                            <h3 className="font-medium text-white mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-400">{video.duration}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleDownloadVideo(video)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white"
                              onClick={() => handlePlayVideo(video)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${video.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{video.progress}% complete</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No completed videos yet</p>
                    <p className="text-gray-500 text-sm">Start creating videos to see them here</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )

      case 'projects':
        return (
          <section>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                <p className="text-gray-400">Manage all your video projects</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{completedVideos.length}</p>
                  </div>
                  <Video className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-white">{completedVideos.filter(v => v.status === 'completed').length}</p>
                  </div>
                  <Star className="w-8 h-8 text-green-500" />
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">In Progress</p>
                    <p className="text-2xl font-bold text-white">{completedVideos.filter(v => v.status === 'processing').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">{completedVideos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </Card>
            </div>

            {/* Project List */}
            <div className="space-y-4">
              {completedVideos.map((video) => (
                <Card key={video.id} className="bg-gray-800 border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg w-20 h-12 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handlePlayVideo(video)}
                        >
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white mb-1">{video.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{video.duration}</span>
                            <span>{video.status}</span>
                            <span>{video.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => handlePlayVideo(video)}
                          title="Play Video"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleDownloadVideo(video)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{video.progress}% complete</p>
                    </div>
                  </div>
                </Card>
              ))}
              {completedVideos.length === 0 && (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No completed videos yet</p>
                  <p className="text-gray-500 text-sm">Create your first video to get started</p>
                </div>
              )}
            </div>
          </section>
        )

      case 'assets':
        return (
          <section>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Asset Library</h1>
                <p className="text-gray-400">Manage your media files and resources</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleUploadFile}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Asset
              </Button>
            </div>

            {/* Asset Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {['Images', 'Videos', 'Audio', 'Documents'].map((category) => (
                <Card key={category} className="bg-gray-800 border-gray-700 p-4 cursor-pointer hover:bg-gray-750 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category}</h3>
                      <p className="text-sm text-gray-400">
                        {assetLibrary.filter(asset => 
                          (category === 'Images' && asset.type === 'image') ||
                          (category === 'Videos' && asset.type === 'video') ||
                          (category === 'Audio' && asset.type === 'audio') ||
                          (category === 'Documents' && ['text', 'color'].includes(asset.type))
                        ).length} files
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Asset List */}
            <div className="space-y-4">
              {assetLibrary.map((asset) => (
                <Card key={asset.id} className="bg-gray-800 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          {asset.type === 'image' && <ImageIcon className="w-6 h-6 text-white" />}
                          {asset.type === 'video' && <Video className="w-6 h-6 text-white" />}
                          {asset.type === 'audio' && <Play className="w-6 h-6 text-white" />}
                          {['text', 'color'].includes(asset.type) && <Folder className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{asset.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{asset.size}</span>
                            <span>Added {asset.dateAdded}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )

      case 'brand-kit':
        return (
          <section>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Brand Kit</h1>
                <p className="text-gray-400">Manage your brand identity and guidelines</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Brand Element
              </Button>
            </div>

            {/* Brand Overview */}
            <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AI</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">AI Video Platform</h2>
                  <p className="text-gray-400 mb-3">Your complete brand identity system</p>
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-purple-600 rounded"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded"></div>
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Brand Elements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {brandElements.map((element) => (
                <Card key={element.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <div className="p-6">
                    <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                      <Palette className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-2">{element.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{element.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{element.type}</span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI VIDEO</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <Button 
                  variant={activeNav === 'dashboard' ? 'default' : 'ghost'} 
                  className={activeNav === 'dashboard' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-300 hover:text-white'}
                  onClick={() => setActiveNav('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeNav === 'projects' ? 'default' : 'ghost'} 
                  className={activeNav === 'projects' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-300 hover:text-white'}
                  onClick={() => setActiveNav('projects')}
                >
                  Projects
                </Button>
                <Button 
                  variant={activeNav === 'assets' ? 'default' : 'ghost'} 
                  className={activeNav === 'assets' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-300 hover:text-white'}
                  onClick={() => setActiveNav('assets')}
                >
                  Assets
                </Button>
                <Button 
                  variant={activeNav === 'brand-kit' ? 'default' : 'ghost'} 
                  className={activeNav === 'brand-kit' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-300 hover:text-white'}
                  onClick={() => setActiveNav('brand-kit')}
                >
                  Brand Kit
                </Button>
                <a 
                  href="/materials"
                  className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Materials
                </a>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderNavigationContent()}
      </main>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 rounded-full p-4 shadow-lg">
          <Wand2 className="w-6 h-6" />
        </Button>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full p-4 shadow-lg">
          <Zap className="w-6 h-6" />
        </Button>
      </div>

      {/* Video Job Modal */}
      <VideoJobModal 
        job={currentJob}
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
      />

      {/* Video Player Modal */}
      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gray-900 rounded-lg w-full max-w-6xl h-auto">
            <Button
              onClick={() => setShowVideoPlayer(false)}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700"
              size="sm"
            >
              ✕
            </Button>
            <VideoPlayer
              videoUrl={selectedVideo.videoUrl}
              title={selectedVideo.title}
              duration={selectedVideo.duration}
              onClose={() => setShowVideoPlayer(false)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
