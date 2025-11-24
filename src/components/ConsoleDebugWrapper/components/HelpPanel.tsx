import React from 'react';
import { HelpCircle, Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '`', description: 'Toggle console', category: 'General' },
    { key: 'Esc', description: 'Close console', category: 'General' },
    { key: 'Ctrl/Cmd + K', description: 'Clear all logs', category: 'Actions' },
    { key: 'Ctrl/Cmd + Shift + C', description: 'Copy all logs', category: 'Actions' },
    { key: 'Ctrl/Cmd + Shift + E', description: 'Export logs', category: 'Actions' },
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-background border border-border rounded-lg shadow-2xl w-96 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Keyboard Shortcuts</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="space-y-2">
                {shortcuts
                  .filter(shortcut => shortcut.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="w-3 h-3" />
            <span>Press any key to close this panel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPanel;
