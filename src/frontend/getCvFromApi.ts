import { getFromApiFactory } from '../lib/getFromApi/getFromApi.ts';
import { CV } from '../types/CV/CV.ts';

export const API_BASE_PATH: string = '/api/v1';

/**
 * Returns a preconfigured function to retrieve CV data from the API
 * @type {(id?: string) => Promise<CV>}
 */
export const getCvFromApi: (id?: string) => Promise<CV> =
    await getFromApiFactory<CV>(fetch, API_BASE_PATH);
