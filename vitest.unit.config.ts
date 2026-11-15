import { defineConfig } from "vitest/config";

/** Vitest config for unit tests, excluding GitHub integration tests. */
export default defineConfig({
    plugins: [],
    test: {
        include: ["{netlify,src}/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        exclude: ["{netlify,src}/**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
        globals: false,
        environmentMatchGlobs: [["**/*.component-test.ts", "happy-dom"]],
    },
});
