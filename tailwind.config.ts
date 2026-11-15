import type { Config } from "tailwindcss";

const config: Config = {
    content: ["index.html", "src/**/*.{js,ts,jsx,tsx}"],
    plugins: [],
    theme: {
        fontFamily: {
            main: ["var(--font-family-main)", "ui-sans-serif"],
        },
    },
};
/** Tailwind build configuration for the CV page. */
export default config;
