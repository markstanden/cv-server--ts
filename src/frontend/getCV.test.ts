import { describe, expect, it } from 'vitest';
import { getCVFactory } from './getCV.ts';

function fakeFetcher() {
    let calledWith: string | undefined;
    return {
        fetch: async (path?: string) => {
            calledWith = path;
            return Response.json({ path: path });
        },
        calledWith: () => calledWith,
    };
}

describe.concurrent('getCV', async () => {
    describe.each([
        ['', undefined],
        [undefined, ''],
        [undefined, undefined],
        ['', ''],
        ['/path', 'id'],
        ['/path', 'id-id'],
        ['/path', 'id_id'],
        ['/base-path', 'path'],
        ['/base_path', 'path'],
        ['/base-path', 'id-id'],
        ['/base-path', 'id_id'],
        ['/base_path', 'id-id'],
        ['/base_path', 'id_id'],
    ])("calls the fetcher with the path: %s/%s'", async (basePath, path) => {
        it.concurrent('fetcher called with correct path', async () => {
            const mockFetcher = fakeFetcher();

            const getCV = await getCVFactory<object>(
                mockFetcher.fetch,
                basePath
            );
            await getCV(path);

            expect(mockFetcher.calledWith()).equals(`${basePath}/${path}`);
        });

        it.concurrent(
            'should return return pojo with expected result',
            async ({ expect }) => {
                const getCV = await getCVFactory<{ path: string }>(
                    fakeFetcher().fetch,
                    basePath
                );
                const result = await getCV(path);

                expect(result).toMatchObject({ path: `${basePath}/${path}` });
            }
        );
    });
});
