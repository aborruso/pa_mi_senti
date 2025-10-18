export const buildCityPath = (istat: string): string => `/citta/${istat}/`;

export const buildContextPath = (istat: string, contextSlug: string): string =>
  `/citta/${istat}/${contextSlug}/`;

export const buildTemplatePath = (
  istat: string,
  contextSlug: string,
  channelKey: string
): string => `/citta/${istat}/${contextSlug}/messaggi/${channelKey}/`;
