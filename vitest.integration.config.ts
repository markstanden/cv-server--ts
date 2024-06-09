import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [],
    test: {
        include: ['{netlify,src}/**/*.integration.{test,spec}.?(c|m)[jt]s?(x)'],
        globals: false,
        setupFiles: [],
        environmentMatchGlobs: [
            ['**/*.test.ts', 'happy-dom'],
            ['**/*.component-test.ts', 'happy-dom'],
        ],
    },
});
