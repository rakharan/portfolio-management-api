import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@application': resolve(__dirname, 'src/application'),
      '@helpers': resolve(__dirname, 'src/helpers'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@infrastructure': resolve(__dirname, 'src/infrastructure'),
      '@cronJobs': resolve(__dirname, 'src/cronJobs'),
      '@middleware': resolve(__dirname, 'src/middleware'),
    },
  },
});
