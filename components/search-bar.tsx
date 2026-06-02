'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'lg'
}

export function SearchBar({ placeholder = "Search destinations...", className, size = 'lg' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/destinations?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className={`flex items-center gap-2 bg-white rounded-full shadow-lg border ${size === 'lg' ? 'p-2' : 'p-1'}`}>
        <div className="flex items-center gap-2 flex-1 pl-4">
          <MapPin className={`text-primary ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`border-0 shadow-none focus-visible:ring-0 bg-transparent ${size === 'lg' ? 'text-lg' : 'text-sm'}`}
          />
        </div>
        <Button 
          type="submit" 
          className={`rounded-full bg-primary hover:bg-primary/90 ${size === 'lg' ? 'h-12 px-6' : 'h-9 px-4'}`}
        >
          <Search className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  )
}
