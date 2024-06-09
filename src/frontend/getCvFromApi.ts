import { getFromApiFactory } from '../lib/getFromApi/getFromApi.ts';
import { CV } from '../types/CV/CV.ts';
import { API_BASE_PATH } from '../constants.ts';

/**
 * Returns a preconfigured function to retrieve CV data from the API
 * @type {(id?: string) => Promise<CV>}
 */
export const getCvFromApi: (id?: string) => Promise<CV> =
    await getFromApiFactory<CV>(fetch, API_BASE_PATH);
