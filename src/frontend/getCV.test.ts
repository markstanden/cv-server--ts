import { describe, it } from 'vitest';
import { getCVFactory } from './getCV.ts';

function fakeFetcher() {
    let calledWith: string;
    return {
        fetch: async (path: string) => {
            calledWith = path;
            return Response.json({ path: path });
        },
        calledWith: () => calledWith,
    };
}

describe.concurrent('getCV', async () => {
    describe.concurrent('calls the fetcher', async () => {
        it.concurrent(
            'should be called with the correct path',
            async ({ expect }) => {
                const basePath = '/test-path';
                const path = 'test';
                const mockFetcher = fakeFetcher();

                const getCV = await getCVFactory(basePath, mockFetcher.fetch);
                await getCV(path);

                expect(mockFetcher.calledWith()).equals(`${basePath}/${path}`);
            }
        );

        it.concurrent('should return return pojo', async ({ expect }) => {
            const basePath = '/test-path';
            const path = 'test';

            const getCV = await getCVFactory(basePath, fakeFetcher().fetch);
            const result = await getCV(path);

            expect(result).toMatchObject({ path: `${basePath}/${path}` });
        });
    });
});
