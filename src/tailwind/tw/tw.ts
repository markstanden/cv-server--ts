/**
 * Identity tag function for Tailwind class-name template literals.
 *
 * It returns the literal unchanged; the `tw` tag exists so Tailwind tooling
 * can find and reorder the class names.
 *
 * @param strings Literal segments of the template.
 * @param values Interpolated values.
 * @returns The assembled class string.
 */
export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
    String.raw({ raw: strings }, ...values);
