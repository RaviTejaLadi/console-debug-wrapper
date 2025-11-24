export interface ConsoleEntry {
  id: string;
  timestamp: Date;
  level: 'log' | 'error' | 'warn' | 'info' | 'debug';
  method?: string;
  args: any[];
  stack?: string;
}
