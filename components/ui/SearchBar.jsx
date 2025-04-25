import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { performSearch } from '@/lib/search';
import { useRouter } from 'next/router';

export default function SearchBar({ userId = 'current-user', username = 'Company Account' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Add event listener to handle clicking outside of search component
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const searchResults = await performSearch(query, userId, username);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, userId, username]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (url) => {
    setShowResults(false);
    setQuery('');
    router.push(url);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'invoice':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'client':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'expense':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'transaction':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    let badgeClass = '';
    
    switch (status.toLowerCase()) {
      case 'paid':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        break;
      case 'unpaid':
        badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        break;
      case 'overdue':
        badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        break;
      default:
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <Input
          type="search"
          className="pl-10 w-full bg-slate-800/50"
          placeholder="Search invoices, clients, expenses..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
        />
      </div>
      
      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute mt-1 w-full bg-card shadow-lg rounded-lg border border-border max-h-96 overflow-y-auto z-50 right-0">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <div 
                  key={`${result.type}-${result.id}-${index}`}
                  className="px-4 py-2 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleResultClick(result.url)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        {getIconForType(result.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      </div>
                    </div>
                    {result.status && getStatusBadge(result.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 