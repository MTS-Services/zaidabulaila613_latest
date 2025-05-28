"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchProps {
  onSearch: (query: string) => void
}

export default function SearchBox({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        type="search"
        placeholder="Search vendors..."
        className="w-full bg-slate-50 pl-8 rounded-lg border-slate-200"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
