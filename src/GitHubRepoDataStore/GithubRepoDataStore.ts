import { ReadOnlyDataStore } from '../types/DataStore/ReadOnlyDataStore.ts';

export class GithubRepoDataStore<TYPE> implements ReadOnlyDataStore<TYPE> {
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
        /** The username of the owner of the GitHub repository */
        userName = process.env.GITHUB_USERNAME ?? '',

        /** The name of the private repository the file is stored in */
        repoName = process.env.GITHUB_REPO ?? '',

        /** The name of the directory the content is held in
         * Can be empty if the file is in the root of the repo. */
        basePath = process.env.GITHUB_REPO_DIRECTORY ?? '',

        /** The filename to be retrieved from the repo */
        filename = process.env.GITHUB_REPO_FILENAME ?? '',

        /** Get the scoped GitHub API key from the environment variables.
         * API key should be scoped to read only on the private content repository */
        apiKey = process.env.GITHUB_API_KEY ?? '',
    }: {
        userName: string;
        repoName: string;
        basePath: string;
        filename: string;
        apiKey: string;
    }) {
        if (!userName || !repoName || !filename) {
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

    getBasePath(basePath: string): string {
        return basePath ? `${basePath}/` : '';
    }

    public async getByID(id: string): Promise<TYPE | undefined> {
        const content = await this.getContent(id);
        if (!content) {
            return;
        }
        return JSON.parse(content) as TYPE;
    }

    protected getRequestURL(id: string): string {
        return this.instanceTemplate.replace('%BRANCH%', id);
    }

    protected async getContent(id: string): Promise<string | undefined> {
        const response = await fetch(this.getRequestURL(id), {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': this.GITHUB_JSON_MEDIA_TYPE,
                'X-GitHub-Api-Version': this.GITHUB_API_VERSION,
            },
        });
        const responseJSON = await response.json();
        const content = atob(responseJSON.content);

        if (!responseJSON.content) {
            return undefined;
        }
        return content;
    }
}
