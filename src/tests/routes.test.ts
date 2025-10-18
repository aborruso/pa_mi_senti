import { describe, expect, it } from 'vitest';
import { parsePath } from '../lib/routes';

describe('parsePath', () => {
  it('returns home for root path', () => {
    expect(parsePath('/')).toEqual({ name: 'home' });
  });

  it('returns city route', () => {
    expect(parsePath('/citta/015146')).toEqual({ name: 'city', istat: '015146' });
  });

  it('returns context route', () => {
    expect(parsePath('/citta/015146/verde_pubblico')).toEqual({
      name: 'context',
      istat: '015146',
      contextSlug: 'verde_pubblico'
    });
  });

  it('returns template route', () => {
    expect(parsePath('/citta/015146/verde_pubblico/messaggi/milano-twitter')).toEqual({
      name: 'templates',
      istat: '015146',
      contextSlug: 'verde_pubblico',
      channelKey: 'milano-twitter'
    });
  });

  it('falls back to home for unknown prefix', () => {
    expect(parsePath('/about')).toEqual({ name: 'home' });
  });
});
