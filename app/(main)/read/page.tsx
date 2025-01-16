'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { filesFormated } from '@/lib/constants'

interface Question {
  Question: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
  correctAns: string | string[];
  proposedAns: string | string[];
  resource: string;
}

interface TopicQuestions {
  topic: string;
  questions: Question[];
}

export default function ReadPage() {
  const [loading, setLoading] = useState(true)
  const [topics, setTopics] = useState<TopicQuestions[]>([])
  const [showCorrectAns, setShowCorrectAns] = useState(false)

  useEffect(() => {
    const loadAllQuestions = async () => {
      try {
        // First, get all files
        const filesResponse = await fetch('/api/files')
        if (!filesResponse.ok) throw new Error('Failed to load files')
        const files = await filesResponse.json()

        // Then, load questions from each file
        const allTopics = await Promise.all(
          files.map(async (file: string) => {
            const response = await fetch(`/api/questions?file=${file}`)
            if (!response.ok) throw new Error(`Failed to load questions from ${file}`)
            const questions = await response.json()
            return {
              topic: filesFormated.find(f => f.filename === file)?.name || file,
              questions
            }
          })
        )

        // Sort topics alphabetically
        setTopics(allTopics.sort((a, b) => a.topic.localeCompare(b.topic)))
      } catch (error) {
        console.error('Error loading questions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllQuestions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading topics...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Read Topics</h1>
          <p className="text-sm text-muted-foreground">
            Review all questions and answers by topic
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowCorrectAns(!showCorrectAns)}
            className="min-w-[140px]"
          >
            Show {showCorrectAns ? 'Proposed' : 'Correct'} Answers
          </Button>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="space-y-4">
            <h2 className="text-2xl font-semibold sticky top-0 bg-background py-2">
              {topic.topic}
            </h2>
            {topic.questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="p-6">
                <div className="space-y-4">
                  <p className="text-lg font-medium">
                    {questionIndex + 1}. {question.Question}
                  </p>
                  <div className="grid gap-2">
                    {['opt1', 'opt2', 'opt3', 'opt4'].map((optKey) => {
                      const option = question[optKey as keyof Question]
                      if (!option) return null

                      const isCorrect = Array.isArray(question.correctAns)
                        ? question.correctAns.includes(option as string)
                        : question.correctAns === option
                      const isProposed = Array.isArray(question.proposedAns)
                        ? question.proposedAns.includes(option as string)
                        : question.proposedAns === option
                      const shouldHighlight = showCorrectAns ? isCorrect : isProposed

                      return (
                        <div
                          key={optKey}
                          className={cn(
                            "p-3 rounded-md border",
                            shouldHighlight && "border-green-500 text-green-600 dark:text-green-400"
                          )}
                        >
                          {option}
                        </div>
                      )
                    })}
                  </div>
                  {question.resource && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mt-2">
                        Resource:{' '}
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
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
} 