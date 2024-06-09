import { Sanitiser } from '../../types/Sanatiser/Sanitiser.ts';

export class OnlyAlphas implements Sanitiser {
    static readonly MATCHER = /[a-zA-Z0-9]/;
    readonly matcher: RegExp;

    private constructor(and?: RegExp) {
        this.matcher = and
            ? new RegExp(`(${OnlyAlphas.MATCHER.source}|${and.source})`)
            : OnlyAlphas.MATCHER;
    }

    static and(additionalMatchers: RegExp) {
        return new OnlyAlphas(additionalMatchers);
    }

    static strict() {
        return new OnlyAlphas();
    }

    sanitise(input: string) {
        return input
            .split('')
            .filter((letter: string) => letter.match(this.matcher))
            .join('');
    }
}
