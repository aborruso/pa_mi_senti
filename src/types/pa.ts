export type ChannelType = 'email' | 'phone' | 'form' | 'social';

export interface ContactChannel {
  type: ChannelType;
  key?: string;
  label: string;
  value: string;
  notes?: string;
  platform?: 'twitter' | 'facebook' | 'instagram';
}

export interface ContextEntry {
  slug: string;
  name: string;
  description: string;
  channels: ContactChannel[];
  responseTime?: string;
}

export interface Municipality {
  istat: string;
  name: string;
  region: string;
  population?: number;
  contexts: ContextEntry[];
  helpfulLinks?: Array<{ label: string; url: string }>;
}

export interface Registry {
  updatedAt: string;
  municipalities: Municipality[];
}

export type RouteState =
  | { name: 'home' }
  | { name: 'city'; istat: string }
  | { name: 'context'; istat: string; contextSlug: string }
  | { name: 'templates'; istat: string; contextSlug: string; channelKey: string };
