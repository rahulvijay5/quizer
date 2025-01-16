import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const topicName = formData.get('topicName') as string

    if (!file || !topicName) {
      return NextResponse.json(
        { error: 'File and topic name are required' },
        { status: 400 }
      )
    }

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate JSON structure
    try {
      const content = JSON.parse(buffer.toString())
      if (!content.questions || !Array.isArray(content.questions)) {
        return NextResponse.json(
          { error: 'Invalid JSON structure. Must contain a questions array.' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      )
    }

    // Create filename from topic name
    const filename = topicName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.json'
    const filePath = path.join(process.cwd(), 'files', filename)

    // Save file
    await writeFile(filePath, buffer)

    // Update constants file
    const constantsPath = path.join(process.cwd(), 'lib', 'constants.ts')
    const constantsContent = await readFile(constantsPath, 'utf-8')
    
    // Parse the existing filesFormated array
    const filesFormatedMatch = constantsContent.match(/export const filesFormated = (\[[\s\S]*?\])/m)
    if (!filesFormatedMatch) {
      throw new Error('Could not find filesFormated in constants.ts')
    }

    const filesFormated = eval(filesFormatedMatch[1])
    filesFormated.push({
      name: topicName,
      filename: `files/${filename}`,
    })

    // Sort the array alphabetically by name
    filesFormated.sort((a: any, b: any) => a.name.localeCompare(b.name))

    // Create the new content
    const newConstantsContent = constantsContent.replace(
      /export const filesFormated = \[[\s\S]*?\]/m,
      `export const filesFormated = ${JSON.stringify(filesFormated, null, 2)}`
    )

    // Write the updated constants file
    await writeFile(constantsPath, newConstantsContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling file upload:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
} 