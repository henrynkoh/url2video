// AI Services Configuration
export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    ttsModel: 'tts-1',
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
  },
  
  runway: {
    apiKey: process.env.RUNWAY_API_KEY || 'your-runway-api-key',
    baseUrl: 'https://api.runwayml.com/v1',
  },
  
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || 'your-elevenlabs-api-key',
    baseUrl: 'https://api.elevenlabs.io/v1',
  },
  
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN || 'your-replicate-token',
  },
  
  stability: {
    apiKey: process.env.STABILITY_API_KEY || 'your-stability-api-key',
    baseUrl: 'https://api.stability.ai',
  },
  
  storage: {
    // You can configure AWS S3, Cloudinary, or other storage providers
    provider: 'local', // 'aws', 'cloudinary', 'local'
    localPath: './public/generated-videos/',
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_BUCKET || 'your-bucket',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
  
  video: {
    defaultResolution: '1080x1920', // 9:16 vertical format
    defaultFrameRate: 30,
    defaultDuration: 30, // seconds
    maxDuration: 180, // 3 minutes max
    supportedFormats: ['mp4', 'mov', 'webm'],
  },
  
  // Real AI services integration flags
  enableRealGeneration: process.env.NODE_ENV === 'production' || process.env.ENABLE_REAL_AI === 'true',
  
  // Development/demo settings
  development: {
    useSimulation: !process.env.ENABLE_REAL_AI,
    simulationDelay: 2000, // ms between progress updates
  },
}

// Validation function
export function validateConfig() {
  const errors: string[] = []
  
  if (config.enableRealGeneration) {
    if (!config.openai.apiKey || config.openai.apiKey.includes('your-')) {
      errors.push('OpenAI API key is required for real video generation')
    }
    
    if (!config.runway.apiKey || config.runway.apiKey.includes('your-')) {
      errors.push('Runway API key is required for real video generation')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export default config 