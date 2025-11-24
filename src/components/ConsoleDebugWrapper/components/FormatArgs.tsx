import { memo, type ReactNode } from 'react';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

const FormatArgs = ({ args }: { args: any[] }) => {
  const formatSingleArg = (arg: any): ReactNode => {
    if (arg === null) {
      return <span className="text-purple-500">null</span>;
    }

    if (arg === undefined) {
      return <span className="text-purple-500">undefined</span>;
    }

    if (typeof arg === 'string') {
      return <span className="text-green-500">"{arg}"</span>;
    }

    if (typeof arg === 'number') {
      return <span className="text-blue-500">{arg}</span>;
    }

    if (typeof arg === 'boolean') {
      return <span className="text-purple-500">{arg.toString()}</span>;
    }

    if (Array.isArray(arg)) {
      return (
        <div className="ml-4">
          [
          {arg.map((item, i) => (
            <div key={i} className="ml-4">
              {formatSingleArg(item)}
              {i < arg.length - 1 ? ',' : ''}
            </div>
          ))}
          ]
        </div>
      );
    }

    if (typeof arg === 'object') {
      try {
        const jsonString = JSON.stringify(arg, null, 2);
        const html = highlight(jsonString, languages.json, 'json');
        return <pre className="bg-muted p-2 rounded text-xs" dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        console.log(e);
        return <span className="text-red-500">[Non-serializable object]</span>;
      }
    }

    return <span>{String(arg)}</span>;
  };

  return (
    <div className="space-y-1 w-full ">
      {args.map((arg, i) => (
        <div key={i} className="font-mono text-sm">
          {formatSingleArg(arg)}
        </div>
      ))}
    </div>
  );
};

export default memo(FormatArgs);
