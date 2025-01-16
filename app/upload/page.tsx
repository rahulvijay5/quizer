'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Upload, FileJson } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [topicName, setTopicName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile?.type !== 'application/json') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JSON file',
        variant: 'destructive',
      })
      return
    }
    setFile(selectedFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !topicName) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a topic name and a JSON file',
        variant: 'destructive',
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('topicName', topicName)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      })

      // Redirect to home page
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Questions</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topicName">Topic Name</Label>
            <Input
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter the topic name"
              required
            />
          </div>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
              ${file ? 'bg-green-50 border-green-500' : ''}
            `}
          >
            <input {...getInputProps()} />
            <FileJson className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {file ? (
              <div className="text-green-600">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm">Click or drag to replace</p>
              </div>
            ) : isDragActive ? (
              <p>Drop the file here</p>
            ) : (
              <div>
                <p className="font-medium">Drag & drop a JSON file here</p>
                <p className="text-sm text-gray-500">or click to select a file</p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!file || !topicName}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Questions
          </Button>
        </form>
      </Card>
    </div>
    </div>
  )
} 