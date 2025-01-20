"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
    ChevronLeft,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to load notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
      toast.error("Failed to load notes");
    }
  };

  const createNote = async () => {
    if (!newNoteTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error("Failed to create note");

      setNotes((prev) => [...prev, newNote]);
      setSelectedNote(newNote);
      setShowNewNoteDialog(false);
      setNewNoteTitle("");
      toast.success("Note created");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const saveNote = async () => {
    if (!selectedNote) return;

    try {
      const updatedNote = {
        ...selectedNote,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) throw new Error("Failed to save note");

      setNotes((prev) =>
        prev.map((note) => (note.id === selectedNote.id ? updatedNote : note))
      );
      setIsEditing(false);
      toast.success("Note saved");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Notes Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b flex flex-col gap-2">
        <Button onClick={() => router.back()} variant={"outline"} className="w-full">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        <Button onClick={() => setShowNewNoteDialog(true)} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`p-3 cursor-pointer hover:bg-accent ${
                  selectedNote?.id === note.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteNote(note.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Note Editor */}
      <div className="flex-1 p-6">
        {selectedNote ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
              <div>
                <Button onClick={saveNote} disabled={!isEditing}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            <Textarea
              value={selectedNote.content}
              onChange={(e) => {
                setSelectedNote((prev) =>
                  prev
                    ? {
                        ...prev,
                        content: e.target.value,
                      }
                    : null
                );
                setIsEditing(true);
              }}
              className="min-h-[calc(100vh-12rem)]"
              placeholder="Start writing..."
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a note or create a new one
          </div>
        )}
      </div>

      {/* New Note Dialog */}
      <Dialog open={showNewNoteDialog} onOpenChange={setShowNewNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Enter a title for your new note
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title"
          />
          <DialogFooter>
            <Button onClick={createNote}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
