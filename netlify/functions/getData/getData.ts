import type { Config, Context } from '@netlify/functions';
import { ReadOnlyDataStore } from '../../../src/types/DataStore/ReadOnlyDataStore';
import { constants } from 'node:http2';
import { Sanitiser } from '../../../src/types/Sanatiser/Sanitiser';

export default async function getData(
    _: Request,
    { params }: Context,
    dataStore: ReadOnlyDataStore<object>,
    sanitiser: Sanitiser = { sanitise: (x) => x }
): Promise<Response> {
    const sanitisedId = sanitiser.sanitise(params.id);
    const data = await dataStore?.getByID(sanitisedId);
    if (!data) {
        return new Response(JSON.stringify({}), {
            status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(JSON.stringify(data));
}

export const config: Config = {
    path: '/:id',
};
