'use client'

import { Button } from "@/components/ui/button"
import { MenuIcon, GithubIcon, UserCircle2Icon, InfoIcon } from "lucide-react"
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
            <MenuIcon className="h-6 w-6" />
          </Button>
          <Link href="/" className="text-xl font-semibold">SAP Quiz Platform</Link>
        </div>

        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
                  <Button variant="ghost" size="icon">
                    <GithubIcon className="h-5 w-5" />
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
                    <UserCircle2Icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Quiz History</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/about">
                  <Button variant="ghost" size="icon">
                    <InfoIcon className="h-5 w-5" />
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