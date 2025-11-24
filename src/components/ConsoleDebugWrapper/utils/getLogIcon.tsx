import { AlertCircle, AlertTriangle, Info, Terminal, Bug } from 'lucide-react';

export const getLogIcon = (level: string) => {
  switch (level) {
    case 'error':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    case 'warn':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    case 'debug':
      return <Terminal className="w-4 h-4 text-purple-500" />;
    default:
      return <Bug className="w-4 h-4 text-muted-foreground" />;
  }
};
