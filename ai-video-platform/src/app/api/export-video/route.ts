import { NextRequest, NextResponse } from 'next/server'

interface ExportRequest {
  title: string
  scripts: Array<{
    id: string
    title: string
    content: string
    timing: string
  }>
  avatar: {
    id: string
    name: string
    voiceStyle?: string
  }
  mediaItems: Array<{
    type: 'image' | 'video'
    url: string
    duration?: string
  }>
  settings: {
    lipSyncEnabled: boolean
    voiceSpeed: number
    backgroundMusic: string
  }
}

interface ExportJob {
  id: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  stage: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: string
  createdAt: string
  error?: string
}

// In-memory storage for export jobs (use database in production)
const exportJobs = new Map<string, ExportJob>()

export async function POST(request: NextRequest) {
  try {
    const data: ExportRequest = await request.json()
    
    // Generate unique job ID
    const jobId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create initial job
    const job: ExportJob = {
      id: jobId,
      status: 'processing',
      progress: 0,
      stage: 'Initializing video export...',
      createdAt: new Date().toISOString()
    }
    
    exportJobs.set(jobId, job)
    
    console.log('🎬 Starting video export:', jobId)
    console.log('📊 Export data:', {
      title: data.title,
      avatar: data.avatar.name,
      scripts: data.scripts.length,
      mediaItems: data.mediaItems.length
    })
    
    // Start async processing
    processVideoExport(jobId, data)
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Video export started successfully'
    })
    
  } catch (error) {
    console.error('❌ Export error:', error)
    return NextResponse.json(
      { error: 'Failed to start video export' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const jobId = url.searchParams.get('jobId')
  
  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }
  
  const job = exportJobs.get(jobId)
  
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ job })
}

async function processVideoExport(jobId: string, data: ExportRequest) {
  const job = exportJobs.get(jobId)
  if (!job) return
  
  try {
    // Stage 1: Script Processing (0-20%)
    updateJob(jobId, 10, 'Processing AI scripts and timing...')
    await sleep(2000)
    
    updateJob(jobId, 20, 'Optimizing script for lip-sync...')
    await sleep(1500)
    
    // Stage 2: Avatar Preparation (20-40%)
    updateJob(jobId, 30, `Preparing ${data.avatar.name} avatar...`)
    await sleep(2000)
    
    updateJob(jobId, 40, 'Generating lip-sync animations...')
    await sleep(2500)
    
    // Stage 3: Media Processing (40-60%)
    updateJob(jobId, 50, 'Processing media assets...')
    await sleep(2000)
    
    updateJob(jobId, 60, 'Synchronizing media with timeline...')
    await sleep(1500)
    
    // Stage 4: Voice Generation (60-80%)
    updateJob(jobId, 70, `Generating voice with ${data.settings.voiceSpeed}x speed...`)
    await sleep(3000)
    
    updateJob(jobId, 80, 'Adding background music and effects...')
    await sleep(2000)
    
    // Stage 5: Final Composition (80-100%)
    updateJob(jobId, 90, 'Compositing final video...')
    await sleep(3000)
    
    updateJob(jobId, 95, 'Optimizing video quality...')
    await sleep(1500)
    
    // Complete the job
    const finalJob: ExportJob = {
      ...job,
      status: 'completed',
      progress: 100,
      stage: 'Video export complete!',
      videoUrl: `/api/placeholder/video/${jobId}.mp4`,
      thumbnailUrl: `/api/placeholder/640/360`,
      duration: '0:45'
    }
    
    exportJobs.set(jobId, finalJob)
    console.log('✅ Video export completed:', jobId)
    
  } catch (error) {
    console.error('❌ Video export failed:', error)
    updateJob(jobId, job.progress, 'Export failed', 'failed', error instanceof Error ? error.message : 'Unknown error')
  }
}

function updateJob(jobId: string, progress: number, stage: string, status: 'processing' | 'completed' | 'failed' = 'processing', error?: string) {
  const job = exportJobs.get(jobId)
  if (job) {
    job.progress = progress
    job.stage = stage
    job.status = status
    if (error) job.error = error
    exportJobs.set(jobId, job)
    console.log(`📊 ${jobId}: ${progress}% - ${stage}`)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
} 