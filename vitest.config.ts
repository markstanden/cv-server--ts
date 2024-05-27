import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [],
    test: {
        globals: false,
        setupFiles: [],
        environmentMatchGlobs: [
            ['**/*.test.tsx', 'happy-dom'],
            ['**/*.component.test.ts', 'happy-dom'],
        ],
    },
});
