import Sidebar from '@/components/Sidebar'
import QuestionView from '@/components/QuestionView'

export default function QuizPage() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <QuestionView mode="quiz" />
      </main>
    </div>
  )
}
