'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { VideoProject, ProcessingJob } from '@/types'
import { formatDuration } from '@/lib/utils'
import { 
  Play, 
  Pause, 
  Download, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Settings,
  Eye
} from 'lucide-react'

interface ProjectDashboardProps {
  projects: VideoProject[]
  onEditProject: (project: VideoProject) => void
  onDeleteProject: (projectId: string) => void
  onDownloadVideo: (projectId: string) => void
}

export function ProjectDashboard({ 
  projects, 
  onEditProject, 
  onDeleteProject, 
  onDownloadVideo 
}: ProjectDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null)

  const getStatusIcon = (status: VideoProject['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: VideoProject['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
    }
  }

  const getFeatureType = (project: VideoProject) => {
    const settings = project.settings
    if (settings.avatar) return 'AI Avatar'
    if (settings.template) return 'Template'
    if (settings.contentSource) return 'Content'
    if (settings.cinematic) return 'Cinematic'
    if (settings.subtitles) return 'Subtitles'
    if (settings.ecommerce) return 'E-commerce'
    return 'Standard'
  }

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    processing: projects.filter(p => p.status === 'processing').length,
    draft: projects.filter(p => p.status === 'draft').length
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <Edit className="w-6 h-6 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(project.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{getFeatureType(project)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{formatDuration(project.duration)}</span>
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              {project.thumbnailUrl && (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={project.thumbnailUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {project.status === 'completed' && project.videoUrl && (
                  <>
                    <Button size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDownloadVideo(project.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {project.status === 'draft' && (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onEditProject(project)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
                {project.status === 'processing' && (
                  <Button size="sm" variant="outline" className="flex-1" disabled>
                    <Clock className="w-4 h-4 mr-1 animate-spin" />
                    Processing...
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDeleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No projects yet</h3>
                <p className="text-muted-foreground">Create your first AI video project to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedProject.title}</CardTitle>
                  <CardDescription>{selectedProject.description}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Settings</h4>
                  <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(selectedProject.settings, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onEditProject(selectedProject)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Settings
                  </Button>
                  {selectedProject.status === 'completed' && (
                    <Button variant="outline" onClick={() => onDownloadVideo(selectedProject.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 