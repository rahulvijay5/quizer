import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

const HISTORY_FILE = 'quiz-history.json'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), HISTORY_FILE)
    
    try {
      await fs.access(filePath)
    } catch {
      // If file doesn't exist, create it with empty array
      await fs.writeFile(filePath, '[]')
      return NextResponse.json([])
    }

    const fileContents = await fs.readFile(filePath, 'utf-8')
    const history = JSON.parse(fileContents)
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error reading quiz history:', error)
    return NextResponse.json({ error: 'Failed to read quiz history' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), HISTORY_FILE)
    const newEntry: QuizHistory = await request.json()
    
    // Read existing history
    let history: QuizHistory[] = []
    try {
      const fileContents = await fs.readFile(filePath, 'utf-8')
      history = JSON.parse(fileContents)
    } catch {
      // If file doesn't exist, start with empty array
    }
    
    // Add new entry
    history.unshift(newEntry)
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(history, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving quiz history:', error)
    return NextResponse.json({ error: 'Failed to save quiz history' }, { status: 500 })
  }
} 