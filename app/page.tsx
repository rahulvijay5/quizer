"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  FileQuestion,
  PencilIcon,
  BookOpen,
  MessageCircleQuestion,
  HeartHandshake,
  History,
  Github,
  CloudOff,
  PlusCircle,
  LucideUpload,
  Pen,
} from "lucide-react";
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from "@/components/ui/tooltip";
import ModeToggle from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Quizer <ModeToggle />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A community-driven platform for SAP learning. Your files, your data,
            everything stored locally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[120px]">
        <div className="md:col-span-2 flex gap-4 w-full">
            
            <Link
              href="/upload"
              className="flex justify-between items-center hover:border-primary/50 transition-colors"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LucideUpload className="h-20 w-20 p-4 text-primary self-center border-8 rounded-full border-r-emerald-400 border-t-0 border-b-0 border-l-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload Questions
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </Link>
            <Link href="/quiz" className="md:col-span-2 w-full">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between h-full">
                <FileQuestion className="h-8 w-8 mb-4 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Take a Quiz</h2>
                  <p className="text-muted-foreground">
                    Test your SAP knowledge with topic-specific quizzes
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          </div>

          <Link href="/modify" className="md:row-span-2">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors row-span-2 flex justify-between">
              <div>
                <PencilIcon className="h-8 w-8 mb-4 text-primary" />
                <h2 className="text-lg font-semibold mb-2">Modify Questions</h2>
                <p className="text-sm text-muted-foreground">
                  Edit and update questions
                </p>
              </div>
            </Card>
          </Link>

          <Card className="p-6 h-full bg-muted row-span-2">
            <CloudOff className="h-8 w-8 mb-4 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Local First</h2>
            <p className="text-sm text-muted-foreground">
              All data stored on your device
            </p>
          </Card>

          <Link href="/read">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <BookOpen className="h-8 w-8 mb-4 text-primary" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Read Topics</h2>
                <p className="text-sm text-muted-foreground">
                  Study and review materials
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/doubts">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <MessageCircleQuestion className="h-8 w-8 mb-4 text-primary" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Doubts</h2>
                <p className="text-sm text-muted-foreground">
                  Mark and review unclear topics
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/history" className="md:col-span-1 md:row-span-1 ">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <History className="h-8 w-8 mb-4 text-primary" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your History</h2>
                <p className="text-sm text-muted-foreground">
                  Track your progress
                </p>
              </div>
            </Card>
          </Link>

          <div className="flex gap-4 w-full">
          <Link href="https://github.com/rahulvijay5/quizer" target="_blank" className="w-full">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <Github className="h-8 w-8 mb-4 text-primary" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Open Source</h2>
              </div>
            </Card>
          </Link>
          <Link href="/notes" target="_blank" className="w-full">
            <Card className="p-6 h-full hover:border-primary/50 transition-colors">
              <Pen className="h-8 w-8 mb-4 text-primary" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Notes</h2>
              </div>
            </Card>
          </Link>
          </div>


          <div className="md:col-span-2 flex gap-4">
            <Link href="/contribute" className="w-full">
              <Card className="p-6 h-full hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between h-full">
                  <HeartHandshake className="h-8 w-8 mb-4 text-primary" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Contribute</h2>
                    <p className="text-muted-foreground">
                      Help grow the platform by adding your knowledge
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link
              href="/create"
              className="flex justify-between items-center hover:border-primary/50 transition-colors"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <PlusCircle className="h-20 w-20 text-primary self-center border-8 rounded-full border-l-purple-600 border-t-0 border-b-0 border-r-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Create Questions
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
