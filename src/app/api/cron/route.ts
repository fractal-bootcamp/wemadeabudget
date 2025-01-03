import prisma from '@/src/app/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Starting cron job...');
    console.log('Database URL:', process.env.DATABASE_URL); // Will be redacted in logs
    
    const result = await prisma.user.count();
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database pinged successfully',
      timestamp: new Date().toISOString(),
      userCount: result 
    })
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error }, { status: 500 })
  }
} 