"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { toast } from "./ui/use-toast";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { timePerQuestion } from "@/lib/constants";

interface Question {
  Question: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
  correctAns: string | string[];
  proposedAns: string | string[];
  quizAns?: string | string[];
  resource: string;
  isDoubt?: boolean;
}

interface QuestionViewProps {
  mode: "quiz" | "modify";
}

type AnswerType = "proposedAns" | "correctAns" | "quizAns";

interface QuizResult {
  question: Question;
  userAnswers: string[];
  isCorrect: boolean;
  partialScore: number;
}

interface QuizState {
  isActive: boolean;
  timeLeft: number;
  totalQuestions: number;
  questions: Question[];
  answers: Record<number, string[]>;
  results: QuizResult[] | null;
}

interface Option {
  text: string;
  key: string;
}

export default function QuestionView({ mode }: QuestionViewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isDoubt, setIsDoubt] = useState(false);
  const [resource, setResource] = useState("");
  const [answerType, setAnswerType] = useState<AnswerType>("proposedAns");
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    timeLeft: 0,
    totalQuestions: 10,
    questions: [],
    answers: {},
    results: null,
  });
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const currentQuestion =
    mode === "quiz" && quizState.isActive
      ? quizState.questions[currentQuestionIndex]
      : questions[currentQuestionIndex];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const currentOptions = getOptions();
      if (e.key === "ArrowLeft") {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentQuestionIndex((prev) =>
          Math.min(questions.length - 1, prev + 1)
        );
      } else if (e.key === "Enter") {
        saveQuestions(questions);
      } else if (e.key.toLowerCase() === "d") {
        handleDoubtToggle(!isDoubt);
      } else if (e.key.toLowerCase() === "t") {
        setAnswerType((prev) =>
          prev === "proposedAns" ? "correctAns" : "proposedAns"
        );
      } else if (e.key.toLowerCase() === "c" && mode === "modify") {
        setIsMultiSelect(prev => !prev);
      } else if (/^[1-6]$/.test(e.key)) {
        const optionIndex = parseInt(e.key) - 1;
        const option = currentOptions[optionIndex];
        if (option) {
          handleAnswerChange(option.text);
        }
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        if (mode === "quiz" && quizState.isActive) {
          endQuiz();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [questions, currentQuestionIndex, isDoubt, mode, quizState.isActive, isMultiSelect]);

  useEffect(() => {
    const handleTopicChange = async (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const filePath = customEvent.detail;
      setCurrentFile(filePath);

      try {
        const response = await fetch(`/api/questions?file=${filePath}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to load questions");
        }
        const data = await response.json();
        setQuestions(data);

        // Save to localStorage
        localStorage.setItem("currentTopic", filePath);
        localStorage.setItem("currentQuestionIndex", "0");

        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setIsDoubt(data[0]?.isDoubt || false);
        setResource(data[0]?.resource || "");
        if (mode === "quiz") {
          setShowQuizDialog(true);
        }
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load questions",
          variant: "destructive",
        });
      }
    };

    const handleCompleteTest = (event: Event) => {
      const customEvent = event as CustomEvent<{ questions: Question[] }>;
      const allQuestions = customEvent.detail.questions;
      setQuestions(allQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setIsDoubt(false);
      setResource("");
      setShowQuizDialog(true);
    };

    window.addEventListener("topicChange", handleTopicChange);
    window.addEventListener("completeTest", handleCompleteTest);
    return () => {
      window.removeEventListener("topicChange", handleTopicChange);
      window.removeEventListener("completeTest", handleCompleteTest);
    };
  }, [mode]);

  // Load saved topic and question index on mount
  useEffect(() => {
    const savedTopic = localStorage.getItem("currentTopic");
    const savedIndex = localStorage.getItem("currentQuestionIndex");

    if (savedTopic) {
      const event = new CustomEvent("topicChange", { detail: savedTopic });
      window.dispatchEvent(event);
      if (savedIndex) {
        setCurrentQuestionIndex(parseInt(savedIndex));
      }
    }
  }, []);

  // Save current question index to localStorage
  useEffect(() => {
    if (currentFile) {
      localStorage.setItem(
        "currentQuestionIndex",
        currentQuestionIndex.toString()
      );
    }
  }, [currentQuestionIndex, currentFile]);

  useEffect(() => {
    if (currentQuestion) {
      setIsDoubt(currentQuestion.isDoubt || false);
      setResource(currentQuestion.resource || "");
      if (mode === "quiz" && quizState.isActive) {
        setSelectedAnswers(quizState.answers[currentQuestionIndex] || []);
      } else {
        const answers = currentQuestion[answerType];
        setSelectedAnswers(
          Array.isArray(answers) ? answers : answers ? [answers] : []
        );
        // Set multi-select mode based on answer type
        setIsMultiSelect(Array.isArray(answers) && answers.length > 1);
      }
    }
  }, [currentQuestionIndex, currentQuestion, answerType, mode, quizState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState.isActive && quizState.timeLeft > 0) {
      timer = setInterval(() => {
        setQuizState((prev) => {
          const newTimeLeft = prev.timeLeft - 1;
          localStorage.setItem("quizTimeLeft", newTimeLeft.toString());
          if (newTimeLeft === 0) {
            endQuiz();
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState.isActive, quizState.timeLeft]);

  const startQuiz = (numQuestions: number) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, numQuestions);
    
    const totalTime = numQuestions * timePerQuestion;

    setQuizState({
      isActive: true,
      timeLeft: totalTime,
      totalQuestions: numQuestions,
      questions: selectedQuestions,
      answers: {},
      results: null,
    });

    // Dispatch quiz state change event
    const event = new CustomEvent('quizStateChange', { 
      detail: { isActive: true }
    });
    window.dispatchEvent(event);

    localStorage.setItem('quizTimeLeft', totalTime.toString());
    localStorage.setItem('quizStartTime', Date.now().toString());
    localStorage.setItem('quizQuestions', JSON.stringify(selectedQuestions));
    setCurrentQuestionIndex(0);
    setShowQuizDialog(false);
  };

  const saveQuizHistory = async (results: QuizResult[]) => {
    try {
      const totalScore = results.reduce((sum, r) => sum + r.partialScore, 0);
      const percentage = (totalScore / quizState.totalQuestions) * 100;
      const correctAnswers = results.filter((r) => r.isCorrect).length;
      const partialAnswers = results.filter(
        (r) => r.partialScore > 0 && r.partialScore < 1
      ).length;

      // Calculate time spent
      const startTime = parseInt(localStorage.getItem('quizStartTime') || '0');
      const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      const history = {
        date: new Date().toISOString(),
        topic: currentFile,
        totalQuestions: quizState.totalQuestions,
        score: totalScore,
        percentage,
        correctAnswers,
        partialAnswers,
        timeSpent:quizState.totalQuestions*timePerQuestion-quizState.timeLeft,
        results,
      };

      const response = await fetch("/api/quiz-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(history),
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz history");
      }
    } catch (error) {
      console.error("Error saving quiz history:", error);
    }
  };

  const endQuiz = () => {
    // Dispatch quiz state change event
    const event = new CustomEvent('quizStateChange', { 
      detail: { isActive: false }
    });
    window.dispatchEvent(event);

    const results = quizState.questions.map((q, index) => {
      const userAnswers = quizState.answers[index] || [];
      const correctAnswers = Array.isArray(q.correctAns)
        ? q.correctAns
        : [q.correctAns];
      const isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((a) => correctAnswers.includes(a));
      const partialScore = Array.isArray(q.correctAns)
        ? userAnswers.filter((a) => correctAnswers.includes(a)).length /
          correctAnswers.length
        : isCorrect
        ? 1
        : 0;
      return {
        question: q,
        userAnswers,
        isCorrect,
        partialScore,
      };
    });

    // Save quiz history
    saveQuizHistory(results);

    // Save quiz answers
    const updatedQuestions = [...questions];
    quizState.questions.forEach((q, index) => {
      const originalIndex = questions.findIndex(
        (oq) => oq.Question === q.Question
      );
      if (originalIndex !== -1) {
        updatedQuestions[originalIndex] = {
          ...updatedQuestions[originalIndex],
          quizAns: quizState.answers[index] || [],
        };
      }
    });
    saveQuestions(updatedQuestions);

    setQuizState((prev) => ({
      ...prev,
      isActive: false,
      results,
    }));
    setShowResultsDialog(true);
    localStorage.removeItem("quizTimeLeft");
    localStorage.removeItem("quizQuestions");
    localStorage.removeItem("quizStartTime");
  };

  const handleAnswerChange = (value: string) => {
    if (mode === "quiz" && quizState.isActive) {
      const newAnswers = Array.isArray(currentQuestion?.correctAns)
        ? (quizState.answers[currentQuestionIndex] || []).includes(value)
          ? (quizState.answers[currentQuestionIndex] || []).filter(
              (a) => a !== value
            )
          : [...(quizState.answers[currentQuestionIndex] || []), value]
        : [value];

      setQuizState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestionIndex]: newAnswers,
        },
      }));
      setSelectedAnswers(newAnswers);
    } else {
      if (isMultiSelect) {
        setSelectedAnswers((prev) =>
          prev.includes(value)
            ? prev.filter((a) => a !== value)
            : [...prev, value]
        );
      } else {
        setSelectedAnswers([value]);
        // For single select, save immediately
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQuestion,
          [answerType]: [value],
        };
        saveQuestions(updatedQuestions);
      }
    }
  };

  const handleDoubtToggle = async (checked: boolean) => {
    setIsDoubt(checked);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      isDoubt: checked,
    };
    setQuestions(updatedQuestions);
    await saveQuestions(updatedQuestions);
  };

  const handleResourceChange = async (newResource: string) => {
    setResource(newResource);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      resource: newResource,
    };
    setQuestions(updatedQuestions);
    await saveQuestions(updatedQuestions);
  };

  const saveQuestions = async (updatedQuestions: Question[]) => {
    try {
      if (!quizState.isActive) {
        // Update the current question's answer before saving
        const currentAnswers = isMultiSelect ? selectedAnswers : [selectedAnswers[0]];
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          [answerType]: currentAnswers,
        };
      }

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: currentFile,
          questions: updatedQuestions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save changes");
      }
      setQuestions(updatedQuestions);
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const getOptions = (): Option[] => {
    if (!currentQuestion) return [];

    const options: Option[] = [];
    for (let i = 1; i <= 4; i++) {
      const optKey = `opt${i}` as keyof Question;
      if (currentQuestion[optKey]) {
        options.push({
          text: currentQuestion[optKey] as string,
          key: optKey,
        });
      }
    }
    return options;
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    
    const isMultipleChoice = Array.isArray(currentQuestion.correctAns) && currentQuestion.correctAns.length > 1;
    const optionIndexStr = optionIndex.toString();
    
    if (mode === "modify") {
      const currentAnswers = Array.isArray(currentQuestion.proposedAns) 
        ? currentQuestion.proposedAns 
        : [currentQuestion.proposedAns];

      let newAnswers: string[];
      if (isMultipleChoice) {
        // Toggle the selected option
        newAnswers = currentAnswers.includes(optionIndexStr)
          ? currentAnswers.filter(ans => ans !== optionIndexStr)
          : [...currentAnswers, optionIndexStr].sort();
      } else {
        // Single choice - replace the answer
        newAnswers = [optionIndexStr];
      }

      setQuestions(prev => prev.map((q, i) => 
        i === currentQuestionIndex
          ? { ...q, proposedAns: newAnswers.length === 1 ? newAnswers[0] : newAnswers }
          : q
      ));

      // Save after updating
      saveQuestions();
    } else {
      // Quiz mode
      const currentAnswers = Array.isArray(currentQuestion.quizAns) 
        ? currentQuestion.quizAns 
        : currentQuestion.quizAns ? [currentQuestion.quizAns] : [];

      let newAnswers: string[];
      if (isMultipleChoice) {
        // Toggle the selected option
        newAnswers = currentAnswers.includes(optionIndexStr)
          ? currentAnswers.filter(ans => ans !== optionIndexStr)
          : [...currentAnswers, optionIndexStr].sort();
      } else {
        // Single choice - replace the answer
        newAnswers = [optionIndexStr];
      }

      setQuestions(prev => prev.map((q, i) => 
        i === currentQuestionIndex
          ? { ...q, quizAns: newAnswers.length === 1 ? newAnswers[0] : newAnswers }
          : q
      ));
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          Select a topic to start the {mode === "quiz" ? "quiz" : "editing"}
        </p>
      </div>
    );
  }

  const options = getOptions();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 justify-between">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1} of{" "}
              {mode === "quiz" && quizState.isActive
                ? quizState.totalQuestions
                : questions.length}
            </h2>
            {mode === "modify" && (
              <>
                <Select
                  value={answerType}
                  onValueChange={(value: string) =>
                    setAnswerType(value as AnswerType)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select answer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposedAns">Proposed Answer</SelectItem>
                    <SelectItem value="correctAns">Correct Answer</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMultiSelect(prev => !prev)}
                  className={cn(
                    "gap-2",
                    isMultiSelect && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {isMultiSelect ? "Multi Select (C)" : "Single Select (C)"}
                </Button>
              </>
            )}
            {mode === "quiz" && quizState.isActive && (
              <div
                className={cn(
                  quizState.timeLeft >= 300000
                    ? "text-green-500"
                    : "text-red-500",
                  "text-lg font-mono"
                )}
              >
                Time: {formatTime(quizState.timeLeft)}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={isDoubt} onCheckedChange={handleDoubtToggle} />
            <Label>Mark as Doubt (D)</Label>
          </div>
        </div>

        <Card className="p-6">
          <div
            className={`text-lg mb-6 ${
              mode === "modify"
                ? "cursor-pointer hover:bg-gray-50 p-2 rounded"
                : ""
            }`}
            onClick={
              mode === "modify"
                ? () => copyToClipboard(currentQuestion.Question)
                : undefined
            }
          >
            {currentQuestion.Question}
            {mode === "quiz" && (
              <div className="text-sm text-muted-foreground mt-2">
                {Array.isArray(currentQuestion.correctAns) && currentQuestion.correctAns.length > 1
                  ? `Select ${currentQuestion.correctAns.length} correct answers`
                  : "Select the correct answer"}
              </div>
            )}
            {mode === "modify" && (
              <p className="text-xs text-gray-300 mt-1">
                Click to copy question
              </p>
            )}
          </div>

          <div className="space-y-4">
            {mode === "modify" && answerType === "correctAns" ? (
              // Always use checkboxes for correctAns in modify mode
              options.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => handleAnswerChange(option.text)}
                >
                  <Checkbox
                    id={option.key}
                    checked={selectedAnswers.includes(option.text)}
                    onCheckedChange={() => handleAnswerChange(option.text)}
                  />
                  <Label htmlFor={option.key} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))
            ) : mode === "modify" && answerType === "proposedAns" ? (
              // Use radio or checkbox based on isMultiSelect for proposedAns
              isMultiSelect ? (
                options.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => handleAnswerChange(option.text)}
                  >
                    <Checkbox
                      id={option.key}
                      checked={selectedAnswers.includes(option.text)}
                      onCheckedChange={() => handleAnswerChange(option.text)}
                    />
                    <Label htmlFor={option.key} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))
              ) : (
                <RadioGroup
                  value={selectedAnswers[0]}
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {options.map((option) => (
                    <div
                      key={option.key}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => handleAnswerChange(option.text)}
                    >
                      <RadioGroupItem value={option.text} id={option.key} />
                      <Label htmlFor={option.key} className="cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )
            ) : (
              // Quiz mode - use checkbox for multiple correct answers, radio for single
              Array.isArray(currentQuestion.correctAns) && currentQuestion.correctAns.length > 1 ? (
                options.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => handleAnswerChange(option.text)}
                  >
                    <Checkbox
                      id={option.key}
                      checked={selectedAnswers.includes(option.text)}
                      onCheckedChange={() => handleAnswerChange(option.text)}
                    />
                    <Label htmlFor={option.key} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))
              ) : (
                <RadioGroup
                  value={selectedAnswers[0]}
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {options.map((option) => (
                    <div
                      key={option.key}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => handleAnswerChange(option.text)}
                    >
                      <RadioGroupItem value={option.text} id={option.key} />
                      <Label htmlFor={option.key} className="cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )
            )}
          </div>
        </Card>

        <div className="flex justify-between items-center gap-8">
          <Button
            variant="outline"
            onClick={() => {
              if (mode === "modify") {
                // Save current question before navigating
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex] = {
                  ...currentQuestion,
                  [answerType]: isMultiSelect ? selectedAnswers : [selectedAnswers[0]],
                };
                saveQuestions(updatedQuestions);
              }
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>

          {mode === "modify" ? (
            <div className="flex items-center justify-center w-full gap-4">
              <h1 className="text-sm text-muted-foreground">
                Resource:
              </h1>
              <div className="w-full relative">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => handleResourceChange(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter resource URL or text reference"
                />
                <p className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
                  Can be a URL or descriptive text
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => saveQuestions(questions)}
                className="w-full"
              >
                Save Answer (Enter)
              </Button>
              {mode === "quiz" &&
                quizState.isActive &&
                currentQuestionIndex === quizState.totalQuestions - 1 && (
                  <Button
                    onClick={endQuiz}
                    variant="default"
                    className="w-full"
                  >
                    Submit Quiz
                  </Button>
                )}
            </div>
          )}

          <Button
            onClick={() => {
              if (mode === "modify") {
                // Save current question before navigating
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex] = {
                  ...currentQuestion,
                  [answerType]: isMultiSelect ? selectedAnswers : [selectedAnswers[0]],
                };
                saveQuestions(updatedQuestions);
              }
              setCurrentQuestionIndex((prev) =>
                Math.min(
                  (mode === "quiz" && quizState.isActive
                    ? quizState.totalQuestions
                    : questions.length) - 1,
                  prev + 1
                )
              );
            }}
            disabled={
              currentQuestionIndex ===
              (mode === "quiz" && quizState.isActive
                ? quizState.totalQuestions
                : questions.length) -
                1
            }
          >
            Next <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {currentQuestion.resource && mode === "quiz" && (
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Resource:{" "}
              {currentQuestion.resource.startsWith("http") ? (
                <Link
                  href={currentQuestion.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Link
                </Link>
              ) : (
                currentQuestion.resource
              )}
            </p>
          </div>
        )}
      </div>

      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Quiz</DialogTitle>
            <DialogDescription>
              Choose the number of questions for your quiz
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="questions">Number of Questions:</Label>
              <input
                id="questions"
                type="number"
                min="1"
                max={questions.length}
                value={quizState.totalQuestions}
                onChange={(e) =>
                  setQuizState((prev) => ({
                    ...prev,
                    totalQuestions: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-20 p-2 border rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => startQuiz(quizState.totalQuestions)}>
              Start Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
            {quizState.results && (
              <div className="space-y-2">
                <div className="text-lg font-semibold">
                  Score: {quizState.results.reduce((sum, r) => sum + r.partialScore, 0).toFixed(1)}/{quizState.totalQuestions}
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  ((quizState.results.reduce((sum, r) => sum + r.partialScore, 0) / quizState.totalQuestions) * 100) >= 60
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                )}>
                  {((quizState.results.reduce((sum, r) => sum + r.partialScore, 0) / quizState.totalQuestions) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-6">
            {quizState.results?.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  result.isCorrect 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                )}
              >
                <h3 className="font-medium mb-2">
                  {index + 1}. {result.question.Question}
                </h3>
                <div className="space-y-2">
                  {Object.entries(result.question)
                    .filter(([key]) => key.startsWith('opt') && result.question[key as keyof Question])
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className={cn(
                          "p-2 rounded border",
                          Array.isArray(result.question.correctAns)
                            ? result.question.correctAns.includes(value) &&
                              "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                            : result.question.correctAns === value &&
                              "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
                          result.userAnswers.includes(value) &&
                            !result.isCorrect &&
                            "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                        )}
                      >
                        {value}
                      </div>
                    ))}
                </div>
                {!result.isCorrect && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Correct answer:{' '}
                    {Array.isArray(result.question.correctAns)
                      ? result.question.correctAns.join(', ')
                      : result.question.correctAns}
                  </div>
                )}
                {result.partialScore > 0 && result.partialScore < 1 && (
                  <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                    Partial score: {result.partialScore.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
