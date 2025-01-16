import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Get the absolute path to the files directory
    const filesDirectory = path.join(process.cwd(), 'files')
    
    // Read all files in the directory
    const files = await fs.readdir(filesDirectory)
    
    // Filter for JSON files and add the 'files/' prefix
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => `files/${file}`)
    
    return NextResponse.json(jsonFiles)
  } catch (error) {
    console.error('Error reading files directory:', error)
    return NextResponse.json({ error: 'Failed to read files' }, { status: 500 })
  }
} 