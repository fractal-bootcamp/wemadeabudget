// LEGACY — daily cron that pinged Postgres to keep the connection warm
// (Supabase pauses idle dbs). Was wired in vercel.json `crons` at /api/cron.
// Not used by the local-only build.

import prisma from './prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Starting cron job...');
    console.log('Database URL:', process.env.DATABASE_URL); // Will be redacted in logs
    
    const result = await prisma.user.count();
    console.log(`Database pinged successfully at ${new Date().toISOString()} (${result} users)`);
    
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