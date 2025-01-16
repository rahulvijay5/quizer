import Sidebar from '@/components/Sidebar'
import QuestionView from '@/components/QuestionView'

export default function ModifyPage() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <QuestionView mode="modify" />
      </main>
    </div>
  )
}