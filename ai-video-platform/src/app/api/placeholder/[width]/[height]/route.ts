import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const width = params.width
  const height = params.height
  
  // Use Unsplash for high-quality placeholder images
  const imageUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=${width}&h=${height}&fit=crop&auto=format`
  
  // Redirect to the actual image
  return NextResponse.redirect(imageUrl)
} 