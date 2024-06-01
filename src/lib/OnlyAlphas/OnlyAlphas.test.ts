import { describe, expect, it } from 'vitest';
import { OnlyAlphas } from './OnlyAlphas.ts';

describe.concurrent('OnlyAlphas', async () => {
    describe.concurrent('given a lowercase alphanumeric input', async () => {
        it.each(['test', 'test123', '1test23', '12test3', '123test'])(
            'should return the input (%s) unaltered',
            (input) => {
                const expected = input;

                const onlyAlphas = new OnlyAlphas();
                const result = onlyAlphas.sanitise(input);

                expect(result).toEqual(expected);
            }
        );
    });

    describe.concurrent('given a uppercase alphanumeric input', async () => {
        it.each(['TEST', 'TEST123', '1TEST23', '12TEST3', '123TEST'])(
            'should return the input (%s) unaltered',
            (input) => {
                const expected = input;

                const onlyAlphas = new OnlyAlphas();
                const result = onlyAlphas.sanitise(input);

                expect(result).toEqual(expected);
            }
        );
    });
    describe.concurrent(
        'given a mixed upper/lowercase alphanumeric input',
        async () => {
            it.each([
                'Test',
                'tEst',
                'teSt',
                'tesT',
                'TEst123',
                'TEs123t',
                'TE123st',
                'T123Est',
                '123TEst',
                '12TEst3',
                '1TEst23',
            ])('should return the input (%s) unaltered', (input) => {
                const expected = input;

                const onlyAlphas = new OnlyAlphas();
                const result = onlyAlphas.sanitise(input);

                expect(result).toEqual(expected);
            });
        }
    );

    describe.concurrent(
        'given an input with a single non-alphanumeric character',
        async () => {
            it.each([
                ['ab@cd', 'abcd'],
                ['ab!cd', 'abcd'],
                ['ab<cd', 'abcd'],
                ['ab>cd', 'abcd'],
                ['ab?cd', 'abcd'],
            ])(
                'should return the input (%s) with the non-alpha character removed (%s)',
                (input, expected) => {
                    const onlyAlphas = new OnlyAlphas();
                    const result = onlyAlphas.sanitise(input);

                    expect(result).toEqual(expected);
                }
            );
            it.each([
                ['<abcd', 'abcd'],
                ['a<bcd', 'abcd'],
                ['ab<cd', 'abcd'],
                ['abc<d', 'abcd'],
                ['abcd<', 'abcd'],
            ])(
                'should remove non-alphas from anywhere in the input string (%s)',
                (input, expected) => {
                    const onlyAlphas = new OnlyAlphas();
                    const result = onlyAlphas.sanitise(input);

                    expect(result).toEqual(expected);
                }
            );

            it.each([
                ['<!a<b!c>d!>', 'abcd'],
                ['<<a<<b<!>c>>d>>', 'abcd'],
                ['<<<a<<<b<<<!>>>c>>>d>>>', 'abcd'],
            ])(
                'should remove multiple non-alphas from anywhere in the input string (%s)',
                (input, expected) => {
                    const onlyAlphas = new OnlyAlphas();
                    const result = onlyAlphas.sanitise(input);

                    expect(result).toEqual(expected);
                }
            );
        }
    );
    describe.concurrent(
        'given non alphanumeric characters with extended matchers',
        async () => {
            it.each([
                ['ab-cd123', 'ab-cd123'],
                ['ab_cd123', 'ab_cd123'],
                ['abcd!123', 'abcd!123'],
                ['abcd123', 'abcd123'],
                ['abcd123', 'abcd123'],
            ])(
                'should return the input (%s) if the non-alphanumeric is in the additional matcher',
                (input, expected) => {
                    const onlyAlphas = OnlyAlphas.and(/[-_!]/);
                    const result = onlyAlphas.sanitise(input);

                    expect(result).toEqual(expected);
                }
            );

            it.each([
                ['ab^cd123', 'abcd123'],
                ['ab$cd123', 'abcd123'],
                ['abcd#123', 'abcd123'],
                ['a@bcd123', 'abcd123'],
                ['~abcd123', 'abcd123'],
            ])(
                'should return the input (%s) without illegal characters if the non-alphanumeric is not in the additional matcher',
                (input, expected) => {
                    const onlyAlphas = OnlyAlphas.and(/[-_!]/);
                    const result = onlyAlphas.sanitise(input);

                    expect(result).toEqual(expected);
                }
            );
        }
    );
});
