/**
 * DI Factory method that returns a function to retrieve data of type <RESPONSE>
 * using the pre-applied fetcher and basePath.
 * @param {string?} basePath
 * @param {(path: string) => Promise<Response>} fetcher
 * @pure
 */
export async function getFromApiFactory<RESPONSE>(
    fetcher: (path: string) => Promise<Response> = fetch,
    basePath?: string
): Promise<(path?: string) => Promise<RESPONSE>> {
    return async function getFromApi(path?: string): Promise<RESPONSE> {
        const response = await fetcher(`${basePath}/${path}`);
        return (await response.json()) as RESPONSE;
    };
}
