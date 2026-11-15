import { defineConfig } from "vite";

/** Vite build configuration for the CV page and its Netlify function. */
export default defineConfig({
    css: {
        postcss: "./postcss.config.js",
    },
    build: {
        target: "esnext",
    },
});
