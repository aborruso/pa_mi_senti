import { useEffect, useMemo, useState } from 'react';
import type { RouteState } from '../types/pa';
import { parsePath } from '../lib/routes';

export const useRoute = (): [RouteState, (path: string) => void] => {
  const [route, setRoute] = useState<RouteState>(() => parsePath(window.location.pathname));

  const basePath = useMemo(() => {
    const rawBase = import.meta.env.BASE_URL;
    if (!rawBase || rawBase === '/' || rawBase === './') {
      return '';
    }
    return rawBase.replace(/\/$/, '');
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    const targetPath = `${basePath}${path}`.replace(/\/{2,}/g, '/') || '/';
    if (targetPath === window.location.pathname) {
      return;
    }
    window.history.pushState({}, '', targetPath);
    setRoute(parsePath(targetPath));
  };

  return [route, navigate];
};
