import { getFromApiFactory } from "../../lib/getFromApi/getFromApi.ts";
import type { CV } from "../../types/CV/CV.ts";
import { API_BASE_PATH } from "../../constants.ts";

/**
 * Retrieves the CV for the supplied identifier from the site's own API.
 *
 * @param id Page key selecting the CV branch; omitted when the API exposes a
 * single default record.
 * @returns The parsed CV payload.
 */
export async function getCvFromApi(id?: string): Promise<CV> {
    const getCv = await getFromApiFactory<CV>(fetch, API_BASE_PATH);
    return getCv(id);
}
