/**
 * Builds a fetcher bound to a base path.
 *
 * @param fetcher Transport used to request a path; defaults to the global
 * `fetch`.
 * @param basePath Prefix prepended to every requested path.
 * @returns A function that requests one path and parses its JSON response.
 */
export async function getFromApiFactory<RESPONSE>(
    fetcher: (path: string) => Promise<Response> = fetch,
    basePath?: string,
): Promise<(path?: string) => Promise<RESPONSE>> {
    return async function getFromApi(path?: string): Promise<RESPONSE> {
        const response = await fetcher(`${basePath}/${path}`);
        return (await response.json()) as RESPONSE;
    };
}
