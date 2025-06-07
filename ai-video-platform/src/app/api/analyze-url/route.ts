import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface MediaItem {
  type: 'image' | 'video'
  url: string
  duration?: string
  thumbnail?: string
  alt?: string
  title?: string
}

interface ScriptSection {
  id: string
  title: string
  content: string
  timing: string
  mediaType: 'hook' | 'features' | 'benefits' | 'social_proof' | 'cta'
}

interface AnalysisResult {
  title: string
  description: string
  images: string[]
  videos: MediaItem[]
  contentType: 'product' | 'service' | 'article' | 'general'
  scripts: ScriptSection[]
  extractedText: string
  mediaItems: MediaItem[]
  productInfo?: {
    price?: string
    rating?: string
    reviews?: string
    features?: string[]
    benefits?: string[]
  }
  requiresManualInput?: boolean
  fallbackReason?: string
}

// Enhanced script generation based on content analysis
function generateIntelligentScripts(data: {
  title: string
  description: string
  contentType: string
  extractedText: string
  productInfo?: any
  mediaCount: number
}): ScriptSection[] {
  const scripts: ScriptSection[] = []
  
  // Hook/Opening (0-5 seconds)
  const hookScript = generateHookScript(data)
  scripts.push({
    id: 'hook',
    title: 'Attention-Grabbing Opening',
    content: hookScript,
    timing: '0-5s',
    mediaType: 'hook'
  })
  
  // Problem/Solution (5-15 seconds)
  const problemScript = generateProblemScript(data)
  scripts.push({
    id: 'problem',
    title: 'Problem & Solution Setup',
    content: problemScript,
    timing: '5-15s',
    mediaType: 'features'
  })
  
  // Features & Benefits (15-35 seconds)
  const featuresScript = generateFeaturesScript(data)
  scripts.push({
    id: 'features',
    title: 'Key Features & Benefits',
    content: featuresScript,
    timing: '15-35s',
    mediaType: 'benefits'
  })
  
  // Social Proof (35-45 seconds)
  const socialProofScript = generateSocialProofScript(data)
  scripts.push({
    id: 'social_proof',
    title: 'Social Proof & Credibility',
    content: socialProofScript,
    timing: '35-45s',
    mediaType: 'social_proof'
  })
  
  // Call to Action (45-60 seconds)
  const ctaScript = generateCTAScript(data)
  scripts.push({
    id: 'cta',
    title: 'Strong Call to Action',
    content: ctaScript,
    timing: '45-60s',
    mediaType: 'cta'
  })
  
  return scripts
}

function generateHookScript(data: any): string {
  const hooks = [
    `Stop scrolling! You need to see this ${data.contentType === 'product' ? 'game-changing product' : 'amazing discovery'}!`,
    `This ${data.contentType === 'product' ? 'product' : 'solution'} is going viral for all the right reasons...`,
    `Everyone's talking about this, and here's why you should care:`,
    `I couldn't believe this was real until I tried it myself!`,
    `This is the ${data.contentType === 'product' ? 'product' : 'solution'} everyone wishes they knew about sooner!`
  ]
  return hooks[Math.floor(Math.random() * hooks.length)]
}

function generateProblemScript(data: any): string {
  if (data.contentType === 'product') {
    return `Tired of dealing with the same old problems? This innovative solution changes everything. No more frustration, no more wasted time.`
  }
  return `We've all been there - struggling with this exact challenge. But what if I told you there's a better way?`
}

function generateFeaturesScript(data: any): string {
  const features = data.productInfo?.features || []
  if (features.length > 0) {
    return `Here's what makes this special: ${features.slice(0, 3).join(', ')}. Each feature is designed to make your life easier.`
  }
  
  return `The key features that set this apart: innovative design, proven results, and incredible value. This isn't just another option - it's THE solution.`
}

function generateSocialProofScript(data: any): string {
  const rating = data.productInfo?.rating
  const reviews = data.productInfo?.reviews
  
  if (rating && reviews) {
    return `With ${rating} stars and ${reviews} happy customers, the results speak for themselves. Join thousands who've already transformed their experience.`
  }
  
  return `Thousands of satisfied customers can't be wrong. The reviews are incredible, and the results are even better.`
}

