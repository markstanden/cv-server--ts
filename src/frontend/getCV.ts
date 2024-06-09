export const API_BASE_PATH = '/api/v1';

/**
 * Factory method to create a
 * @param basePath
 * @param fetcher
 */
export async function getCVFactory<TYPE>(
    fetcher: (path: string) => Promise<Response> = fetch,
    basePath?: string
): Promise<(path?: string) => Promise<TYPE>> {
    return async function getCV(path?: string): Promise<TYPE> {
        const response = await fetcher(`${basePath}/${path}`);
        return (await response.json()) as TYPE;
    };
}

export const getCV = await getCVFactory(fetch, API_BASE_PATH);
