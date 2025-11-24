import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onToggleConsole: () => void;
  onClearLogs: () => void;
  onCopyAllLogs: () => void;
  onExportLogs: () => void;
  isConsoleOpen: boolean;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onToggleConsole,
  onClearLogs,
  onCopyAllLogs,
  onExportLogs,
  isConsoleOpen,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when console is open or when toggling
      if (!isConsoleOpen && event.key !== '`') return;

      // Prevent shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Toggle console with backtick (`)
      if (event.key === '`' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        onToggleConsole();
        return;
      }

      // Only handle other shortcuts when console is open
      if (!isConsoleOpen) return;

      // Ctrl/Cmd + K: Clear logs
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onClearLogs();
        return;
      }

      // Ctrl/Cmd + Shift + C: Copy all logs
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        onCopyAllLogs();
        return;
      }

      // Ctrl/Cmd + Shift + E: Export logs
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        onExportLogs();
        return;
      }

      // Escape: Close console
      if (event.key === 'Escape') {
        event.preventDefault();
        onToggleConsole();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggleConsole, onClearLogs, onCopyAllLogs, onExportLogs, isConsoleOpen]);

  return null;
};

export default KeyboardShortcuts;
