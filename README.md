# @kalki/console-debug-wrapper

A professional-grade debug console component inspired by React DevTools and Vue DevTools, designed for development environments.

## Installation

```bash
npm install @kalki/console-debug-wrapper
```

or with yarn:

```bash
yarn add @kalki/console-debug-wrapper
```

## Peer Dependencies

This library has `react`, `react-dom`, and `tailwindcss` as peer dependencies. You need to have them installed in your project.

```bash
npm install react react-dom tailwindcss
```

## Usage

Wrap your application with the `ConsoleDebugWrapper` component. It will only be active in development mode.

```tsx
import { ConsoleDebugWrapper } from '@kalki/console-debug-wrapper';

function App() {
  return (
    <ConsoleDebugWrapper>
      <YourAppContent />
    </ConsoleDebugWrapper>
  );
}
```

## Props

| Prop       | Type              | Description                   |
|------------|-------------------|-------------------------------|
| `children` | `React.ReactNode` | The content of your application. |

## Features

### 🎯 Core Functionality
- **Real-time Console Interception**: Captures all console.log, console.error, console.warn, console.info, and console.debug calls
- **Professional UI**: Clean, modern interface with DevTools-inspired design
- **Component-based Architecture**: Modular structure for easy maintenance and customization

### 🔍 Advanced Filtering & Search
- **Level-based Filtering**: Filter by log, error, warn, info, debug, or show all
- **Real-time Search**: Search through log content and metadata
- **Smart Counters**: Live count of logs by level with visual badges

### ⚡ Developer Experience
- **Keyboard Shortcuts**: 
  - `` ` `` - Toggle console
  - `Esc` - Close console
  - `Ctrl/Cmd + K` - Clear logs
  - `Ctrl/Cmd + Shift + C` - Copy all logs
  - `Ctrl/Cmd + Shift + E` - Export logs
- **Auto-scroll**: Automatically scroll to new logs
- **Configurable Settings**: Customize max logs, timestamps, stack traces
- **Export Functionality**: Export logs as JSON

### 🎨 Professional Styling
- **DevTools-inspired Design**: Clean, professional appearance
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Color-coded Logs**: Different colors for different log levels
- **Expandable Stack Traces**: Collapsible stack trace information

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual hierarchy
- **Focus Management**: Proper focus handling

## Component Structure

```
ConsoleDebugWrapper/
├── components/
│   ├── ConsoleDebugWrapper.tsx      # Main wrapper component
│   ├── DebugConsolePanel.tsx        # Main panel container
│   ├── DebugConsoleHeader.tsx       # Header with controls
│   ├── FilterBar.tsx                # Search and filter controls
│   ├── LogEntry.tsx                 # Individual log entry
│   ├── LogsContainer.tsx            # Scrollable logs container
│   ├── EnhancedFormatArgs.tsx       # Advanced argument formatting
│   ├── KeyboardShortcuts.tsx        # Keyboard shortcut handler
│   └── HelpPanel.tsx                # Help and shortcuts panel
├── types/
│   ├── console-entry.ts             # Console entry type definitions
│   └── console-config.ts            # Configuration type definitions
├── utils/
│   ├── consoleInterceptor.tsx       # Console interception logic
│   ├── getLogIcon.tsx               # Log level icons
│   └── getLogVariant.tsx            # Log level styling variants
└── README.md                        # This file
```

## Configuration

The debug console can be configured through the settings panel:

- **Max Logs**: Limit the number of stored logs (100, 200, 500, 1000, 2000)
- **Auto-scroll**: Automatically scroll to new logs
- **Show Timestamps**: Display timestamps for each log entry
- **Show Stack Traces**: Include stack trace information for errors

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `` ` `` | Toggle console |
| `Esc` | Close console |
| `Ctrl/Cmd + K` | Clear all logs |
| `Ctrl/Cmd + Shift + C` | Copy all logs |
| `Ctrl/Cmd + Shift + E` | Export logs |

## Development

The debug console only appears in development mode (`import.meta.env.DEV`). In production builds, it renders only the children components without any debug UI.

## Styling

The component uses Tailwind CSS classes and follows the design system patterns. It's fully customizable through CSS variables and Tailwind configuration.

## Performance

- **Efficient Rendering**: Uses React.memo and useCallback for optimal performance
- **Memory Management**: Automatically limits log storage to prevent memory leaks
- **Lazy Loading**: Components are loaded only when needed
- **Debounced Search**: Search input is debounced for better performance

## Browser Support

- Modern browsers with ES6+ support
- React 18+
- TypeScript 4.5+

## Contributing

When contributing to this component:

1. Follow the existing component structure
2. Add proper TypeScript types
3. Include accessibility features
4. Test keyboard navigation
5. Ensure responsive design
6. Add proper error boundaries

## License

MIT
