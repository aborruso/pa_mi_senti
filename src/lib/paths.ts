const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

const withBase = (path: string): string => `${BASE}${path}`;

export const buildCityPath = (istat: string): string => withBase(`/citta/${istat}/`);

export const buildContextPath = (istat: string, contextSlug: string): string =>
  withBase(`/citta/${istat}/${contextSlug}/`);

export const buildTemplatePath = (
  istat: string,
  contextSlug: string,
  channelKey: string
): string => withBase(`/citta/${istat}/${contextSlug}/messaggi/${channelKey}/`);
