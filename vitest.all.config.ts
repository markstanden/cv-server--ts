import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [],
    test: {
        include: ['{netlify,src}/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        exclude: [],
        globals: false,
        environmentMatchGlobs: [['**/*.component-test.ts', 'happy-dom']],
    },
});
