/** PostCSS pipeline that compiles Tailwind and adds vendor prefixes. */
export default {
    plugins: {
        "@tailwindcss/postcss": {},
        autoprefixer: {},
    },
};
