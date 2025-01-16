'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { filesFormated } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

interface QuizResult {
  question: {
    Question: string;
    correctAns: string | string[];
    [key: string]: any;
  };
  userAnswers: string[];
  isCorrect: boolean;
  partialScore: number;
}

interface QuizHistory {
  date: string;
  topic: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  correctAnswers: number;
  partialAnswers: number;
  timeSpent: number;
  results: QuizResult[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<QuizHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/quiz-history')
        if (!response.ok) throw new Error('Failed to load history')
        const data = await response.json()
        setHistory(data)
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateSummary = () => {
    const totalQuizzes = history.length
    const totalQuestions = history.reduce((acc, entry) => acc + entry.totalQuestions, 0)
    const totalCorrect = history.reduce((acc, entry) => acc + entry.correctAnswers, 0)
    const totalPartial = history.reduce((acc, entry) => acc + entry.partialAnswers, 0)
    const totalTimeSpent = history.reduce((acc, entry) => acc + entry.timeSpent, 0)
    const averageScore = history.reduce((acc, entry) => acc + entry.percentage, 0) / totalQuizzes || 0

    return {
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      totalPartial,
      totalTimeSpent,
      averageScore
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading history...</p>
      </div>
    )
  }

  const summary = calculateSummary()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quiz History</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-2">No quiz history yet</p>
            ) : (
              history.map((entry, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {filesFormated.find(f => f.filename === entry.topic)?.name || 
                         entry.topic.replace('files/', '').replace('.json', '')}
                      </h2>
                      <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-2xl font-mono",
                        entry.percentage >= 60 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                      )}>
                        {entry.percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Score: {entry.score.toFixed(1)}/{entry.totalQuestions}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>Questions: {entry.totalQuestions}</p>
                      <p>Correct: {entry.correctAnswers}</p>
                      <p>Partial: {entry.partialAnswers}</p>
                    </div>
                    <div className="text-right">
                      <p>Time: {formatTime(entry.timeSpent)}</p>
                      <p>Accuracy: {((entry.correctAnswers / entry.totalQuestions) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Overall Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-semibold">{summary.totalQuizzes}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className={cn(
                  "text-2xl font-semibold",
                  summary.averageScore >= 60 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                )}>
                  {summary.averageScore.toFixed(1)}%
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-semibold">{summary.totalQuestions}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="text-2xl font-semibold text-green-500 dark:text-green-400">
                  {summary.totalCorrect}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Partial Answers</p>
                <p className="text-2xl font-semibold text-orange-500 dark:text-orange-400">
                  {summary.totalPartial}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Time Spent</p>
                <p className="text-2xl font-semibold">{formatTime(summary.totalTimeSpent)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 