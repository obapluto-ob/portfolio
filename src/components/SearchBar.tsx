import React, { useState } from 'react'

interface SearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

const SearchBar = ({ onSearch, placeholder = "Search projects, skills..." }: SearchProps) => {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
        />
        
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-slate-400">
          Searching for: "{query}"
        </div>
      )}
    </div>
  )
}

export default SearchBar