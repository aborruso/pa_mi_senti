export const extractTwitterHandle = (value: string): string | null => {
  const match = value.match(/twitter\.com\/([A-Za-z0-9_]+)/i);
  if (!match) {
    return null;
  }
  return `@${match[1]}`;
};

export const buildTwitterIntentUrl = (message: string): string =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
