import type { ChannelType } from './pa';

export interface MessageTemplateItem {
  id: string;
  label: string;
  message: string;
  description?: string;
}

export interface MessageTemplateGroup {
  contextSlug: string;
  channelKey: string;
  channelType: ChannelType;
  templates: MessageTemplateItem[];
}

export interface TemplateRegistry {
  updatedAt: string;
  templates: MessageTemplateGroup[];
}
