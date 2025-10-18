import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import type { Registry } from '../src/types/pa';

const registryPath = path.resolve(process.cwd(), 'public/data/pa.yml');

const requiredContextChannels = 1;

try {
  const file = fs.readFileSync(registryPath, 'utf8');
  const parsed = yaml.load(file) as Registry;
  if (!parsed?.municipalities?.length) {
    console.error('❌ Nessuna municipalità definita.');
    process.exitCode = 1;
  } else {
    parsed.municipalities.forEach((municipality) => {
      if (!municipality.contexts?.length) {
        console.warn(`⚠️  ${municipality.name} non ha contesti configurati.`);
      }
      municipality.contexts?.forEach((context) => {
        if ((context.channels?.length ?? 0) < requiredContextChannels) {
          console.warn(
            `⚠️  Contesto "${context.slug}" per ${municipality.name} ha meno di ${requiredContextChannels} canali.`
          );
        }
        context.channels?.forEach((channel) => {
          if (channel.platform === 'twitter' && !channel.key) {
            console.warn(
              `⚠️  Il canale Twitter "${context.slug}" per ${municipality.name} non ha la proprietà "key".`
            );
          }
        });
      });
    });
    console.log(`✅ Registro valido: ${parsed.municipalities.length} municipalità caricate.`);
  }
} catch (error) {
  console.error('❌ Errore durante la validazione:', error);
  process.exitCode = 1;
}
