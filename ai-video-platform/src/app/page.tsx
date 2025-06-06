'use client'

import React, { useState, useEffect } from 'react'
import { VideoCreator } from '@/components/video-creator'
import { ProjectDashboard } from '@/components/project-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoProject, N8nWorkflow, MCPConnection } from '@/types'
import { 
  Plus, 
  LayoutDashboard, 
  Settings, 
  Workflow, 
  Zap,
  Video,
  Users,
  Globe,
  TrendingUp
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'creator' | 'dashboard' | 'workflows' | 'settings'>('creator')
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([])
  const [mcpConnections, setMcpConnections] = useState<MCPConnection[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProjects()
    loadWorkflows()
    loadMCPConnections()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/n8n')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Failed to load workflows:', error)
    }
  }

  const loadMCPConnections = async () => {
    try {
      const response = await fetch('/api/mcp')
      const data = await response.json()
      setMcpConnections(data)
    } catch (error) {
      console.error('Failed to load MCP connections:', error)
    }
  }

  const handleCreateProject = async (project: VideoProject) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
      
      if (response.ok) {
        const newProject = await response.json()
        setProjects(prev => [...prev, newProject])
        setActiveTab('dashboard')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProject = (project: VideoProject) => {
    // Implementation for editing project
    console.log('Edit project:', project)
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleDownloadVideo = (projectId: string) => {
    // Implementation for downloading video
    console.log('Download video:', projectId)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'creator':
        return <VideoCreator onCreateProject={handleCreateProject} />
      case 'dashboard':
        return (
          <ProjectDashboard
            projects={projects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onDownloadVideo={handleDownloadVideo}
          />
        )
      case 'workflows':
        return <WorkflowManager workflows={workflows} onUpdate={loadWorkflows} />
      case 'settings':
        return <SettingsPanel mcpConnections={mcpConnections} onUpdate={loadMCPConnections} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Video className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">AI Video Platform</h1>
              </div>
              <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Hybrid AI Workflow</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{projects.length} Projects</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{mcpConnections.filter(c => c.status === 'connected').length} Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'creator', label: 'Create', icon: Plus },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'workflows', label: 'Workflows', icon: Workflow },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="flex items-center gap-2 px-4 py-2"
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Creating your AI video project...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function WorkflowManager({ workflows, onUpdate }: { workflows: N8nWorkflow[], onUpdate: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">N8N Workflows</h2>
          <p className="text-gray-600">Automate your video creation process</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-6">
        {workflows.map(workflow => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{workflow.name}</CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Triggers</h4>
                  <div className="flex flex-wrap gap-2">
                    {workflow.triggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {trigger.type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {workflow.actions.map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                        {action.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SettingsPanel({ mcpConnections, onUpdate }: { mcpConnections: MCPConnection[], onUpdate: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">MCP Connections</h2>
        <p className="text-gray-600">Manage your AI model connections</p>
      </div>

      <div className="grid gap-6">
        {mcpConnections.map(connection => (
          <Card key={connection.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{connection.name}</CardTitle>
                  <CardDescription>{connection.endpoint}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    connection.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {connection.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {connection.capabilities.map((capability, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Test Connection
                  </Button>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
