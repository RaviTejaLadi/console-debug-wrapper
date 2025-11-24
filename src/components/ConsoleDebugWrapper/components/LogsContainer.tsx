import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bug, Terminal } from 'lucide-react';
import type { ConsoleEntry } from '../types/console-entry';
import LogEntry from './LogEntry';

interface LogsContainerProps {
  logs: ConsoleEntry[];
  showTimestamp: boolean;
  showStackTrace: boolean;
  autoScroll: boolean;
  onCopyLog: (entry: ConsoleEntry) => void;
  searchTerm: string;
  filter: string;
}

const LogsContainer: React.FC<LogsContainerProps> = ({
  logs,
  showTimestamp,
  showStackTrace,
  autoScroll,
  onCopyLog,
  searchTerm,
  filter,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  // Filter logs based on search term and filter
  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = !searchTerm || 
      log.args.some(arg => 
        String(arg).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      log.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const toggleExpanded = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  if (filteredLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="flex items-center gap-2 mb-2">
          <Bug className="w-8 h-8 opacity-50" />
          <Terminal className="w-6 h-6 opacity-30" />
        </div>
        <p className="text-sm font-medium">No console logs found</p>
        <p className="text-xs text-center max-w-xs">
          {searchTerm || filter !== 'all' 
            ? 'Try adjusting your search or filter criteria'
            : 'Try console.log("Hello") in your code to see logs here'
          }
        </p>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full w-full">
      <div className="space-y-0">
        {filteredLogs.map((entry, index) => {
          const hasStackTrace = entry.stack && showStackTrace;
          const isExpanded = expandedEntries.has(entry.id);
          
          return (
            <div key={entry.id} className="relative">
              <LogEntry
                entry={entry}
                showTimestamp={showTimestamp}
                showStackTrace={showStackTrace}
                onCopy={onCopyLog}
                isExpanded={isExpanded}
                onToggleExpand={hasStackTrace ? () => toggleExpanded(entry.id) : undefined}
              />
              
              {/* Separator between entries */}
              {index < filteredLogs.length - 1 && (
                <div className="h-px bg-border/30 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default LogsContainer;
