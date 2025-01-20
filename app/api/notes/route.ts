import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const NOTES_DIR = 'notes'

// Ensure notes directory exists
async function ensureNotesDir() {
  const notesPath = path.join(process.cwd(), NOTES_DIR)
  try {
    await fs.access(notesPath)
  } catch {
    await fs.mkdir(notesPath)
  }
}

// Get all notes
export async function GET() {
  try {
    await ensureNotesDir()
    const notesPath = path.join(process.cwd(), NOTES_DIR)
    const files = await fs.readdir(notesPath)
    
    const notes = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(path.join(notesPath, file), 'utf-8')
          return JSON.parse(content)
        })
    )
    
    // Sort by updatedAt timestamp, most recent first
    notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error reading notes:', error)
    return NextResponse.json({ error: 'Failed to read notes' }, { status: 500 })
  }
}

// Create new note
export async function POST(request: Request) {
  try {
    await ensureNotesDir()
    const note = await request.json()
    const notePath = path.join(process.cwd(), NOTES_DIR, `${note.id}.json`)
    
    await fs.writeFile(notePath, JSON.stringify(note, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
} 