"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { filesFormated } from "@/lib/constants";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Link from "next/link";
import {
  File,
  FileQuestion,
  FileText,
  HistoryIcon,
  GithubIcon,
  InfoIcon,
  MessageCircleQuestionIcon,
  MoveDownLeftIcon,
  PencilIcon,
  PlusCircle,
  Upload,
  HeartHandshake,
  Search,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useHotkeys } from "react-hotkeys-hook";

export default function Sidebar() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const mode = pathname === "/quiz" ? "Quiz Mode" : "Modify Mode";
  const router = useRouter();

  // Add keyboard shortcuts
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setSearchOpen(true);
  });

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Failed to load files");
        const data = await response.json();
        setFiles(
          data.sort((a: string, b: string) => {
            const aName =
              filesFormated.find((f) => f.filename === a)?.name || a;
            const bName =
              filesFormated.find((f) => f.filename === b)?.name || b;
            return aName.localeCompare(bName);
          })
        );
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };
    loadFiles();
  }, []);

  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
    const event = new CustomEvent("topicChange", { detail: file });
    window.dispatchEvent(event);
    setSearchOpen(false);
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file => {
    const name = filesFormated.find(f => f.filename === file)?.name || 
                 file.replace('files/', '').replace('.json', '');
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCompleteTest = async () => {
    try {
      // Load all questions from all files
      const allQuestions = await Promise.all(
        files.map(async (file) => {
          const response = await fetch(`/api/questions?file=${file}`);
          if (!response.ok)
            throw new Error(`Failed to load questions from ${file}`);
          const questions = await response.json();
          return questions.map((q: any) => ({ ...q, sourceTopic: file }));
        })
      );

      // Flatten and shuffle all questions
      const flatQuestions = allQuestions.flat();
      const event = new CustomEvent("completeTest", {
        detail: { questions: flatQuestions },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error loading complete test:", error);
    }
  };

  return (
    <div className="w-64 border-r flex flex-col justify-between h-[calc(100vh-5rem)]">
      <div className="p-4 border-b w-full">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <h1 className="font-semibold text-lg text-left">{mode}</h1>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full gap-2">
              <DropdownMenuItem className="flex items-center gap-2 justify-start">
                <FileQuestion className="h-4 w-4" />
                <Link href="/quiz" className="font-semibold">Quiz</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 justify-start">
                <PencilIcon className="h-4 w-4" />
                <Link href="/modify" className="font-semibold">Modify</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 justify-start">
                <FileText className="h-4 w-4" />
                <Link href="/read" className="font-semibold">Read</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 justify-start">
                <MessageCircleQuestionIcon className="h-4 w-4" />
                <Link href="/doubts" className="font-semibold">Doubts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 justify-start">
                <PlusCircle className="h-4 w-4" />
                <Link href="/create" className="font-semibold">Create</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full px-3 py-2 text-sm rounded-md border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {mode === "Quiz Mode" && (
            <Button
              variant="default"
              className="w-full mb-4"
              onClick={handleCompleteTest}
            >
              Start Complete Test
            </Button>
          )}
          {filteredFiles.map((file) => (
            <Button
              key={file}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                selectedFile === file && "bg-gray-100 dark:text-black"
              )}
              onClick={() => handleFileSelect(file)}
            >
              {filesFormated.find((f) => f.filename === file)?.name ||
                file.replace("files/", "").replace(".json", "")}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t space-y-2">
        <Link href="/upload">
          <Button variant="ghost" className="w-full justify-start">
            <Upload className="h-4 w-4 mr-2" />
            Upload Questions
          </Button>
        </Link>
        <Link href="/contribute">
          <Button variant="ghost" className="w-full justify-start">
            <HeartHandshake className="h-4 w-4 mr-2" />
            Contribute
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="ghost" className="w-full justify-start">
            <HistoryIcon className="h-4 w-4 mr-2" />
            Your History
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="ghost" className="w-full justify-start">
            <InfoIcon className="h-4 w-4 mr-2" />
            About
          </Button>
        </Link>
        <Separator />
          <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
        <div className="pt-2 px-2 text-xs text-muted-foreground hover:underline hover:text-blue-500 flex items-center justify-between">
          <span>Created by Rahul</span>
            <GithubIcon className="h-4 w-4" />
        </div>
          </Link>
      </div>    

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search topics..." />
        <CommandList>
          <CommandEmpty>No topics found.</CommandEmpty>
          <CommandGroup heading="Topics">
            {files.map((file) => (
              <CommandItem
                key={file}
                onSelect={() => handleFileSelect(file)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {filesFormated.find((f) => f.filename === file)?.name ||
                 file.replace("files/", "").replace(".json", "")}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
