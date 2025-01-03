import prisma from '@/src/app/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple query to keep the connection alive
    const result = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database pinged successfully',
      timestamp: new Date().toISOString(),
      userCount: result 
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
} 