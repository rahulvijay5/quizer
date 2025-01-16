import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-2">SAP Quiz Platform</h1>
      <h2 className="text-xl text-muted-foreground mb-12">A platform built for practicing SAP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/quiz" 
          className="p-6 border rounded-lg hover:bg-accent transition-colors text-center">
          <h3 className="text-2xl font-semibold mb-2">Take a Quiz</h3>
          <p className="text-muted-foreground">Practice your SAP knowledge with our quiz questions</p>
        </Link>
        
        <Link href="/modify" 
          className="p-6 border rounded-lg hover:bg-accent transition-colors text-center">
          <h3 className="text-2xl font-semibold mb-2">Modify Questions</h3>
          <p className="text-muted-foreground">Add, edit, or manage quiz questions and resources</p>
        </Link>

        <Link href="/read" 
          className="p-6 border rounded-lg hover:bg-accent transition-colors text-center">
          <h3 className="text-2xl font-semibold mb-2">Read Topics</h3>
          <p className="text-muted-foreground">Review all questions and answers by topic</p>
        </Link>
      </div>
    </main>
  )
} 