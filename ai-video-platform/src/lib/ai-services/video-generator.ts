import { OpenAIService } from './openai-service'
import { VideoProcessor, VideoScene, VideoGenerationOptions } from './video-processor'
import { config } from '../config'
import fs from 'fs'
import path from 'path'

export interface VideoGenerationRequest {
  title: string
  script: string
  sourceUrl?: string
  sourceType: 'url' | 'file' | 'ai' | 'assets'
  selectedImages?: string[]
  videoStyle?: 'professional' | 'casual' | 'energetic' | 'minimal'
  voiceType?: 'male' | 'female' | 'ai'
  duration?: number
}

export interface VideoGenerationProgress {
  progress: number
  stage: string
  details?: string
}

export class VideoGenerator {
  private openaiService: OpenAIService
  private videoProcessor: VideoProcessor
  private outputDir: string
  
  constructor() {
    this.openaiService = new OpenAIService()
    this.videoProcessor = new VideoProcessor()
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos')
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }
  
  async generateVideo(
    request: VideoGenerationRequest,
    progressCallback: (progress: VideoGenerationProgress) => void
  ): Promise<{
    videoUrl: string
    thumbnailUrl: string
    duration: number
    title: string
  }> {
    try {
      const jobId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      progressCallback({ progress: 5, stage: 'Analyzing script content...' })
      
      // Step 1: Generate enhanced script with scenes
      let scriptData: any
      if (config.enableRealGeneration) {
        console.log('🤖 Using real AI script generation')
        scriptData = await this.openaiService.generateVideoScript(request.script, request.sourceUrl)
        progressCallback({ progress: 15, stage: 'AI script generation complete', details: scriptData.title })
      } else {
        console.log('📝 Using provided script')
        scriptData = {
          title: request.title,
          script: request.script,
          scenes: this.parseScriptToScenes(request.script)
        }
      }
      
      progressCallback({ progress: 25, stage: 'Generating voiceover audio...' })
      
      // Step 2: Generate audio narration
      let audioPath: string
      if (config.enableRealGeneration) {
        console.log('🎤 Generating real TTS audio')
        const voice = this.mapVoiceType(request.voiceType || 'female')
        const audioBuffer = await this.openaiService.generateSpeech(scriptData.script, voice)
        audioPath = await this.openaiService.saveTempFile(audioBuffer, 'mp3')
        progressCallback({ progress: 40, stage: 'Voiceover generation complete' })
      } else {
        // Use a silent audio track for demo
        audioPath = await this.generateSilentAudio(30) // 30 seconds
        progressCallback({ progress: 40, stage: 'Audio track prepared' })
      }
      
      progressCallback({ progress: 50, stage: 'Processing visual content...' })
      
      // Step 3: Enhance scenes with images if available
      const enhancedScenes = await this.enhanceScenes(scriptData.scenes, request.selectedImages)
      
      progressCallback({ progress: 65, stage: 'Creating video scenes...' })
      
      // Step 4: Generate video
      const outputPath = path.join(this.outputDir, `${jobId}.mp4`)
      const videoGenerationOptions: VideoGenerationOptions = {
        scenes: enhancedScenes,
        audioPath,
        outputPath,
        resolution: this.getResolution(request.videoStyle),
        frameRate: config.video.defaultFrameRate,
      }
      
      progressCallback({ progress: 80, stage: 'Compositing final video...' })
      
      const finalVideoPath = await this.videoProcessor.generateVideo(videoGenerationOptions)
      
      progressCallback({ progress: 90, stage: 'Generating thumbnail...' })
      
      // Step 5: Generate thumbnail
      const thumbnailPath = await this.videoProcessor.generateThumbnail(finalVideoPath, 2)
      
      progressCallback({ progress: 95, stage: 'Finalizing output...' })
      
      // Step 6: Get video duration and prepare URLs
      const videoDuration = await this.getVideoDuration(finalVideoPath)
      
      // Copy thumbnail to public directory
      const publicThumbnailPath = path.join(this.outputDir, `${jobId}_thumb.jpg`)
      if (fs.existsSync(thumbnailPath)) {
        fs.copyFileSync(thumbnailPath, publicThumbnailPath)
      }
      
      // Cleanup temp files
      this.cleanupTempFiles([audioPath, thumbnailPath])
      
      progressCallback({ progress: 100, stage: 'Video generation complete!' })
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      return {
        videoUrl: `${baseUrl}/generated-videos/${jobId}.mp4`,
        thumbnailUrl: `${baseUrl}/generated-videos/${jobId}_thumb.jpg`,
        duration: videoDuration,
        title: scriptData.title
      }
      
    } catch (error) {
      console.error('❌ Video generation failed:', error)
      throw error
    }
  }
  
