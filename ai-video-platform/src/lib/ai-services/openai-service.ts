import OpenAI from 'openai'
import { config } from '../config'
import fs from 'fs'
import path from 'path'

export class OpenAIService {
  private client: OpenAI
  
  constructor() {
    if (!config.openai.apiKey || config.openai.apiKey.includes('your-')) {
      throw new Error('OpenAI API key is required')
    }
    
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    })
  }
  
  async generateSpeech(text: string, voice: string = 'alloy'): Promise<Buffer> {
    try {
      console.log(`🎤 Generating speech with OpenAI TTS - Voice: ${voice}`)
      
      const mp3 = await this.client.audio.speech.create({
        model: config.openai.ttsModel,
        voice: voice as any,
        input: text,
        speed: 1.0,
      })
      
      const buffer = Buffer.from(await mp3.arrayBuffer())
      console.log(`✅ Speech generated: ${buffer.length} bytes`)
      
      return buffer
    } catch (error) {
      console.error('❌ OpenAI TTS Error:', error)
      throw new Error(`Failed to generate speech: ${error}`)
    }
  }
  
  async analyzeImage(imageUrl: string): Promise<string> {
    try {
      console.log(`🔍 Analyzing image with OpenAI Vision: ${imageUrl}`)
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image in detail for video generation. Focus on visual elements, colors, composition, and mood that would be relevant for creating marketing video content."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      })
      
      const description = response.choices[0]?.message?.content || 'No description available'
      console.log(`✅ Image analysis complete: ${description.substring(0, 100)}...`)
      
      return description
    } catch (error) {
      console.error('❌ OpenAI Vision Error:', error)
      throw new Error(`Failed to analyze image: ${error}`)
    }
  }
  
  async generateVideoScript(prompt: string, context?: string): Promise<{
    title: string
    script: string
    scenes: Array<{
      scene: number
      description: string
      narration: string
      duration: number
    }>
  }> {
    try {
      console.log(`📝 Generating video script with OpenAI`)
      
      const systemPrompt = `You are a professional video script writer specializing in short-form marketing videos. 
      Create engaging, compelling scripts that are perfect for social media platforms like TikTok, Instagram Reels, and YouTube Shorts.
      
      Format your response as a JSON object with:
      - title: Catchy video title
      - script: Complete narration script
      - scenes: Array of scene objects with scene number, visual description, narration text, and duration in seconds
      
      Keep total duration between 15-60 seconds. Make it engaging and action-oriented.`
      
      const userPrompt = context 
        ? `Create a marketing video script based on: ${prompt}\n\nAdditional context: ${context}`
        : `Create a marketing video script based on: ${prompt}`
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
      
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No script generated')
      }
      
      try {
        const scriptData = JSON.parse(content)
        console.log(`✅ Video script generated: "${scriptData.title}"`)
        return scriptData
      } catch (parseError) {
        // Fallback if JSON parsing fails
        console.log(`⚠️ JSON parsing failed, using fallback format`)
        return {
          title: "Generated Video",
          script: content,
          scenes: [
            {
              scene: 1,
              description: "Main content presentation",
              narration: content,
              duration: 30
            }
          ]
        }
      }
    } catch (error) {
      console.error('❌ OpenAI Script Generation Error:', error)
      throw new Error(`Failed to generate video script: ${error}`)
    }
  }
  
  async saveTempFile(buffer: Buffer, extension: string): Promise<string> {
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const filename = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`
    const filepath = path.join(tempDir, filename)
    
    fs.writeFileSync(filepath, buffer)
    
    return filepath
  }
} 