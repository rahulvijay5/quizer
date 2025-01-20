'use client'

import { Button } from "@/components/ui/button"
import { MenuIcon, GithubIcon, UserCircle2Icon, InfoIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ModeToggle from "./ModeToggle"
import { Pencil } from 'lucide-react'

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <MenuIcon className="h-8 w-8" />
          </Button>
          <Link href="/" className="text-xl font-semibold">SAP Quiz Platform</Link>
        </div>

        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
                  <Button variant="ghost" size="icon">
                    <GithubIcon className="h-8 w-8" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Star this repo on GitHub!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/history">
                  <Button variant="ghost" size="icon">
                    <UserCircle2Icon className="h-8 w-8" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Quiz History</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/notes">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your Notes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ModeToggle />    

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/about">
                  <Button variant="ghost" size="icon">
                        <InfoIcon className="h-8 w-8" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>About this app</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  )
} 