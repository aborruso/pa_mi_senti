import type { RouteState } from '../types/pa';

const cleanPath = (path: string): string => path.replace(/\/{2,}/g, '/').replace(/\/$/, '');

export const parsePath = (path: string): RouteState => {
  const normalized = cleanPath(path || '/');
  if (!normalized || normalized === '/') {
    return { name: 'home' };
  }
  const segments = normalized.split('/').filter(Boolean);
  const cityIndex = segments.indexOf('citta');
  if (cityIndex === -1) {
    return { name: 'home' };
  }
  const routeSegments = segments.slice(cityIndex);
  if (routeSegments.length === 2) {
    return { name: 'city', istat: routeSegments[1] };
  }
  if (routeSegments.length >= 5 && routeSegments[3] === 'messaggi') {
    return {
      name: 'templates',
      istat: routeSegments[1],
      contextSlug: routeSegments[2],
      channelKey: routeSegments[4]
    };
  }
  if (routeSegments.length >= 3) {
    return { name: 'context', istat: routeSegments[1], contextSlug: routeSegments[2] };
  }
  return { name: 'home' };
};

export const buildCityPath = (istat: string): string => `/citta/${istat}`;

export const buildContextPath = (istat: string, contextSlug: string): string =>
  `/citta/${istat}/${contextSlug}`;

export const buildTemplatePath = (
  istat: string,
  contextSlug: string,
  channelKey: string
): string => `/citta/${istat}/${contextSlug}/messaggi/${channelKey}`;
