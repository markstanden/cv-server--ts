import { ReadOnlyDataStore } from "../../types/DataStore/ReadOnlyDataStore.ts";

/** Data store backed by a file in a private GitHub repository. */
export class GithubRepoDataStore<DATA> implements ReadOnlyDataStore<DATA> {
    /** The custom media type supplied by responses from the GitHub API */
    readonly GITHUB_JSON_MEDIA_TYPE: string = "application/vnd.github.v3+json";

    /** The required format for requests to the GitHub API */
    readonly GITHUB_API_TEMPLATE =
        "https://api.github.com/repos/%USERNAME%/%REPO%/contents/%FILEPATH%?ref=%BRANCH%";

    /** The expected version of the GitHub api */
    readonly GITHUB_API_VERSION: string = "2022-11-28";

    /** Token used to authorise GitHub API requests. */
    readonly apiKey: string;
    /** Request URL with the repository and file path already substituted. */
    readonly instanceTemplate: string;

    /** Validates the repository configuration and binds it to this store. */
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
            throw Error("Invalid Arguments");
        }

        this.apiKey = apiKey;

        const filePath = `${this.getBasePath(basePath)}${filename}`;

        this.instanceTemplate = this.GITHUB_API_TEMPLATE.replace(
            "%USERNAME%",
            userName,
        )
            .replace("%REPO%", repoName)
            .replace("%FILEPATH%", `${filePath}`);
    }

    /**
     * Builds a store from the GitHub environment variables.
     *
     * @returns A store configured from the current process environment.
     */
    static createFromEnvironment<T>() {
        return new GithubRepoDataStore<T>({
            /** The username of the owner of the GitHub repository */
            userName: process.env.GITHUB_USERNAME ?? "",

            /** The name of the private repository the file is stored in */
            repoName: process.env.GITHUB_REPO ?? "",

            /** The name of the directory the content is held in
             * Can be empty if the file is in the root of the repo. */
            basePath: process.env.GITHUB_REPO_DIRECTORY ?? "",

            /** The filename to be retrieved from the repo */
            filename: process.env.GITHUB_REPO_FILENAME ?? "",

            /** Get the scoped GitHub API key from the environment variables.
             * API key should be scoped to read only on the private content repository */
            apiKey: process.env.GITHUB_API_KEY ?? "",
        });
    }

    /**
     * Normalises the optional directory prefix into a trailing-slash form.
     *
     * @param basePath Directory within the repository; empty means the root.
     * @returns The prefix with a trailing slash, or an empty string.
     */
    getBasePath(basePath: string): string {
        return basePath ? `${basePath}/` : "";
    }

    /**
     * Fetches the stored record for the supplied identifier.
     *
     * @param id Branch name identifying the record version.
     * @returns The parsed record, or `undefined` when GitHub has no content.
     */
    public async getByID(id: string): Promise<DATA | undefined> {
        const content = await this.getContent(id);
        if (!content) {
            return;
        }

        const removePlaceholders = this.replaceContentPlaceholders(content, id);

        return JSON.parse(removePlaceholders) as DATA;
    }

    /**
     * Substitutes the branch placeholder in the decoded file content.
     *
     * @param content Decoded file content.
     * @param id Branch name to substitute.
     * @returns Content with the branch placeholder replaced.
     */
    protected replaceContentPlaceholders(content: string, id: string): string {
        return content.replace("%BRANCH_NAME%", id);
    }

    /**
     * Completes the request URL for the supplied branch.
     *
     * @param branch Branch name to request.
     * @returns The fully substituted GitHub API URL.
     */
    protected getRequestURL(branch: string): string {
        return this.instanceTemplate.replace("%BRANCH%", branch);
    }

    /**
     * Retrieves and base64-decodes the file content for a branch.
     *
     * @param branch Branch name to request.
     * @returns The decoded content, or `undefined` when absent or undecodable.
     */
    protected async getContent(branch: string): Promise<string | undefined> {
        const response = await fetch(this.getRequestURL(branch), {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                Accept: this.GITHUB_JSON_MEDIA_TYPE,
                "X-GitHub-Api-Version": this.GITHUB_API_VERSION,
            },
        });

        const responseJSON = await response.json();
        if (!responseJSON.content) {
            return undefined;
        }

        try {
            return atob(responseJSON.content);
        } catch {
            return undefined;
        }
    }
}
