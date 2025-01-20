import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const NOTES_DIR = 'notes'

// Update note
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await request.json()
    const notePath = path.join(process.cwd(), NOTES_DIR, `${params.id}.json`)
    
    // Save updated note
    await fs.writeFile(notePath, JSON.stringify(note, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

// Delete note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notePath = path.join(process.cwd(), NOTES_DIR, `${params.id}.json`)
    
    // Delete note file
    await fs.unlink(notePath)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
} 