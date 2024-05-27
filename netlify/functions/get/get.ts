import type { Config, Context } from '@netlify/functions';


export default async function(
    _incomingRequestObject: Request,
    netlifyContextObject: Context
): Promise<Response> {
    const params  = netlifyContextObject.params;

    const data = {...params}
    return new Response(JSON.stringify(data));
};


export const config: Config = {
    path: '/api/:stub',
};