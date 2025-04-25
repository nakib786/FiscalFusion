import { useEffect, useState } from 'react';

/**
 * Custom hook to handle keyboard shortcuts
 * @param {Object} keyMap - Map of keyboard shortcuts to callback functions
 * @param {Array} dependencies - Dependencies array for when to re-bind shortcuts
 */
const useKeyboardShortcut = (keyMap, dependencies = []) => {
  const [isMac, setIsMac] = useState(false);

  // Detect operating system on mount
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsMac(userAgent.indexOf('mac') !== -1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field, textarea, or is focused on similar elements
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        // For global search shortcuts (cmd+k or ctrl+k), we still want to capture them
        // even when in input fields
        const isSearchShortcut = 
          (event.metaKey && event.key.toLowerCase() === 'k') || 
          (event.ctrlKey && event.key.toLowerCase() === 'k');
          
        if (!isSearchShortcut) {
          return;
        }
      }

      // Process key combinations
      Object.entries(keyMap).forEach(([shortcut, callback]) => {
        // Parse the shortcut string
        const keys = shortcut.toLowerCase().split('+');
        
        // On Mac, translate 'cmd' to metaKey, on other platforms translate it to ctrlKey
        const modifierKeys = {
          cmd: isMac ? event.metaKey : event.ctrlKey,
          ctrl: event.ctrlKey,
          alt: event.altKey,
          shift: event.shiftKey,
        };

        // Check if the pressed key matches the shortcut
        let match = true;
        let hasModifier = false;

        for (const key of keys) {
          if (['cmd', 'ctrl', 'alt', 'shift'].includes(key)) {
            hasModifier = true;
            if (!modifierKeys[key]) {
              match = false;
              break;
            }
          } else if (event.key.toLowerCase() !== key.toLowerCase()) {
            match = false;
            break;
          }
        }

        if (match && (hasModifier || keys.length === 1)) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [...dependencies, isMac]);
};

export default useKeyboardShortcut; 