import { defineConfig } from "vitest/config";

/** Vitest config for the GitHub-backed integration tests. */
export default defineConfig({
    plugins: [],
    test: {
        include: ["{netlify,src}/**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
        globals: false,
        setupFiles: [],
    },
});
