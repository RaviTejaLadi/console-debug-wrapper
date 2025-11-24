import React, { useState, useCallback } from 'react';
import  { type ConsoleEntry } from '../types/console-entry';
import { type ConsoleConfig } from '../types/console-config';
import DebugConsoleHeader from './DebugConsoleHeader';
import FilterBar from './FilterBar';
import LogsContainer from './LogsContainer';
import HelpPanel from './HelpPanel';

interface DebugConsolePanelProps {
  logs: ConsoleEntry[];
  config: ConsoleConfig;
  onConfigChange: (config: Partial<ConsoleConfig>) => void;
  onClearLogs: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DebugConsolePanel: React.FC<DebugConsolePanelProps> = ({
  logs,
  config,
  onConfigChange,
  onClearLogs,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showHelp, setShowHelp] = useState(false);

  // Calculate log counts for each level
  const logCounts = logs.reduce((counts, log) => {
    counts[log.level] = (counts[log.level] || 0) + 1;
    counts.all = (counts.all || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Filter logs based on current filter
  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const handleCopyLog = useCallback((entry: ConsoleEntry) => {
    const timestamp = config.showTimestamp ? `[${entry.timestamp.toLocaleTimeString()}] ` : '';
    const text = `${timestamp}${entry.level.toUpperCase()}: ${JSON.stringify(entry.args, null, 2)}`;
    navigator.clipboard.writeText(text);
  }, [config.showTimestamp]);

  const handleCopyAllLogs = useCallback(() => {
    const allLogsText = filteredLogs
      .map((entry) => {
        const timestamp = config.showTimestamp ? `[${entry.timestamp.toLocaleTimeString()}] ` : '';
        return `${timestamp}${entry.level.toUpperCase()}: ${JSON.stringify(entry.args, null, 2)}`;
      })
      .join('\n');
    navigator.clipboard.writeText(allLogsText);
  }, [filteredLogs, config.showTimestamp]);

  const handleExportLogs = useCallback(() => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `console-logs-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [filteredLogs]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilter('all');
  }, []);

  return (
    <>
      <div className="flex flex-col h-full bg-background border border-border rounded-lg shadow-lg">
        <DebugConsoleHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onClearLogs={onClearLogs}
          onCopyAllLogs={handleCopyAllLogs}
          onExportLogs={handleExportLogs}
          onSettingsChange={onConfigChange}
          onShowHelp={() => setShowHelp(true)}
          config={config}
          totalLogs={logs.length}
          filteredLogs={filteredLogs.length}
        />

      {!isCollapsed && (
        <>
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={filter}
            onFilterChange={setFilter}
            logCounts={logCounts}
            onClearFilters={handleClearFilters}
          />

          <div className="flex-1 min-h-0">
            <LogsContainer
              logs={logs}
              showTimestamp={config.showTimestamp}
              showStackTrace={config.showStackTrace}
              autoScroll={config.autoScroll}
              onCopyLog={handleCopyLog}
              searchTerm={searchTerm}
              filter={filter}
            />
          </div>
        </>
      )}
      </div>

      <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

export default DebugConsolePanel;
