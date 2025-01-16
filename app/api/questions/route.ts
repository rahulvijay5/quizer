import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { filePath, questions } = await request.json()
    
    // Validate the file path to ensure it's a JSON file
    if (!filePath.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid file path - must be a JSON file' }, { status: 400 })
    }

    // Get the absolute path to the JSON file
    const absolutePath = path.join(process.cwd(), filePath)
    
    // Write the updated questions back to the file
    await fs.writeFile(absolutePath, JSON.stringify(questions, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving questions:', error)
    return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('file')
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    if (!filePath.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid file path - must be a JSON file' }, { status: 400 })
    }

    const absolutePath = path.join(process.cwd(), filePath)
    
    // Check if file exists
    try {
      await fs.access(absolutePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileContents = await fs.readFile(absolutePath, 'utf-8')
    const questions = JSON.parse(fileContents)
    
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error reading questions:', error)
    return NextResponse.json({ error: 'Failed to read questions' }, { status: 500 })
  }
} 