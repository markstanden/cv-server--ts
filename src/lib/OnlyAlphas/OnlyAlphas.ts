import { Sanitiser } from "../../types/Sanatiser/Sanitiser.ts";

/** Sanitiser that keeps alphanumerics plus any explicitly allowed extras. */
export class OnlyAlphas implements Sanitiser {
    /** Matcher for a single alphanumeric character. */
    static readonly MATCHER = /[a-zA-Z0-9]/;
    /** Matcher applied to each input character. */
    readonly matcher: RegExp;

    private constructor(and?: RegExp) {
        this.matcher = and
            ? new RegExp(`(${OnlyAlphas.MATCHER.source}|${and.source})`)
            : OnlyAlphas.MATCHER;
    }

    /**
     * Builds a sanitiser that also keeps characters matched by the supplied
     * expression.
     *
     * @param additionalMatchers Extra characters to preserve.
     * @returns A sanitiser configured with the combined matcher.
     */
    static and(additionalMatchers: RegExp) {
        return new OnlyAlphas(additionalMatchers);
    }

    /** Builds a sanitiser that keeps alphanumeric characters only. */
    static strict() {
        return new OnlyAlphas();
    }

    /**
     * Drops every character not matched by this sanitiser.
     *
     * @param input Raw value to clean.
     * @returns The cleaned value.
     */
    sanitise(input: string) {
        return input
            .split("")
            .filter((letter: string) => letter.match(this.matcher))
            .join("");
    }
}
