 'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Trash2, FileDown, AlertTriangle } from 'lucide-react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

interface Question {
  Question: string
  [key: string]: string | string[]
  correctAns: string[]
  proposedAns: string[]
  resource: string
}

const COMMANDS = [
  { value: '/q', label: 'Question', description: 'Add a new question' },
  { value: '/o', label: 'Option', description: 'Add an option' },
  { value: '/c', label: 'Correct Answer', description: 'Set correct answers (e.g., /c1,2 for options 1 and 2)' },
  { value: '/p', label: 'Proposed Answer', description: 'Set proposed answers (e.g., /p1,3 for options 1 and 3)' },
  { value: '/r', label: 'Resource', description: 'Add a resource link or reference' },
]

export default function ContributePage() {
  const [input, setInput] = useState('/q ')
  const [showCommands, setShowCommands] = useState(false)
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({})
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [filename, setFilename] = useState('')
  const [includeSolutions, setIncludeSolutions] = useState(false)
  const [includeResources, setIncludeResources] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleInput = (value: string) => {
    setInput(value)
    
    // Auto-suggest next command
    if (value.endsWith('\n')) {
      const lines = value.split('\n')
      const lastLine = lines[lines.length - 2] || ''
      const currentLine = lines[lines.length - 1]

      if (currentLine === '') {
        if (lastLine.startsWith('/q ')) {
          setInput(value + '/o ')
        } else if (lastLine.startsWith('/o ')) {
          const optionCount = lines.filter(line => line.startsWith('/o ')).length
          if (optionCount < 4) {
            setInput(value + '/o ')
          } else {
            setInput(value + '/c ')
          }
        } else if (lastLine.startsWith('/c ')) {
          setInput(value + '/p ')
        } else if (lastLine.startsWith('/p ')) {
          setInput(value + '/r ')
        }
      }
    }

    // Show command menu when typing '/' at the start of a line
    if (value.endsWith('\n/') || (value === '/')) {
      const textarea = textareaRef.current
      if (textarea) {
        const lines = value.split('\n')
        const currentLineIndex = lines.length - 1
        const lineHeight = 24
        const top = textarea.offsetTop + (currentLineIndex * lineHeight)
        const left = textarea.offsetLeft + 10

        setCommandPosition({ top, left })
        setShowCommands(true)
      }
    } else {
      setShowCommands(false)
    }

    // Parse input to create question object
    const lines = value.split('\n')
    const newQuestion: Partial<Question> = {}
    let optionCount = 0

    lines.forEach(line => {
      if (line.startsWith('/q ')) {
        newQuestion.Question = line.slice(3)
      } else if (line.startsWith('/o')) {
        // Handle both /o and /oN formats
        const match = line.match(/^\/o(\d*)\s+(.+)$/)
        if (match) {
          const [_, num, text] = match
          const optionNumber = num ? parseInt(num) : ++optionCount
          newQuestion[`opt${optionNumber}`] = text
          optionCount = Math.max(optionCount, optionNumber)
        }
      } else if (line.startsWith('/c ')) {
        const answerIndices = line.slice(3).split(',').map(i => parseInt(i.trim()))
        newQuestion.correctAns = answerIndices.map(i => newQuestion[`opt${i}`] as string).filter(Boolean)
      } else if (line.startsWith('/p ')) {
        const answerIndices = line.slice(3).split(',').map(i => parseInt(i.trim()))
        newQuestion.proposedAns = answerIndices.map(i => newQuestion[`opt${i}`] as string).filter(Boolean)
      } else if (line.startsWith('/r ')) {
        newQuestion.resource = line.slice(3)
      }
    })

    setCurrentQuestion(newQuestion)
  }

  const insertCommand = (command: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = input.slice(0, cursorPosition)
    const textAfterCursor = input.slice(cursorPosition)

    // Add number to /o command
    let finalCommand = command
    if (command === '/o') {
      const lines = input.split('\n')
      const optionCount = lines.filter(line => line.startsWith('/o')).length
      finalCommand = `/o${optionCount + 1}`
    }

    const newText = textBeforeCursor.slice(0, -1) + command + ' ' + textAfterCursor
    setInput(newText)
    setShowCommands(false)

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPosition = cursorPosition + command.length
        textareaRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  const addQuestion = () => {
    if (!currentQuestion.Question || !currentQuestion.correctAns) {
      toast.error('Question and correct answer are required')
      return
    }

    setQuestions(prev => [...prev, currentQuestion as Question])
    setInput('/q ')
    setCurrentQuestion({})
    toast.success('Question added successfully')
  }

  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
    toast.success('Question deleted')
  }

  const downloadQuestions = () => {
    if (!filename) {
      toast.error('Please enter a filename')
      return
    }

    // Download JSON
    const fileContent = JSON.stringify(questions, null, 2)
    const blob = new Blob([fileContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Generate PDF content
    let pdfContent = questions.map((q, index) => {
      let content = `${index + 1}. ${q.Question}\n\n`
      
      // Add options
      Object.entries(q)
        .filter(([key]) => key.startsWith('opt'))
        .forEach(([key, value]) => {
          content += `   ${key.replace('opt', '')}. ${value}\n`
        })

      // Add answers if includeSolutions is true
      if (includeSolutions) {
        content += `\nCorrect Answer: ${q.correctAns.join(', ')}\n`
        content += `Proposed Answer: ${q.proposedAns.join(', ')}\n`
      }

      // Add resource if includeResources is true
      if (includeResources && q.resource) {
        content += `\nResource: ${q.resource}\n`
      }

      return content + '\n---\n\n'
    }).join('')

    // Download PDF
    // Note: In a real implementation, you'd want to use a PDF library
    // For now, we'll just create a text file as a placeholder
    const pdfBlob = new Blob([pdfContent], { type: 'text/plain' })
    const pdfUrl = URL.createObjectURL(pdfBlob)
    const pdfLink = document.createElement('a')
    pdfLink.href = pdfUrl
    pdfLink.download = `${filename}.txt` // Would be .pdf in real implementation
    document.body.appendChild(pdfLink)
    pdfLink.click()
    document.body.removeChild(pdfLink)
    URL.revokeObjectURL(pdfUrl)

    setShowSaveDialog(false)
    toast.success('Files downloaded successfully')
  }

  const handleBack = () => {
    if (questions.length > 0) {
      setShowLeaveDialog(true)
    } else {
      router.back()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contribute Questions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add new questions using simple commands
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSaveDialog(true)}
            disabled={questions.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Questions
          </Button>
          <Button
            onClick={addQuestion}
            disabled={!currentQuestion.Question || !currentQuestion.correctAns}
          >
            Add Question
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Editor</h2>
            <div className="text-sm text-muted-foreground">
              Type / to see available commands
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full h-[600px] p-4 font-mono text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            placeholder="Start typing your question..."
          />
          {showCommands && (
            <div
              className="absolute z-50 w-80"
              style={{ top: commandPosition.top, left: commandPosition.left }}
            >
              <Command>
                <CommandList>
                  <CommandGroup heading="Available Commands">
                    {COMMANDS.map((command) => (
                      <CommandItem
                        key={command.value}
                        onSelect={() => insertCommand(command.value)}
                      >
                        <div>
                          <div className="font-medium">{command.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {command.description}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <Card className="p-6">
            {currentQuestion.Question ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">{currentQuestion.Question}</div>
                <div className="space-y-2">
                  {Object.entries(currentQuestion)
                    .filter(([key]) => key.startsWith('opt'))
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 rounded-md border"
                      >
                        {key.replace('opt', '')}. {value}
                      </div>
                    ))}
                </div>
                {currentQuestion.correctAns && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Correct Answer: {Array.isArray(currentQuestion.correctAns) 
                      ? currentQuestion.correctAns.join(', ') 
                      : currentQuestion.correctAns}
                  </div>
                )}
                {currentQuestion.proposedAns && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Proposed Answer: {Array.isArray(currentQuestion.proposedAns)
                      ? currentQuestion.proposedAns.join(', ')
                      : currentQuestion.proposedAns}
                  </div>
                )}
                {currentQuestion.resource && (
                  <div className="text-sm text-muted-foreground">
                    Resource: {currentQuestion.resource}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Question preview will appear here
              </div>
            )}
          </Card>

          {questions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Added Questions ({questions.length})</h3>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <Card key={index} className="p-4 group relative">
                    <div className="text-sm font-medium pr-8">{q.Question}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Questions</DialogTitle>
            <DialogDescription>
              Enter a name for your question file and choose export options
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename (without extension)"
            />
            <div className="space-y-2">
              <h4 className="font-medium">Download Options</h4>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const fileContent = JSON.stringify(questions, null, 2)
                    const blob = new Blob([fileContent], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${filename}.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                    toast.success('JSON file downloaded successfully')
                  }}
                  disabled={!filename}
                >
                  Download as JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Generate PDF content
                    let pdfContent = questions.map((q, index) => {
                      let content = `${index + 1}. ${q.Question}\n\n`
                      
                      // Add options
                      Object.entries(q)
                        .filter(([key]) => key.startsWith('opt'))
                        .forEach(([key, value]) => {
                          content += `   ${key.replace('opt', '')}. ${value}\n`
                        })

                      // Add answers if includeSolutions is true
                      if (includeSolutions) {
                        content += `\nCorrect Answer: ${q.correctAns.join(', ')}\n`
                        content += `Proposed Answer: ${q.proposedAns.join(', ')}\n`
                      }

                      // Add resource if includeResources is true
                      if (includeResources && q.resource) {
                        content += `\nResource: ${q.resource}\n`
                      }

                      return content + '\n---\n\n'
                    }).join('')

                    const pdfBlob = new Blob([pdfContent], { type: 'text/plain' })
                    const pdfUrl = URL.createObjectURL(pdfBlob)
                    const pdfLink = document.createElement('a')
                    pdfLink.href = pdfUrl
                    pdfLink.download = `${filename}.txt` // Would be .pdf in real implementation
                    document.body.appendChild(pdfLink)
                    pdfLink.click()
                    document.body.removeChild(pdfLink)
                    URL.revokeObjectURL(pdfUrl)
                    toast.success('PDF file downloaded successfully')
                  }}
                  disabled={!filename}
                >
                  Download as PDF
                </Button>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeSolutions"
                    checked={includeSolutions}
                    onChange={(e) => setIncludeSolutions(e.target.checked)}
                  />
                  <label htmlFor="includeSolutions">Include solutions in PDF</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeResources"
                    checked={includeResources}
                    onChange={(e) => setIncludeResources(e.target.checked)}
                  />
                  <label htmlFor="includeResources">Include resources in PDF</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Unsaved Changes
              </div>
            </DialogTitle>
            <DialogDescription>
              You have {questions.length} unsaved questions. Are you sure you want to leave? All progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.back()}
            >
              Leave Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 