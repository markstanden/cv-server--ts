/**
 * Identity Tag-function to apply to template literals to signal to
 * tailwind-prettier to reorganise the classnames into tailwind's recommended order.
 * @param {TemplateStringsArray} strings
 * @param {string[]} values
 */
export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
    String.raw({ raw: strings }, ...values);
