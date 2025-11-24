import { memo, type ReactNode } from 'react';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

interface EnhancedFormatArgsProps {
  args: any[];
  compact?: boolean;
}

const EnhancedFormatArgs: React.FC<EnhancedFormatArgsProps> = ({ args, compact = false }) => {
  const formatSingleArg = (arg: any, depth = 0): ReactNode => {
    const maxDepth = 3;
    const isMaxDepth = depth >= maxDepth;

    if (arg === null) {
      return <span className="text-purple-500 font-semibold">null</span>;
    }

    if (arg === undefined) {
      return <span className="text-purple-500 font-semibold">undefined</span>;
    }

    if (typeof arg === 'string') {
      return (
        <span className="text-green-600">
          "{arg.length > 100 && !compact ? `${arg.substring(0, 100)}...` : arg}"
        </span>
      );
    }

    if (typeof arg === 'number') {
      return <span className="text-blue-600 font-mono">{arg}</span>;
    }

    if (typeof arg === 'boolean') {
      return <span className="text-purple-500 font-semibold">{arg.toString()}</span>;
    }

    if (typeof arg === 'function') {
      return <span className="text-yellow-600 italic">[Function {arg.name || 'anonymous'}]</span>;
    }

    if (arg instanceof Date) {
      return <span className="text-cyan-600">Date({arg.toISOString()})</span>;
    }

    if (arg instanceof Error) {
      return (
        <div className="text-red-600">
          <div className="font-semibold">Error: {arg.message}</div>
          {arg.stack && (
            <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
              {arg.stack}
            </pre>
          )}
        </div>
      );
    }

    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        return <span className="text-muted-foreground">[]</span>;
      }

      if (isMaxDepth || compact) {
        return (
          <span className="text-muted-foreground">
            Array({arg.length}) {!compact && <span className="text-xs">[{arg.slice(0, 3).map((item, i) => formatSingleArg(item, depth + 1)).join(', ')}{arg.length > 3 ? '...' : ''}]</span>}
          </span>
        );
      }

      return (
        <div className="ml-2">
          <span className="text-muted-foreground">[</span>
          {arg.map((item, i) => (
            <div key={i} className="ml-2 flex items-start gap-1">
              <span className="text-muted-foreground text-xs">{i}:</span>
              <div className="flex-1">
                {formatSingleArg(item, depth + 1)}
              </div>
              {i < arg.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-muted-foreground">]</span>
        </div>
      );
    }

    if (typeof arg === 'object') {
      if (isMaxDepth) {
        return <span className="text-muted-foreground">[Object]</span>;
      }

      const keys = Object.keys(arg);
      if (keys.length === 0) {
        return <span className="text-muted-foreground">{}</span>;
      }

      if (compact) {
        return (
          <span className="text-muted-foreground">
            {`{${keys.slice(0, 2).join(', ')}${keys.length > 2 ? '...' : ''}}`}
          </span>
        );
      }

      try {
        const jsonString = JSON.stringify(arg, null, 2);
        const html = highlight(jsonString, languages.json, 'json');
        return (
          <pre 
            className="bg-muted/50 p-2 rounded text-xs border overflow-x-auto" 
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        );
      } catch (e) {
        return (
          <div className="ml-2">
            <span className="text-muted-foreground">{'{'}</span>
            {keys.slice(0, 5).map((key, i) => (
              <div key={key} className="ml-2 flex items-start gap-1">
                <span className="text-blue-500 font-semibold">"{key}":</span>
                <div className="flex-1">
                  {formatSingleArg(arg[key], depth + 1)}
                </div>
                {i < Math.min(keys.length, 5) - 1 && <span className="text-muted-foreground">,</span>}
              </div>
            ))}
            {keys.length > 5 && (
              <div className="ml-2 text-muted-foreground text-xs">
                ... and {keys.length - 5} more properties
              </div>
            )}
            <span className="text-muted-foreground">{'}'}</span>
          </div>
        );
      }
    }

    return <span className="text-muted-foreground">{String(arg)}</span>;
  };

  if (args.length === 0) {
    return <span className="text-muted-foreground italic">No arguments</span>;
  }

  return (
    <div className={`space-y-1 w-full ${compact ? 'text-xs' : 'text-sm'}`}>
      {args.map((arg, i) => (
        <div key={i} className="font-mono">
          {formatSingleArg(arg)}
        </div>
      ))}
    </div>
  );
};

export default memo(EnhancedFormatArgs);
