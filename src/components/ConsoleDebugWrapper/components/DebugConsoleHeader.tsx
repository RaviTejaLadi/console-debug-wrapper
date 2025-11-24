import React from 'react';
import { Bug, Settings, Download, Trash2, Copy, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ConsoleConfig } from '../types/console-config';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface DebugConsoleHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClearLogs: () => void;
  onCopyAllLogs: () => void;
  onExportLogs: () => void;
  onSettingsChange: (config: Partial<ConsoleConfig>) => void;
  onShowHelp: () => void;
  config: ConsoleConfig;
  totalLogs: number;
  filteredLogs: number;
}

const DebugConsoleHeader: React.FC<DebugConsoleHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onClearLogs,
  onCopyAllLogs,
  onExportLogs,
  onSettingsChange,
  onShowHelp,
  config,
  totalLogs,
  filteredLogs,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Console</span>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {filteredLogs}
          </Badge>
        </div>
        
        {totalLogs > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Total: {totalLogs}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopyAllLogs}
          className="h-7 px-2 text-xs"
          disabled={filteredLogs === 0}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExportLogs}
          className="h-7 px-2 text-xs"
          disabled={filteredLogs === 0}
        >
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearLogs}
          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
          disabled={totalLogs === 0}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onShowHelp}
          className="h-7 px-2"
          title="Show keyboard shortcuts"
        >
          <HelpCircle className="w-3 h-3" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Settings className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-background border-border" side="left" align="start">
            <div className="space-y-3 ">
              <h4 className="font-medium text-sm">Console Settings</h4>
              <SettingsPanel config={config} onConfigChange={onSettingsChange} />
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-7 px-2"
        >
          {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );
};



const SettingsPanel: React.FC<{
  config: ConsoleConfig;
  onConfigChange: (config: Partial<ConsoleConfig>) => void;
}> = ({ config, onConfigChange }) => {
  return (
    <Card className="p-4 border-none">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-scroll" className="text-sm font-normal">
            Auto-scroll
          </Label>
          <Switch
            id="auto-scroll"
            checked={config.autoScroll}
            onCheckedChange={(checked) => onConfigChange({ autoScroll: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-timestamps" className="text-sm font-normal">
            Show timestamps
          </Label>
          <Switch
            id="show-timestamps"
            checked={config.showTimestamp}
            onCheckedChange={(checked) => onConfigChange({ showTimestamp: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-stack-traces" className="text-sm font-normal">
            Show stack traces
          </Label>
          <Switch
            id="show-stack-traces"
            checked={config.showStackTrace}
            onCheckedChange={(checked) => onConfigChange({ showStackTrace: checked })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-logs" className="text-sm font-normal">
            Max logs
          </Label>
          <Select
            value={config.maxLogs.toString()}
            onValueChange={(value) => onConfigChange({ maxLogs: parseInt(value) })}
          >
            <SelectTrigger id="max-logs" className="w-full">
              <SelectValue placeholder="Select max logs" />
            </SelectTrigger>
            <SelectContent className='bg-background border-border'>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
              <SelectItem value="2000">2000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugConsoleHeader;
