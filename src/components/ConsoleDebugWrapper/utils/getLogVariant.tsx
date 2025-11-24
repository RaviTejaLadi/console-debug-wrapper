export const getLogVariant = (level: string) => {
  switch (level) {
    case 'error':
      return 'destructive';
    case 'warn':
      return 'default';
    case 'info':
      return 'default';
    case 'debug':
      return 'default';
    default:
      return 'default';
  }
};
