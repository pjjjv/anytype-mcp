import { defineConfig } from '@openapi-codegen/cli';

export default defineConfig({
  anytypeApi: {
    from: {
      relativePath: './scripts/openapi.json',
    },
    output: {
      schemas: './src/models/schema.ts',
    },
  },
});
