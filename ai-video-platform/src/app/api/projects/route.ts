import { NextRequest, NextResponse } from 'next/server'
import { VideoProject } from '@/types'

// Mock database - in production, use a real database
let projects: VideoProject[] = []

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  try {
    const project: VideoProject = await request.json()
    
    // Add timestamp
    project.createdAt = new Date()
    project.updatedAt = new Date()
    
    // Add to mock database
    projects.push(project)
    
    // Simulate processing
    simulateProcessing(project.id)
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProject: VideoProject = await request.json()
    
    const index = projects.findIndex(p => p.id === updatedProject.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    updatedProject.updatedAt = new Date()
    projects[index] = updatedProject
    
    return NextResponse.json(updatedProject)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const index = projects.findIndex(p => p.id === projectId)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    projects.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

// Simulate video processing
function simulateProcessing(projectId: string) {
  setTimeout(() => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      project.status = 'processing'
      project.updatedAt = new Date()
    }
  }, 1000)
  
  setTimeout(() => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      project.status = 'completed'
      project.updatedAt = new Date()
      project.videoUrl = `/api/videos/${projectId}.mp4`
      project.thumbnailUrl = `/api/thumbnails/${projectId}.jpg`
      project.duration = Math.floor(Math.random() * 300) + 30 // 30-330 seconds
    }
  }, 5000)
} 