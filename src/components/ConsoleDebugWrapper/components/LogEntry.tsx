import React, { useState } from 'react';
import { Copy, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ConsoleEntry } from '../types/console-entry';
import { getLogIcon } from '../utils/getLogIcon';
import EnhancedFormatArgs from './EnhancedFormatArgs';

interface LogEntryProps {
  entry: ConsoleEntry;
  showTimestamp: boolean;
  showStackTrace: boolean;
  onCopy: (entry: ConsoleEntry) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const LogEntry: React.FC<LogEntryProps> = ({
  entry,
  showTimestamp,
  showStackTrace,
  onCopy,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [isStackTraceExpanded, setIsStackTraceExpanded] = useState(false);
  const hasStackTrace = entry.stack && showStackTrace;

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'debug':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div className={`group ${getLogLevelColor(entry.level)} rounded-lg m-2 hover:shadow-sm transition-all duration-150`}>
      <div className="flex items-start gap-2 p-2 rounded-lg bg-background/80 ">
        {/* Log Level Icon and Expand Button */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasStackTrace && onToggleExpand ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              {getLogIcon(entry.level)}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 font-mono ${getLogLevelColor(entry.level)}`}
              >
                {entry.level.toUpperCase()}
              </Badge>
              
              {showTimestamp && (
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimestamp(entry.timestamp)}
                </span>
              )}

              {entry.method && (
                <span className="text-xs text-muted-foreground font-mono">
                  {entry.method}()
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(entry)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Log Content */}
          <div className="font-mono">
            <EnhancedFormatArgs args={entry.args} />
          </div>

          {/* Stack Trace */}
          {hasStackTrace && isExpanded && (
            <div className="mt-2 border-t border-border/50 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStackTraceExpanded(!isStackTraceExpanded)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground mb-2"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Stack Trace
                {isStackTraceExpanded ? (
                  <ChevronDown className="w-3 h-3 ml-1" />
                ) : (
                  <ChevronRight className="w-3 h-3 ml-1" />
                )}
              </Button>
              
              {isStackTraceExpanded && (
                <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border font-mono whitespace-pre-wrap overflow-x-auto">
                  {entry.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogEntry;
