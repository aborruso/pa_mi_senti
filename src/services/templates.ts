import yaml from 'js-yaml';
import type { MessageTemplateGroup, TemplateRegistry } from '../types/templates';

const TEMPLATE_PATH = `${import.meta.env.BASE_URL}data/templates.yml`;

const isTemplateGroup = (value: unknown): value is MessageTemplateGroup => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const group = value as MessageTemplateGroup;
  return (
    typeof group.contextSlug === 'string' &&
    typeof group.channelKey === 'string' &&
    Array.isArray(group.templates)
  );
};

export const fetchTemplates = async (): Promise<TemplateRegistry> => {
  const response = await fetch(TEMPLATE_PATH);
  if (!response.ok) {
    throw new Error(`Impossibile caricare i modelli (status ${response.status})`);
  }
  const text = await response.text();
  const raw = yaml.load(text) as Record<string, unknown>;
  const templates = Array.isArray(raw?.templates)
    ? (raw.templates as MessageTemplateGroup[]).filter(isTemplateGroup)
    : [];

  return {
    updatedAt: typeof raw?.updatedAt === 'string' ? (raw.updatedAt as string) : '',
    templates
  };
};
