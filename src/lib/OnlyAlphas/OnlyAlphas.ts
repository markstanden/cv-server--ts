import { Sanitiser } from '../../types/Sanatiser/Sanitiser.ts';

export class OnlyAlphas implements Sanitiser {
    protected readonly MATCHER = /[a-zA-Z0-9]/;

    sanitise(input: string) {
        return input
            .split('')
            .filter((letter: string) => letter.match(this.MATCHER))
            .join('');
    }
}
