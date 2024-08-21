import type { Config, Context } from '@netlify/functions';
import { ReadOnlyDataStore } from '../../../src/types/DataStore/ReadOnlyDataStore';
import { Sanitiser } from '../../../src/types/Sanatiser/Sanitiser';
import { GithubRepoDataStore } from '../../../src/GitHubRepoDataStore/GithubRepoDataStore';
import { constants } from 'node:http2';
import { OnlyAlphas } from '../../../src/lib/OnlyAlphas/OnlyAlphas';

export default async function getData<TYPE>(
    _: Request,
    { params }: Context,
    dataStore: ReadOnlyDataStore<TYPE> = GithubRepoDataStore.createFromEnvironment<TYPE>(),
    sanitiser: Sanitiser = OnlyAlphas.strict()
): Promise<Response> {
    const sanitisedId = sanitiser.sanitise(params.id);
    if (sanitisedId !== params.id) {
        return new Response(JSON.stringify({}), {
            status: constants.HTTP_STATUS_BAD_REQUEST,
        });
    }

    const data = await dataStore?.getByID(sanitisedId);
    if (!data) {
        return new Response(JSON.stringify({}), {
            status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(JSON.stringify(data));
}

export const config: Config = {
    path: '/api/v1/:id',
};
