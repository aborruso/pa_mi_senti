export type ChannelType = "email" | "phone" | "form" | "social";

export interface ContactChannel {
  type: ChannelType;
  label: string;
  value: string;
  notes?: string;
  key?: string;
  platform?: "twitter" | "facebook" | "instagram";
}

export interface ContextEntry {
  slug: string;
  name: string;
  description: string;
  emoji?: string;
  color?: string;
  channels: ContactChannel[];
  helpfulLinks?: Array<{ label: string; url: string }>;
}

export interface Municipality {
  istat: string;
  name: string;
  region: string;
  population?: number;
  contexts: ContextEntry[];
}

export interface Registry {
  updatedAt: string;
  municipalities: Municipality[];
}

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
