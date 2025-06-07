import { NextRequest, NextResponse } from 'next/server'
import { VideoGenerator, VideoGenerationRequest as VGRequest } from '@/lib/ai-services/video-generator'
import { config, validateConfig } from '@/lib/config'

interface VideoGenerationRequest {
  title: string
  script: string
  sourceUrl?: string
  sourceType: 'url' | 'file' | 'ai' | 'assets'
  selectedImages?: string[]
  videoStyle?: 'professional' | 'casual' | 'energetic' | 'minimal'
  voiceType?: 'male' | 'female' | 'ai'
  duration?: number
}

interface VideoJob {
  id: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  stage: string
  title: string
  script: string
  sourceType: string
  createdAt: string
  videoUrl?: string
  thumbnailUrl?: string
  error?: string
}

// In-memory storage for jobs (in production, use Redis or database)
const jobs = new Map<string, VideoJob>()

export async function POST(request: NextRequest) {
  try {
    const data: VideoGenerationRequest = await request.json()

    if (!data.title || !data.script) {
      return NextResponse.json({ 
        error: 'Title and script are required' 
      }, { status: 400 })
    }

    // Generate unique job ID
    const jobId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create job entry
    const job: VideoJob = {
      id: jobId,
      status: 'processing',
      progress: 0,
      stage: 'Initializing...',
      title: data.title,
      script: data.script,
      sourceType: data.sourceType,
      createdAt: new Date().toISOString()
    }

    jobs.set(jobId, job)

    console.log(`🎬 Starting video generation: ${jobId}`)
    console.log(`📝 Title: ${data.title}`)
    console.log(`📄 Script length: ${data.script.length} characters`)

    // Start async video processing
    processVideo(jobId, data).catch(error => {
      console.error(`❌ Video processing failed for ${jobId}:`, error)
      const failedJob = jobs.get(jobId)
      if (failedJob) {
        failedJob.status = 'failed'
        failedJob.error = error.message
        jobs.set(jobId, failedJob)
      }
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Video generation started'
    })

  } catch (error) {
    console.error('❌ Error starting video generation:', error)
    return NextResponse.json({ 
      error: 'Failed to start video generation' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const jobId = url.searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
  }

  const job = jobs.get(jobId)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json({ job })
}

async function processVideo(jobId: string, data: VideoGenerationRequest) {
  const updateProgress = (progress: number, stage: string) => {
    const job = jobs.get(jobId)
    if (job) {
      job.progress = progress
      job.stage = stage
      jobs.set(jobId, job)
      console.log(`📊 ${jobId}: ${progress}% - ${stage}`)
    }
  }

  try {
    // Check if real AI generation is enabled
    if (config.enableRealGeneration) {
      console.log('🚀 Starting REAL video generation with AI services')
      
      // Validate configuration
      const configValidation = validateConfig()
      if (!configValidation.isValid) {
        console.warn('⚠️ Configuration issues:', configValidation.errors)
        console.log('🔄 Falling back to demo mode')
      } else {
        // Use real video generation
        const videoGenerator = new VideoGenerator()
        
        const result = await videoGenerator.generateVideo(data as VGRequest, ({ progress, stage, details }) => {
          updateProgress(progress, stage)
          if (details) {
            console.log(`📝 ${details}`)
          }
        })
        
        const job = jobs.get(jobId)
        if (job) {
          job.status = 'completed'
          job.videoUrl = result.videoUrl
          job.thumbnailUrl = result.thumbnailUrl
          jobs.set(jobId, job)
        }
        
        console.log(`✅ REAL video generation completed: ${jobId}`)
        return
      }
    }
    
    // Fallback to simulation mode
    console.log('🎭 Using simulation mode for video generation')
    
    // Stage 1: Analyze script and content (0-20%)
    updateProgress(5, 'Analyzing script content...')
    await delay(1000)
    
    updateProgress(10, 'Processing source content...')
    if (data.sourceUrl) {
      console.log(`🔗 Processing source URL: ${data.sourceUrl}`)
    }
    await delay(1500)

    updateProgress(20, 'Generating scene breakdown...')
    await delay(1000)

    // Stage 2: Generate visuals (20-60%)
    updateProgress(25, 'Creating visual assets...')
    await delay(2000)

    updateProgress(35, 'Generating background scenes...')
    await delay(2500)

    updateProgress(45, 'Processing product imagery...')
    await delay(2000)

    updateProgress(55, 'Creating transitions...')
    await delay(1500)

    updateProgress(60, 'Optimizing visual quality...')
    await delay(1000)

    // Stage 3: Generate audio (60-80%)
    updateProgress(65, 'Generating voiceover...')
    await delay(3000)

    updateProgress(75, 'Processing audio quality...')
    await delay(1500)

    updateProgress(80, 'Synchronizing audio and visuals...')
    await delay(2000)

    // Stage 4: Final composition (80-100%)
    updateProgress(85, 'Compositing final video...')
    await delay(3000)

    updateProgress(92, 'Applying final effects...')
    await delay(1500)

    updateProgress(97, 'Rendering final output...')
    await delay(2000)

    updateProgress(100, 'Video generation complete!')

    // Use sample videos for demo
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    ]

    const sampleThumbnails = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=320&h=180&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=180&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=320&h=180&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=320&h=180&fit=crop',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop'
    ]

    const job = jobs.get(jobId)
    if (job) {
      const randomIndex = Math.floor(Math.random() * sampleVideos.length)
      job.status = 'completed'
      job.videoUrl = sampleVideos[randomIndex]
      job.thumbnailUrl = sampleThumbnails[randomIndex]
      jobs.set(jobId, job)
    }

    console.log(`✅ Demo video generation completed: ${jobId}`)

  } catch (error) {
    console.error(`❌ Error in video processing: ${error}`)
    throw error
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
} 