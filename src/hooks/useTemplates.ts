import { useCallback, useEffect, useState } from 'react';
import type { TemplateRegistry } from '../types/templates';
import { fetchTemplates } from '../services/templates';

interface TemplateState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  data: TemplateRegistry | null;
  error?: string;
}

export const useTemplates = (): [TemplateState, () => void] => {
  const [state, setState] = useState<TemplateState>({ status: 'idle', data: null });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      const registry = await fetchTemplates();
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
