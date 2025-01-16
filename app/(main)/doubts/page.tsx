'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Question {
  Question: string;
  correctAns: string | string[];
  proposedAns: string | string[];
  resource: string;
  isDoubt: boolean;
  [key: string]: any;
}

interface TopicQuestions {
  topic: string;
  questions: Question[];
}

export default function DoubtsPage() {
  const [loading, setLoading] = useState(true)
  const [doubtQuestions, setDoubtQuestions] = useState<TopicQuestions[]>([])

  useEffect(() => {
    const loadDoubtQuestions = async () => {
      try {
        // First, get all files
        const filesResponse = await fetch('/api/files')
        if (!filesResponse.ok) throw new Error('Failed to load files')
        const files = await filesResponse.json()

        // Then, load questions from each file and filter for doubts
        const doubtsPerTopic = await Promise.all(
          files.map(async (file: string) => {
            const response = await fetch(`/api/questions?file=${file}`)
            if (!response.ok) throw new Error(`Failed to load questions from ${file}`)
            const questions = await response.json()
            const doubtQuestions = questions.filter((q: Question) => q.isDoubt)
            return {
              topic: file.replace('files/', '').replace('.json', ''),
              questions: doubtQuestions
            }
          })
        )

        // Filter out topics with no doubt questions
        setDoubtQuestions(doubtsPerTopic.filter(topic => topic.questions.length > 0))
      } catch (error) {
        console.error('Error loading doubt questions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDoubtQuestions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading doubts...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questions Marked as Doubt</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>

      {doubtQuestions.length === 0 ? (
        <p className="text-center text-gray-500">No questions marked as doubt</p>
      ) : (
        <div className="space-y-8">
          {doubtQuestions.map((topic, topicIndex) => (
            <div key={topicIndex} className="space-y-4">
              <h2 className="text-2xl font-semibold">{topic.topic}</h2>
              {topic.questions.map((question, questionIndex) => (
                <Card key={questionIndex} className="p-6">
                  <div className="space-y-4">
                    <p className="text-lg">{question.Question}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Correct Answer: {Array.isArray(question.correctAns) 
                        ? question.correctAns.join(', ') 
                        : question.correctAns}
                      </p>
                      {question.resource && (
                        <p className="mt-2">
                          Resource: {' '}
                          {question.resource.startsWith('http') ? (
                            <Link 
                              href={question.resource} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Link
                            </Link>
                          ) : (
                            question.resource
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 