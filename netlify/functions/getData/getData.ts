import type { Context } from '@netlify/functions';
import { ReadOnlyDataStore } from '../../../src/types/DataStore/ReadOnlyDataStore.ts';
import { Sanitiser } from '../../../src/types/Sanatiser/Sanitiser.ts';
import { GithubRepoDataStore } from '../../../src/node/GitHubRepoDataStore/GithubRepoDataStore.ts';
import { constants } from 'node:http2';
import { OnlyAlphas } from '../../../src/lib/OnlyAlphas/OnlyAlphas.ts';

export default async function getData<T>(
    request: Request,
    { params }: Context,
    dataStore: ReadOnlyDataStore<T> = GithubRepoDataStore.createFromEnvironment<T>(),
    sanitiser: Sanitiser = OnlyAlphas.strict()
): Promise<Response> {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    // If we get here with no ID is provided, return a 400 error
    if (!id) {
        return new Response(JSON.stringify({ error: 'No ID provided' }), {
            status: constants.HTTP_STATUS_BAD_REQUEST,
        });
    }
    
    // If the ID is not a valid format, return a 400 error
    const sanitisedId = sanitiser.sanitise(id);
    if (sanitisedId !== id) {
        return new Response(JSON.stringify({ error: 'Invalid ID format' }), {
            status: constants.HTTP_STATUS_BAD_REQUEST,
        });
    }

    // If the data is not found (possibly a bad ID), return a 404 error
    const data = await dataStore?.getByID(sanitisedId);
    if (!data) {
        return new Response(JSON.stringify({ error: 'Data not found' }), {
            status: constants.HTTP_STATUS_NOT_FOUND,
        });
    }

    return new Response(JSON.stringify(data));
}