function generateCTAScript(data: any): string {
  const ctas = [
    `Don't wait - this won't be available forever. Click the link now and see the difference for yourself!`,
    `Ready to transform your experience? The link is right here - your future self will thank you!`,
    `Take action now! Click below and join the revolution. Limited time offer!`,
    `This is your moment. Click now and discover what you've been missing!`
  ]
  return ctas[Math.floor(Math.random() * ctas.length)]
}

// Enhanced media extraction
async function extractMediaFromPage(html: string, baseUrl: string): Promise<MediaItem[]> {
  const $ = cheerio.load(html)
  const mediaItems: MediaItem[] = []
  
  // Extract images with better filtering
  const images = $('img').toArray()
  for (const img of images) {
    const src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy-src')
    const alt = $(img).attr('alt') || ''
    
    if (src && !src.includes('icon') && !src.includes('logo') && !alt.toLowerCase().includes('logo')) {
      try {
        const absoluteUrl = new URL(src, baseUrl).href
        // Filter out small images (likely icons/buttons)
        const width = $(img).attr('width')
        const height = $(img).attr('height')
        
        if (!width || !height || (parseInt(width) > 100 && parseInt(height) > 100)) {
          mediaItems.push({
            type: 'image',
            url: absoluteUrl,
            alt: alt,
            title: alt || 'Product Image'
          })
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }
  }
  
  // Extract videos
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').toArray()
  for (const video of videos) {
    const src = $(video).attr('src') || $(video).attr('data-src')
    if (src) {
      try {
        const absoluteUrl = new URL(src, baseUrl).href
        mediaItems.push({
          type: 'video',
          url: absoluteUrl,
          duration: '0:30', // Default duration
          thumbnail: mediaItems.find(m => m.type === 'image')?.url || '/placeholder-video.jpg'
        })
      } catch (e) {
        // Skip invalid URLs
      }
    }
  }
  
  return mediaItems
}

// Enhanced product info extraction
function extractProductInfo(html: string): any {
  const $ = cheerio.load(html)
  
  const productInfo: any = {}
  
  // Extract price
  const priceSelectors = [
    '.price', '[class*="price"]', '[data-price]', '.cost', '.amount',
    '.sale-price', '.current-price', '[class*="Cost"]'
  ]
  for (const selector of priceSelectors) {
    const price = $(selector).first().text().trim()
    if (price && /[\$£€¥₩]|\d+/.test(price)) {
      productInfo.price = price
      break
    }
  }
  
  // Extract rating
  const ratingSelectors = [
    '.rating', '[class*="rating"]', '.stars', '[class*="star"]', '.review-score'
  ]
  for (const selector of ratingSelectors) {
    const rating = $(selector).first().text().trim()
    if (rating && /\d+\.?\d*/.test(rating)) {
      productInfo.rating = rating
      break
    }
  }
  
  // Extract review count
  const reviewSelectors = [
    '.review-count', '[class*="review"]', '.reviews', '[class*="Review"]'
  ]
  for (const selector of reviewSelectors) {
    const reviews = $(selector).first().text().trim()
    if (reviews && /\d+/.test(reviews)) {
      productInfo.reviews = reviews.match(/\d+/)?.[0] + ' reviews'
      break
    }
  }
  
  // Extract features from lists
  const features: string[] = []
  $('ul li, .feature, [class*="feature"]').each((i, el) => {
    if (i < 10) { // Limit to 10 features
      const feature = $(el).text().trim()
      if (feature.length > 10 && feature.length < 200) {
        features.push(feature)
      }
    }
  })
  productInfo.features = features
  
  return productInfo
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Analyzing URL:', url)
    
    // Enhanced headers to bypass anti-bot protection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    }
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        redirect: 'follow'
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
      // Enhanced content extraction
      const title = $('title').text().trim() || 
                   $('h1').first().text().trim() || 
                   $('[property="og:title"]').attr('content') || 
                   'Untitled'
      
      const description = $('meta[name="description"]').attr('content') || 
                         $('[property="og:description"]').attr('content') ||
                         $('p').first().text().trim().substring(0, 200) || 
                         'No description available'
      
      // Extract all text for analysis
      const extractedText = $('body').text().replace(/\s+/g, ' ').trim()
      
      // Determine content type with better logic
      const contentType = determineContentType(title, description, extractedText, validUrl.hostname)
      
      // Extract media items
      const mediaItems = await extractMediaFromPage(html, url)
      
      // Extract product information
      const productInfo = extractProductInfo(html)
      
      // Generate intelligent scripts
      const scripts = generateIntelligentScripts({
        title,
        description,
        contentType,
        extractedText,
        productInfo,
        mediaCount: mediaItems.length
      })
      
      // Legacy format for images (for backward compatibility)
      const images = mediaItems.filter(item => item.type === 'image').map(item => item.url)
      const videos = mediaItems.filter(item => item.type === 'video')
      
      console.log('✅ Successfully analyzed:', title)
      console.log('📊 Found media items:', mediaItems.length)
      console.log('📝 Generated scripts:', scripts.length)
      
      const result: AnalysisResult = {
        title,
        description,
        images,
        videos,
        contentType: contentType as any,
        scripts,
        extractedText: extractedText.substring(0, 1000), // Truncate for response
        mediaItems,
        productInfo
      }
      
      return NextResponse.json(result)
      
    } catch (error: any) {
      console.error('❌ Analysis failed:', error.message)
      
      // Enhanced fallback system
      const fallbackResult = generateSmartFallback(validUrl, error.message)
      return NextResponse.json(fallbackResult)
    }
    
  } catch (error) {
    console.error('❌ Request processing failed:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function determineContentType(title: string, description: string, text: string, hostname: string): string {
  const content = (title + ' ' + description + ' ' + text).toLowerCase()
  
  if (hostname.includes('shop') || hostname.includes('store') || 
      content.includes('buy') || content.includes('price') || content.includes('cart')) {
    return 'product'
  }
  
  if (content.includes('service') || content.includes('booking') || content.includes('appointment')) {
    return 'service'
  }
  
  if (content.includes('blog') || content.includes('article') || content.includes('news')) {
    return 'article'
  }
  
  return 'general'
}

function generateSmartFallback(url: URL, errorReason: string): AnalysisResult {
  const hostname = url.hostname
  const pathname = url.pathname
  
  // Generate smart defaults based on domain and path
  let title = 'Professional Video Content'
  let description = 'AI-generated video content'
  let contentType: 'product' | 'service' | 'article' | 'general' = 'general'
  
  if (hostname.includes('amazon') || hostname.includes('shop') || hostname.includes('store')) {
    title = 'Amazing Product Showcase'
    description = 'Discover this incredible product that everyone is talking about'
    contentType = 'product'
  } else if (hostname.includes('youtube') || hostname.includes('video')) {
    title = 'Viral Video Content'
    description = 'Trending content that you need to see'
    contentType = 'article'
  }
  
  // Generate fallback scripts
  const scripts = generateIntelligentScripts({
    title,
    description,
    contentType,
    extractedText: `Smart content analysis for ${hostname}`,
    mediaCount: 5
  })
  
  // Mock media items for demonstration
  const mockMediaItems: MediaItem[] = [
    {
      type: 'image',
      url: '/api/placeholder/640/360',
      alt: 'Product showcase image',
      title: 'Main Product Image'
    },
    {
      type: 'image', 
      url: '/api/placeholder/640/360',
      alt: 'Feature highlight',
      title: 'Key Features'
    },
    {
      type: 'video',
      url: '/api/placeholder/video/demo.mp4',
      duration: '0:30',
      thumbnail: '/api/placeholder/640/360'
    }
  ]
  
  return {
    title,
    description,
    images: mockMediaItems.filter(m => m.type === 'image').map(m => m.url),
    videos: mockMediaItems.filter(m => m.type === 'video') as MediaItem[],
    contentType,
    scripts,
    extractedText: `Analyzed content from ${hostname}`,
    mediaItems: mockMediaItems,
    productInfo: {
      features: ['Premium Quality', 'Fast Delivery', 'Money-Back Guarantee'],
      benefits: ['Save Time', 'Increase Efficiency', 'Professional Results']
    },
    requiresManualInput: true,
    fallbackReason: `Could not automatically analyze ${hostname}: ${errorReason}`
  }
} 