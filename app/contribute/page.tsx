'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { GithubIcon, FileJson, GitFork, GitPullRequest, PlusCircle } from 'lucide-react'

export default function ContributePage() {
  return (
    <div className="flex justify-center min-h-screen">


    <div className="container max-w-4xl py-8 space-y-8 ">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold mt-14">Contribute to Quizer!</h1>
        <p className="text-lg text-muted-foreground">
          Help make Quizer better by contributing your knowledge. This app thrives on community contributions.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Create New Questions
              </h2>
              <p className="text-muted-foreground mt-2">
                Use our interactive editor to create and format questions easily.
              </p>
            </div>
            <Link href="/create">
              <Button>Create Questions</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileJson className="h-6 w-6" />
                Upload Questions
              </h2>
              <p className="text-muted-foreground mt-2">
                Upload your own JSON file with questions.
              </p>
            </div>
            <Link href="/upload">
              <Button variant="outline">Upload File</Button>
            </Link>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">JSON Format</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "questions": [
    {
      "Question": "Your question text",
      "opt1": "Option 1",
      "opt2": "Option 2",
      "opt3": "Option 3",
      "opt4": "Option 4",
      "correctAns": ["opt1", "opt2"],  // Array for both single and multiple answers
      "proposedAns": ["opt1"],         // Array for both single and multiple answers
      "resource": "URL or reference",
      "isDoubt": false
    }
  ]
}`}
            </pre>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GitFork className="h-6 w-6" />
            Local Development
          </h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">Follow these steps to set up the project locally:</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Clone the repository:
                <pre className="bg-muted p-2 rounded-lg mt-1">git clone https://github.com/rahulvijay5/quizer.git</pre>
              </li>
              <li>Install dependencies:
                <pre className="bg-muted p-2 rounded-lg mt-1">npm install</pre>
              </li>
              <li>Start the development server:
                <pre className="bg-muted p-2 rounded-lg mt-1">npm run dev</pre>
              </li>
            </ol>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GitPullRequest className="h-6 w-6" />
            Submitting Changes
          </h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">To submit your contributions:</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Create a new branch for your changes</li>
              <li>Make your changes and commit them with clear messages</li>
              <li>Push your branch to GitHub</li>
              <li>Open a Pull Request with a description of your changes</li>
            </ol>
          </div>
          <div className="pt-4">
            <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
              <Button variant="outline" className="gap-2">
                <GithubIcon className="h-4 w-4" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Question Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Keep questions clear and concise</li>
              <li>Provide accurate and verifiable answers</li>
              <li>Include reliable resource links for further reading</li>
              <li>Test questions in both quiz and modify modes</li>
              <li>Consider both single and multiple correct answers</li>
              <li>Use proper formatting and grammar</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Code Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Follow the existing code style and formatting</li>
              <li>Write clear commit messages</li>
              <li>Test your changes thoroughly</li>
              <li>Update documentation when needed</li>
              <li>Ensure your code passes all linting checks</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
    </div>
  )
} 