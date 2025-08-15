import { DatabaseProvider } from '../types';
import { BunSqliteProvider } from './bun';

export function getDatabaseProvider(): {
  provider: DatabaseProvider;
  error: null
} | {
  provider: null;
  error: string;
} {
  const providerEnv = process.env.DATABASE_PROVIDER || 'bun';
  let providerInstance: DatabaseProvider;

  switch (providerEnv) {
    case 'bun':
      providerInstance = new BunSqliteProvider();
      break;
    default:
      return {
        provider: null,
        error: `Unsupported database provider: ${providerEnv}. Supported providers: bun.`,
      };
  }

  return {
    provider: providerInstance,
    error: null,
  }
}
