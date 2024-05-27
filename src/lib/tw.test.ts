import { describe, it } from 'vitest';
import { tw } from './tw.ts';

describe.concurrent('tw', async () => {
    describe.concurrent(
        'the tag function should return the passed template string unaltered',
        async () => {
            it.concurrent(
                'should not alter a single "class" template literal',
                async ({ expect }) => {
                    const expected = 'Test_Test_Test';

                    const result = tw`Test_Test_Test`;

                    expect(result).toEqual(expected);
                }
            );

            it.concurrent(
                'should not alter a multiple "class" template literal',
                async ({ expect }) => {
                    const expected = 'TestOne TestTwo TestThree';

                    const result = tw`TestOne TestTwo TestThree`;

                    expect(result).toEqual(expected);
                }
            );

            it.concurrent(
                'should not alter single inserted string values',
                async ({ expect }) => {
                    const stringOne = 'stringOne';
                    const expected = 'stringOne';

                    const result = tw`${stringOne}`;

                    expect(result).toEqual(expected);
                }
            );

            it.concurrent(
                'should not alter multiple inserted string values',
                async ({ expect }) => {
                    const stringOne = 'stringOne';
                    const stringTwo = 'stringTwo';
                    const stringThree = 'stringThree';
                    const expected = 'stringOnestringTwostringThree';

                    const result = tw`${stringOne}${stringTwo}${stringThree}`;

                    expect(result).toEqual(expected);
                }
            );

            it.concurrent(
                'should not alter mixed, single inserted string values',
                async ({ expect }) => {
                    const stringOne = 'stringOne';
                    const expected = 'TestOne stringOne TestTwo TestThree';

                    const result = tw`TestOne ${stringOne} TestTwo TestThree`;

                    expect(result).toEqual(expected);
                }
            );

            it.concurrent(
                'should not alter mixed multiple inserted string values',
                async ({ expect }) => {
                    const stringOne = 'stringOne';
                    const stringTwo = 'stringTwo';
                    const expected =
                        'TestOne stringOne TestTwo stringTwo TestThree';

                    const result = tw`TestOne ${stringOne} TestTwo ${stringTwo} TestThree`;

                    expect(result).toEqual(expected);
                }
            );
        }
    );
});
