import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { performSearch } from '@/lib/search';
import { useRouter } from 'next/router';

export default function GlobalSearch({ 
  userId = 'current-user', 
  username = 'Company Account',
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen
}) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  
  // Use either external or local state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
  const setIsOpen = externalSetIsOpen || setLocalIsOpen;

  // Detect operating system on mount
  useEffect(() => {
    // Check if the user is on a Mac
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsMac(userAgent.indexOf('mac') !== -1);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Focus the input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle search
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

  const handleOpenSearch = () => {
    setIsOpen(true);
  };

  const handleCloseSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (url) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseSearch();
    }
  };

  // Render the appropriate keyboard shortcut based on the detected OS
  const renderKeyboardShortcut = () => {
    if (isMac) {
      return (
        <span className="px-1.5 py-0.5 rounded border border-white/10 text-white text-xs mr-1">⌘K</span>
      );
    } else {
      return (
        <span className="px-1.5 py-0.5 rounded border border-white/10 text-white text-xs mr-1">Ctrl+K</span>
      );
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'invoice':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'client':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'expense':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'transaction':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
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
    <>
      {/* Search Icon Button */}
      <button
        onClick={handleOpenSearch}
        className="text-white p-2 rounded-md hover:bg-slate-700/20 transition-colors"
        aria-label="Global Search"
        title={`Global Search (${isMac ? '⌘K' : 'Ctrl+K'})`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] px-4">
          <div 
            ref={searchRef}
            className="bg-slate-900/90 border border-white/10 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Search Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">Global Search</h3>
              <button 
                onClick={handleCloseSearch}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Search Input */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <Input
                  ref={inputRef}
                  type="search"
                  className="pl-10 w-full bg-slate-800/50 text-lg"
                  placeholder="Search invoices, clients, expenses..."
                  value={query}
                  onChange={handleInputChange}
                  autoFocus
                />
              </div>
              
              {/* Keyboard shortcut hint */}
              <div className="mt-2 text-xs text-gray-400 flex items-center">
                <span>Press ESC to close</span>
                <div className="flex items-center ml-auto">
                  {renderKeyboardShortcut()}
                  <span>to open search anywhere</span>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center text-muted-foreground flex items-center justify-center">
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <div 
                      key={`${result.type}-${result.id}-${index}`}
                      className="px-4 py-3 hover:bg-muted/50 cursor-pointer rounded-md"
                      onClick={() => handleResultClick(result.url)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 p-2 bg-slate-800/50 rounded-md">
                            {getIconForType(result.type)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{result.title}</div>
                            <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                          </div>
                        </div>
                        {result.status && getStatusBadge(result.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() !== '' ? (
                <div className="p-8 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 