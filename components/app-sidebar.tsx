'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'
import { filesFormated } from '@/lib/constants'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FileText,
  Upload,
  HeartHandshake,
  History as HistoryIcon,
  Info as InfoIcon,
  Github as GithubIcon,
  Search as SearchIcon,
} from 'lucide-react'

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
        <div className="pt-2 px-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Created by Rahul</span>
          <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
            <GithubIcon className="h-4 w-4" />
          </Link>
        </div>
      </div> 