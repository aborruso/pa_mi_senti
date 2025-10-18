import yaml from "js-yaml";
import registrySource from "../data/pa.yml?raw";
import templatesSource from "../data/templates.yml?raw";
import type {
  ContactChannel,
  ContextEntry,
  MessageTemplateGroup,
  Municipality,
  Registry,
  TemplateRegistry
} from "./types";

const registry = yaml.load(registrySource) as Registry;
const templateRegistry = yaml.load(templatesSource) as TemplateRegistry;

export const getRegistry = (): Registry => registry;

export const getTemplateRegistry = (): TemplateRegistry => templateRegistry;

export const getMunicipalities = (): Municipality[] => registry.municipalities ?? [];

export const findMunicipality = (istat: string): Municipality | undefined =>
  getMunicipalities().find((municipality) => municipality.istat === istat);

export const findContext = (
  municipality: Municipality | undefined,
  contextSlug: string
): ContextEntry | undefined => municipality?.contexts.find((context) => context.slug === contextSlug);

export const findChannel = (
  context: ContextEntry | undefined,
  channelKey: string
): ContactChannel | undefined => context?.channels.find((channel) => channel.key === channelKey);

export const findTemplateGroup = (
  contextSlug: string,
  channelKey: string
): MessageTemplateGroup | undefined =>
  templateRegistry.templates.find(
    (group) => group.contextSlug === contextSlug && group.channelKey === channelKey
  );
