import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx}'],
    plugins: [],
    theme: {
        fontFamily: {
            main: ['"Inter"', 'ui-sans-serif'],
        },
    },
};
export default config;
