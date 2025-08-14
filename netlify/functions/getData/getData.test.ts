import { describe, expect, it } from 'vitest';
import getData from './getData';
import { Context } from '@netlify/functions';
import { ReadOnlyDataStore } from '../../../src/types/DataStore/ReadOnlyDataStore.ts';
import { OnlyAlphas } from '../../../src/lib/OnlyAlphas/OnlyAlphas.ts';

describe.concurrent('getData lambda function:', async () => {
    describe.concurrent('URL path tests:', async () => {
        it.each(['test', 'test-test', 'test_test'])(
            'valid IDs in URL path (%s) should successfully return data',
            async (id) => {
                const expected = { id };

                const response = await getData(
                    makeFakeRequestObject(`/api/v1/${id}`),
                    makeContextStub(),
                    makeFakeDataStore(),
                    OnlyAlphas.and(/[-_]/)
                );
                const responseBody = await response.json();

                expect(responseBody).toMatchObject(expected);
            }
        );

        it.each(['&test', 'test&test', 'test&'])(
            'invalid characters in ID (%s) should return a "400 Bad Request" response',
            async (id) => {
                const response = await getData(
                    makeFakeRequestObject(`/api/v1/${id}`),
                    makeContextStub(),
                    makeFakeDataStore()
                );
                const responseBody = await response.json();

                expect(response.status).toEqual(400);
                expect(responseBody).toMatchObject({ error: 'Invalid ID format' });
            }
        );

        it('should return 400 when no ID is provided in URL', async () => {
            const response = await getData(
                makeFakeRequestObject('/api/v1/'),
                makeContextStub(),
                makeFakeDataStore()
            );
            const responseBody = await response.json();

            expect(response.status).toEqual(400);
            expect(responseBody).toMatchObject({ error: 'No ID provided' });
        });

        it('should return 404 when data is not found', async () => {
            const response = await getData(
                makeFakeRequestObject('/api/v1/nonexistent'),
                makeContextStub(),
                makeEmptyDataStore()
            );
            const responseBody = await response.json();

            expect(response.status).toEqual(404);
            expect(responseBody).toMatchObject({ error: 'Data not found' });
        });
    });
});

function makeFakeRequestObject(path: string = '/api/v1/test') {
    const TEST_URL: URL = new URL(`http://fake-url.test${path}`);
    return new Request(TEST_URL);
}

function makeContextStub(): Context {
    return { params: {} } as Context;
}

function makeFakeDataStore(): ReadOnlyDataStore<{ id: string }> {
    return {
        getByID: (id: string) => new Promise((resolve) => resolve({ id })),
    };
}

function makeEmptyDataStore(): ReadOnlyDataStore<{ id: string }> {
    return {
        getByID: (_id: string) => new Promise((resolve) => resolve(undefined)),
    };
}
