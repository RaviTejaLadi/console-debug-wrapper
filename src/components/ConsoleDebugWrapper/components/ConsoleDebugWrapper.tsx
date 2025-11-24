import React, { useState, useEffect, useRef, memo } from "react";
import { Terminal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { consoleInterceptor } from "../utils/consoleInterceptor";
import DebugConsolePanel from "./DebugConsolePanel";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ConsoleEntry } from "../types/console-entry";
import type { ConsoleConfig } from "../types/console-config";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

const ConsoleDebugWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [config, setConfig] = useState<ConsoleConfig>({
    maxLogs: 1000,
    autoScroll: true,
    showTimestamp: true,
    showStackTrace: true,
    theme: "dark",
  });
  const showStackTraceRef = useRef<boolean>(true);
  const maxLogsRef = useRef<number>(1000);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Keep refs in sync with current config
  useEffect(() => {
    showStackTraceRef.current = config.showStackTrace;
    maxLogsRef.current = config.maxLogs;
  }, [config.showStackTrace, config.maxLogs]);

  // Subscribe to global console interceptor (once)
  useEffect(() => {
    if (!isDevelopment) return;

    const unsubscribe = consoleInterceptor.subscribe((entry) => {
      // Skip duplicates by id (handles buffer replay and re-subscribes)
      if (seenIdsRef.current.has(entry.id)) return;
      seenIdsRef.current.add(entry.id);
      const enhancedEntry: ConsoleEntry = {
        ...entry,
        stack:
          entry.level === "error" && showStackTraceRef.current
            ? entry.stack ?? new Error().stack
            : undefined,
      } as ConsoleEntry;

      setLogs((prev) => {
        const newLogs = [...prev, enhancedEntry];
        if (newLogs.length > maxLogsRef.current) {
          return newLogs.slice(-maxLogsRef.current);
        }
        return newLogs;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    seenIdsRef.current.clear();
  };

  // Handle config changes
  const handleConfigChange = (newConfig: Partial<ConsoleConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Handle copy all logs
  const handleCopyAllLogs = () => {
    const allLogsText = logs
      .map((entry) => {
        const timestamp = config.showTimestamp
          ? `[${entry.timestamp.toLocaleTimeString()}] `
          : "";
        return `${timestamp}${entry.level.toUpperCase()}: ${JSON.stringify(
          entry.args,
          null,
          2
        )}`;
      })
      .join("\n");
    navigator.clipboard.writeText(allLogsText);
  };

  // Handle export logs
  const handleExportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `console-logs-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // If not in development, don't render debug UI
  if (!isDevelopment) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onToggleConsole={() => setIsOpen(!isOpen)}
        onClearLogs={clearLogs}
        onCopyAllLogs={handleCopyAllLogs}
        onExportLogs={handleExportLogs}
        isConsoleOpen={isOpen}
      />

      {/* Main content */}
      {children}

      {/* Debug Console Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className="shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground group"
              size="lg"
              title="Open Console (Press ` to toggle)"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Console</span>
                {logs.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-2 py-1 bg-background text-foreground border-border animate-pulse"
                  >
                    {logs.length}
                  </Badge>
                )}
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[85vw] h-[85vh] max-w-6xl p-0 border-0 shadow-2xl"
            side="top"
            sideOffset={10}
            align="end"
          >
            <DebugConsolePanel
              logs={logs}
              config={config}
              onConfigChange={handleConfigChange}
              onClearLogs={clearLogs}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default memo(ConsoleDebugWrapper);