  private parseScriptToScenes(script: string): VideoScene[] {
    // Simple script parsing - split by sentences or periods
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgDuration = 30 / Math.max(sentences.length, 1) // Distribute over 30 seconds
    
    return sentences.map((sentence, index) => ({
      scene: index + 1,
      description: sentence.trim(),
      narration: sentence.trim(),
      duration: Math.max(avgDuration, 2) // Minimum 2 seconds per scene
    }))
  }
  
  private async enhanceScenes(scenes: VideoScene[], selectedImages?: string[]): Promise<VideoScene[]> {
    return scenes.map((scene, index) => {
      const enhancedScene = { ...scene }
      
      // Add selected images if available
      if (selectedImages && selectedImages[index]) {
        enhancedScene.imageUrl = selectedImages[index]
      }
      
      // Add background colors based on scene content
      if (!enhancedScene.imageUrl) {
        enhancedScene.backgroundColor = this.getSceneBackgroundColor(scene.description)
      }
      
      return enhancedScene
    })
  }
  
  private getSceneBackgroundColor(description: string): string {
    const colors = {
      energy: '#ff6b6b',
      professional: '#2c3e50',
      nature: '#27ae60',
      technology: '#3498db',
      luxury: '#9b59b6',
      default: '#34495e'
    }
    
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('energy') || lowerDesc.includes('exciting')) return colors.energy
    if (lowerDesc.includes('professional') || lowerDesc.includes('business')) return colors.professional
    if (lowerDesc.includes('nature') || lowerDesc.includes('green')) return colors.nature
    if (lowerDesc.includes('tech') || lowerDesc.includes('digital')) return colors.technology
    if (lowerDesc.includes('luxury') || lowerDesc.includes('premium')) return colors.luxury
    
    return colors.default
  }
  
  private mapVoiceType(voiceType: string): string {
    const voiceMap: Record<string, string> = {
      'male': 'onyx',
      'female': 'nova',
      'ai': 'alloy'
    }
    
    return voiceMap[voiceType] || 'nova'
  }
  
  private getResolution(videoStyle?: string): string {
    const resolutions: Record<string, string> = {
      'professional': '1080x1920', // 9:16 for mobile
      'casual': '1080x1080',       // 1:1 for Instagram
      'energetic': '1080x1920',    // 9:16 for TikTok
      'minimal': '1920x1080'       // 16:9 for YouTube
    }
    
    return resolutions[videoStyle || 'professional'] || config.video.defaultResolution
  }
  
  private async generateSilentAudio(duration: number): Promise<string> {
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    const audioPath = path.join(tempDir, `silent_${Date.now()}.mp3`)
    
    // Generate silent audio using FFmpeg
    const ffmpeg = await import('ffmpeg-static')
    const { spawn } = await import('child_process')
    
    return new Promise((resolve, reject) => {
      const ffmpegPath = ffmpeg.default
      if (!ffmpegPath) {
        reject(new Error('FFmpeg not available'))
        return
      }
      
      const childProcess = spawn(ffmpegPath, [
        '-f', 'lavfi',
        '-i', `anullsrc=r=44100:cl=stereo`,
        '-t', duration.toString(),
        '-c:a', 'mp3',
        audioPath
      ])
      
      childProcess.on('close', (code: number | null) => {
        if (code === 0) {
          resolve(audioPath)
        } else {
          reject(new Error(`Silent audio generation failed with code ${code}`))
        }
      })
      
      childProcess.on('error', (error: Error) => {
        reject(error)
      })
    })
  }
  
  private async getVideoDuration(videoPath: string): Promise<number> {
    // For now, return a default duration
    // In a real implementation, you would use ffprobe to get actual duration
    return 30
  }
  
  private cleanupTempFiles(files: string[]): void {
    files.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file)
          console.log(`🗑️ Cleaned up temp file: ${path.basename(file)}`)
        } catch (error) {
          console.warn(`⚠️ Failed to cleanup ${file}:`, error)
        }
      }
    })
  }
} 