import { CV } from '../types/CV/CV.ts';

export const API_BASE_PATH = '/api/v1';

export async function getCVFactory(
    basePath: string = API_BASE_PATH,
    fetcher = fetch
) {
    return async function getCV(path: string): Promise<CV> {
        const res = await fetcher(`${basePath}/${path}`);
        return (await res.json()) as CV;
    };
}

export const getCV = await getCVFactory(API_BASE_PATH, fetch);
