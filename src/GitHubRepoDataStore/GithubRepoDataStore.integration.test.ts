import { describe, expect, it } from 'vitest';
import { GithubRepoDataStore } from './GithubRepoDataStore.ts';
import { configDotenv } from 'dotenv';
import { CV } from '../types/CV/CV.ts';

configDotenv({ path: './.env.local' });

function makeGithubDataStoreFromEnvironment<TYPE>() {
    return new GithubRepoDataStore<TYPE>({
        userName: process.env['GITHUB_USERNAME'] ?? '',
        repoName: process.env['GITHUB_REPO'] ?? '',
        basePath: process.env['GITHUB_REPO_DIRECTORY'] ?? '',
        filename: process.env['GITHUB_REPO_FILENAME'] ?? '',
        apiKey: process.env['GITHUB_API_KEY'] ?? '',
    });
}

function getTargetBranchFromEnvironment() {
    return process.env['GITHUB_TEST_BRANCH'] ?? '';
}

describe.concurrent('GithubRepoDataStore', async () => {
    describe.concurrent(
        'with a correct branch name fetches test data',
        async () => {
            it.concurrent('should fetch CV data', async ({ expect }) => {
                const githubDataStore =
                    makeGithubDataStoreFromEnvironment<CV>();
                const id = getTargetBranchFromEnvironment();

                const result = await githubDataStore.getByID(id);

                expect(result).toMatchObject({
                    coverLetter: {},
                    user: {},
                    experienceSection: {},
                    sections: {},
                });
            });
        }
    );

    describe.concurrent(
        'check required environment variables are available',
        async () => {
            it.each([
                'GITHUB_USERNAME',
                'GITHUB_REPO',
                'GITHUB_API_KEY',
                'GITHUB_REPO_DIRECTORY',
                'GITHUB_REPO_FILENAME',
                'GITHUB_TEST_BRANCH',
            ])(
                'environment variable %s should be available',
                async (envKey) => {
                    const result = import.meta.env[envKey];

                    expect(result).toBeTruthy();
                }
            );
        }
    );
});
