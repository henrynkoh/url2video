import ffmpeg from 'ffmpeg-static'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { config } from '../config'

export interface VideoScene {
  scene: number
  description: string
  narration: string
  duration: number
  imageUrl?: string
  backgroundColor?: string
}

export interface VideoGenerationOptions {
  scenes: VideoScene[]
  audioPath: string
  outputPath: string
  resolution?: string
  frameRate?: number
  format?: string
}

export class VideoProcessor {
  private tempDir: string
  
  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }
  
  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    try {
      console.log(`🎬 Starting video composition with ${options.scenes.length} scenes`)
      
      const {
        scenes,
        audioPath,
        outputPath,
        resolution = config.video.defaultResolution,
        frameRate = config.video.defaultFrameRate,
        format = 'mp4'
      } = options
      
      // Create scene images/videos
      const sceneAssets = await this.createSceneAssets(scenes, resolution)
      
      // Generate video timeline
      const videoPath = await this.composeVideo(sceneAssets, audioPath, resolution, frameRate)
      
      // Copy to final output path
      if (fs.existsSync(videoPath)) {
        fs.copyFileSync(videoPath, outputPath)
        console.log(`✅ Video generation complete: ${outputPath}`)
        
        // Cleanup temp files
        this.cleanupTempFiles([videoPath, ...sceneAssets])
        
        return outputPath
      } else {
        throw new Error('Video composition failed')
      }
      
    } catch (error) {
      console.error('❌ Video generation error:', error)
      throw error
    }
  }
  
  private async createSceneAssets(scenes: VideoScene[], resolution: string): Promise<string[]> {
    const assets: string[] = []
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      console.log(`🎨 Creating assets for scene ${i + 1}: ${scene.description}`)
      
      let assetPath: string
      
      if (scene.imageUrl) {
        // Download and process existing image
        assetPath = await this.processImage(scene.imageUrl, scene.duration, resolution)
      } else {
        // Generate colored background with text
        assetPath = await this.generateBackgroundVideo(scene, resolution)
      }
      
      assets.push(assetPath)
    }
    
    return assets
  }
  
  private async processImage(imageUrl: string, duration: number, resolution: string): Promise<string> {
    try {
      const tempImagePath = path.join(this.tempDir, `image_${Date.now()}.jpg`)
      const tempVideoPath = path.join(this.tempDir, `scene_${Date.now()}.mp4`)
      
      // Download image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`)
      }
      
      const buffer = await response.arrayBuffer()
      fs.writeFileSync(tempImagePath, Buffer.from(buffer))
      
      // Convert image to video with specified duration
      await this.runFFmpeg([
        '-loop', '1',
        '-i', tempImagePath,
        '-c:v', 'libx264',
        '-t', duration.toString(),
        '-pix_fmt', 'yuv420p',
        '-vf', `scale=${resolution.replace('x', ':')}:force_original_aspect_ratio=decrease,pad=${resolution.replace('x', ':')}:(ow-iw)/2:(oh-ih)/2`,
        '-r', config.video.defaultFrameRate.toString(),
        tempVideoPath
      ])
      
      // Cleanup temp image
      if (fs.existsSync(tempImagePath)) {
        fs.unlinkSync(tempImagePath)
      }
      
      return tempVideoPath
    } catch (error) {
      console.error('❌ Image processing error:', error)
      throw error
    }
  }
  
  private async generateBackgroundVideo(scene: VideoScene, resolution: string): Promise<string> {
    const tempVideoPath = path.join(this.tempDir, `scene_${Date.now()}.mp4`)
    const [width, height] = resolution.split('x').map(Number)
    
    const backgroundColor = scene.backgroundColor || '#1a1a2e'
    const textColor = '#ffffff'
    
    // Create background video with text overlay
    await this.runFFmpeg([
      '-f', 'lavfi',
      '-i', `color=${backgroundColor}:size=${width}x${height}:duration=${scene.duration}:rate=${config.video.defaultFrameRate}`,
      '-vf', `drawtext=text='${scene.description.replace(/'/g, "\\'")}':fontcolor=${textColor}:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:fontfile=/System/Library/Fonts/Arial.ttf`,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      tempVideoPath
    ])
    
    return tempVideoPath
  }
  
  private async composeVideo(sceneAssets: string[], audioPath: string, resolution: string, frameRate: number): Promise<string> {
    const outputPath = path.join(this.tempDir, `final_${Date.now()}.mp4`)
    
    if (sceneAssets.length === 1) {
      // Single scene - just add audio
      await this.runFFmpeg([
        '-i', sceneAssets[0],
        '-i', audioPath,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
        outputPath
      ])
    } else {
      // Multiple scenes - concatenate then add audio
      const concatListPath = await this.createConcatList(sceneAssets)
      
      await this.runFFmpeg([
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-i', audioPath,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
        '-r', frameRate.toString(),
        outputPath
      ])
      
      // Cleanup concat list
      if (fs.existsSync(concatListPath)) {
        fs.unlinkSync(concatListPath)
      }
    }
    
    return outputPath
  }
  
  private async createConcatList(sceneAssets: string[]): Promise<string> {
    const listPath = path.join(this.tempDir, `concat_${Date.now()}.txt`)
    const content = sceneAssets.map(asset => `file '${asset}'`).join('\n')
    fs.writeFileSync(listPath, content)
    return listPath
  }
  
  private async runFFmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!ffmpeg) {
        reject(new Error('FFmpeg not available'))
        return
      }
      
      console.log(`🔧 Running FFmpeg: ${args.join(' ')}`)
      
      const process = spawn(ffmpeg, args)
      
      let stderr = ''
      
      process.stderr?.on('data', (data) => {
        stderr += data.toString()
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          console.error('FFmpeg stderr:', stderr)
          reject(new Error(`FFmpeg process exited with code ${code}`))
        }
      })
      
      process.on('error', (error) => {
        reject(error)
      })
    })
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
  
  async generateThumbnail(videoPath: string, timestamp: number = 1): Promise<string> {
    const thumbnailPath = videoPath.replace(/\.[^/.]+$/, '_thumb.jpg')
    
    await this.runFFmpeg([
      '-i', videoPath,
      '-ss', timestamp.toString(),
      '-vframes', '1',
      '-q:v', '2',
      thumbnailPath
    ])
    
    return thumbnailPath
  }
} 