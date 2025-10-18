import yaml from 'js-yaml';
import type { Municipality, Registry } from '../types/pa';

const REGISTRY_PATH = `${import.meta.env.BASE_URL}data/pa.yml`;

const isMunicipality = (value: unknown): value is Municipality => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Municipality;
  return (
    typeof candidate.istat === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.contexts)
  );
};

export const fetchRegistry = async (): Promise<Registry> => {
  const response = await fetch(REGISTRY_PATH);
  if (!response.ok) {
    throw new Error(`Impossibile caricare il registro (status ${response.status})`);
  }
  const text = await response.text();
  const raw = yaml.load(text) as Record<string, unknown>;
  const municipalities = Array.isArray(raw?.municipalities)
    ? (raw.municipalities as Municipality[]).filter(isMunicipality)
    : [];

  return {
    updatedAt: typeof raw?.updatedAt === 'string' ? (raw.updatedAt as string) : '',
    municipalities
  };
};
