'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'
import { filesFormated } from '@/lib/constants'

export default function Sidebar() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('')
  const pathname = usePathname()
  const mode = pathname === '/quiz' ? 'Quiz Mode' : 'Modify Mode'

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await fetch('/api/files')
        if (!response.ok) throw new Error('Failed to load files')
        const data = await response.json()
        setFiles(data.sort((a: string, b: string) => {
          const aName = filesFormated.find(f => f.filename === a)?.name || a
          const bName = filesFormated.find(f => f.filename === b)?.name || b
          return aName.localeCompare(bName)
        }))
      } catch (error) {
        console.error('Error loading files:', error)
      }
    }
    loadFiles()
  }, [])

  const handleFileSelect = (file: string) => {
    setSelectedFile(file)
    const event = new CustomEvent('topicChange', { detail: file })
    window.dispatchEvent(event)
  }

  const handleCompleteTest = async () => {
    try {
      // Load all questions from all files
      const allQuestions = await Promise.all(
        files.map(async (file) => {
          const response = await fetch(`/api/questions?file=${file}`)
          if (!response.ok) throw new Error(`Failed to load questions from ${file}`)
          const questions = await response.json()
          return questions.map((q: any) => ({ ...q, sourceTopic: file }))
        })
      )

      // Flatten and shuffle all questions
      const flatQuestions = allQuestions.flat()
      const event = new CustomEvent('completeTest', { 
        detail: { questions: flatQuestions }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Error loading complete test:', error)
    }
  }

  return (
    <div className="w-64 border-r ">
      <div className="p-4 border-b ">
        <div className="flex justify-start items-center">
          <h1 className="font-semibold">{mode}</h1>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-2">
          {mode === 'Quiz Mode' && (
            <Button
              variant="default"
              className="w-full mb-4"
              onClick={handleCompleteTest}
            >
              Start Complete Test
            </Button>
          )}
          {files.map((file) => (
            <Button
              key={file}
              variant="ghost"
              className={cn(
                'w-full justify-start text-left font-normal ',
                selectedFile === file && 'bg-gray-100 dark:text-black'
              )}
              onClick={() => handleFileSelect(file)}
            >
              {filesFormated.find(f => f.filename === file)?.name || file.replace('files/', '').replace('.json', '')}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 