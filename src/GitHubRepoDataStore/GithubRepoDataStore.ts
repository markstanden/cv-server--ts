import { ReadOnlyDataStore } from '../types/DataStore/ReadOnlyDataStore.ts';

export class GithubRepoDataStore<DATA> implements ReadOnlyDataStore<DATA> {
    /** The custom media type supplied by responses from the GitHub API */
    readonly GITHUB_JSON_MEDIA_TYPE: string = 'application/vnd.github.v3+json';

    /** The required format for requests to the GitHub API */
    readonly GITHUB_API_TEMPLATE =
        'https://api.github.com/repos/%USERNAME%/%REPO%/contents/%FILEPATH%?ref=%BRANCH%';

    /** The expected version of the GitHub api */
    readonly GITHUB_API_VERSION: string = '2022-11-28';

    readonly apiKey: string;
    readonly instanceTemplate: string;

    constructor({
        userName,
        repoName,
        basePath,
        filename,
        apiKey,
    }: {
        userName: string;
        repoName: string;
        basePath: string;
        filename: string;
        apiKey: string;
    }) {
        if (!userName || !repoName || !filename || !apiKey) {
            throw Error('Invalid Arguments');
        }

        this.apiKey = apiKey;

        const filePath = `${this.getBasePath(basePath)}${filename}`;

        this.instanceTemplate = this.GITHUB_API_TEMPLATE.replace(
            '%USERNAME%',
            userName
        )
            .replace('%REPO%', repoName)
            .replace('%FILEPATH%', `${filePath}`);
    }

    static createFromEnvironment<TYPE>() {
        return new GithubRepoDataStore<TYPE>({
            /** The username of the owner of the GitHub repository */
            userName: process.env.GITHUB_USERNAME ?? '',

            /** The name of the private repository the file is stored in */
            repoName: process.env.GITHUB_REPO ?? '',

            /** The name of the directory the content is held in
             * Can be empty if the file is in the root of the repo. */
            basePath: process.env.GITHUB_REPO_DIRECTORY ?? '',

            /** The filename to be retrieved from the repo */
            filename: process.env.GITHUB_REPO_FILENAME ?? '',

            /** Get the scoped GitHub API key from the environment variables.
             * API key should be scoped to read only on the private content repository */
            apiKey: process.env.GITHUB_API_KEY ?? '',
        });
    }

    getBasePath(basePath: string): string {
        return basePath ? `${basePath}/` : '';
    }

    public async getByID(id: string): Promise<DATA | undefined> {
        const content = await this.getContent(id);
        if (!content) {
            return;
        }

        const removePlaceholders = this.replaceContentPlaceholders(content, id);

        return JSON.parse(removePlaceholders) as DATA;
    }

    protected replaceContentPlaceholders(content: string, id: string): string {
        return content.replace('%BRANCH_NAME%', id);
    }

    protected getRequestURL(branch: string): string {
        return this.instanceTemplate.replace('%BRANCH%', branch);
    }

    protected async getContent(branch: string): Promise<string | undefined> {
        const response = await fetch(this.getRequestURL(branch), {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': this.GITHUB_JSON_MEDIA_TYPE,
                'X-GitHub-Api-Version': this.GITHUB_API_VERSION,
            },
        });

        const responseJSON = await response.json();
        if (!responseJSON.content) {
            return undefined;
        }

        try {
            return atob(responseJSON.content);
        } catch (reason) {
            return undefined;
        }
    }
}
