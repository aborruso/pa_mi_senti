import { useCallback, useEffect, useState } from 'react';
import type { Registry } from '../types/pa';
import { fetchRegistry } from '../services/registry';

interface RegistryState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  data: Registry | null;
  error?: string;
}

export const useRegistry = (): [RegistryState, () => void] => {
  const [state, setState] = useState<RegistryState>({ status: 'idle', data: null });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      const registry = await fetchRegistry();
      setState({ status: 'ready', data: registry });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error.message : 'Errore inatteso'
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return [state, load];
};
