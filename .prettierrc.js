const config = {
    experimentalTernaries: true,
    arrowParens: 'always',
    bracketSpacing: true,
    bracketSameLine: true,
    parser: 'typescript',
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    singleAttributePerLine: true,
    quoteProps: 'consistent',
    plugins: ['prettier-plugin-tailwindcss'],
    tailwindFunctions: ['tw'],
    overrides: [
        {
            files: ['**/*.css'],
            options: {
                parser: 'css',
                singleQuote: false,
            },
        },
    ],
};

export default config;
