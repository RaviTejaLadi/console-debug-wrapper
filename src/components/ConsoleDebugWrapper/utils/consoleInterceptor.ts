/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ConsoleEntry } from '../types/console-entry';

type Listener = (entry: ConsoleEntry) => void;

class ConsoleInterceptor {
  private listeners = new Set<Listener>();
  private initialized = false;
  private original: Partial<Record<string, any>> = {};
  private buffer: ConsoleEntry[] = [];
  private bufferLimit = 5000;
  private wrappers: Partial<Record<string, any>> = {};
  private integrityTimer: number | undefined;

  subscribe(listener: Listener): () => void {
    this.ensureInitialized();
    this.listeners.add(listener);
    // Replay buffered entries to new subscriber
    try {
      this.buffer.forEach((e) => listener(e));
    } catch {}
    return () => {
      this.listeners.delete(listener);
    };
  }

  ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;

    const methodsToCapture = [
      'log',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'table',
      'group',
      'groupCollapsed',
      'groupEnd',
      'dir',
      'dirxml',
      'assert',
    ] as const;

    const wrap = (method: (typeof methodsToCapture)[number]) => {
      this.original[method] = (console as any)[method];
      const wrapper = (...args: any[]) => {
        try {
          // For assert, only log when the first arg is falsy
          if (method === 'assert') {
            const condition = args[0];
            if (condition) {
              return (this.original[method] as any)?.apply(console, args);
            }
          }
          const entry: ConsoleEntry = {
            id: this.generateId(),
            timestamp: new Date(),
            level: (method === 'error' ? 'error' : method === 'warn' ? 'warn' : method === 'info' ? 'info' : method === 'debug' ? 'debug' : 'log') as ConsoleEntry['level'],
            method,
            args,
            stack: method === 'error' ? new Error().stack : undefined,
          };
          this.emit(entry);
        } catch {}
        // Always call original
        (this.original[method] as any)?.apply(console, args);
      };
      this.wrappers[method] = wrapper;
      (console as any)[method] = wrapper;
    };

    methodsToCapture.forEach((method) => wrap(method));

    // Forward time/timeEnd without logging entries (just preserve behavior)
    ['time', 'timeEnd', 'timeLog'].forEach((method) => {
      this.original[method] = (console as any)[method];
      (console as any)[method] = (...args: any[]) => (this.original[method] as any)?.apply(console, args);
    });

    // Global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        const entry: ConsoleEntry = {
          id: this.generateId(),
          timestamp: new Date(),
          level: 'error',
          method: 'window.onerror',
          args: [event.message, event.filename, event.lineno, event.colno],
          stack: event?.error?.stack,
        };
        this.emit(entry);
      });

      window.addEventListener('unhandledrejection', (event) => {
        const reason = (event as PromiseRejectionEvent).reason;
        const entry: ConsoleEntry = {
          id: this.generateId(),
          timestamp: new Date(),
          level: 'error',
          method: 'unhandledrejection',
          args: [reason],
          stack: reason?.stack,
        };
        this.emit(entry);
      });
    }

    // Integrity watchdog: ensure our wrappers stay installed
    if (typeof window !== 'undefined') {
      this.integrityTimer = window.setInterval(() => {
        methodsToCapture.forEach((method) => {
          if ((console as any)[method] !== this.wrappers[method]) {
            try {
              wrap(method);
            } catch {}
          }
        });
      }, 1000);

      // Cleanup interval on page unload to avoid leaks and use the timer
      window.addEventListener('beforeunload', () => {
        if (this.integrityTimer !== undefined) {
          clearInterval(this.integrityTimer);
          this.integrityTimer = undefined;
        }
      });
    }
  }

  private emit(entry: ConsoleEntry) {
    // Buffer the entry for late subscribers
    this.buffer.push(entry);
    if (this.buffer.length > this.bufferLimit) {
      this.buffer = this.buffer.slice(-this.bufferLimit);
    }
    this.listeners.forEach((l) => {
      try {
        l(entry);
      } catch {}
    });
  }

  private idCounter = 0;
  private generateId(): string {
    try {
      const uuid = (globalThis as any)?.crypto?.randomUUID?.();
      if (uuid) return uuid;
    } catch {}
    const now = Date.now();
    this.idCounter = (this.idCounter + 1) % 1000000000;
    return `${now}-${this.idCounter}`;
  }
}

export const consoleInterceptor = new ConsoleInterceptor();
// Eagerly initialize in development to capture earliest logs
if (import.meta.env?.DEV) {
  consoleInterceptor.ensureInitialized();
}


