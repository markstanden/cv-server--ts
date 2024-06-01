import { describe, expect, it } from 'vitest';
import getData from './getData';
import { Context } from '@netlify/functions';
import { ReadOnlyDataStore } from '../../../src/types/DataStore/ReadOnlyDataStore';

describe.concurrent('getData lambda function:', async () => {
    describe.concurrent('supplied path tests:', async () => {
        it.each(['test', 'test-test', 'test_test'])(
            'single words paths without invalid characters (%s) should successfully return unaltered as the id',
            async (path) => {
                const expected = { id: path };

                const response = await getData(
                    makeFakeRequestObject(),
                    makeContextStub(path),
                    makeFakeDataStore()
                );
                const responseBody = await response.json();

                expect(responseBody).toMatchObject(expected);
            }
        );

        it.todo.each(['&test', 'test&test', 'test&'])(
            'single words paths with invalid characters (%s) anywhere in the path should return a "400 Bad Request" response',
            async (path) => {
                const notExpected = { id: path };

                const response = await getData(
                    makeFakeRequestObject(),
                    makeContextStub(path),
                    makeFakeDataStore()
                );
                const responseBody = await response.json();

                expect(response.status).toEqual(400);
                expect(responseBody).not.toMatchObject(notExpected);
            }
        );
    });

    describe.todo.concurrent('path sanitation tests:', async () => {});
    describe.todo.concurrent('error handling tests:', async () => {});
});

function makeFakeRequestObject() {
    const TEST_URL: URL = new URL('http://fake-url.test');
    return new Request(TEST_URL);
}

function makeContextStub(id: string): Context {
    const params: Record<string, string> = {
        id,
    };
    return { params } as Context;
}

function makeFakeDataStore(): ReadOnlyDataStore<{ id: string }> {
    return {
        getByID: (id: string) => new Promise((resolve) => resolve({ id })),
    };
}
