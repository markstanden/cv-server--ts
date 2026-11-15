/** Read-only lookup of a single record by its identifier. */
export interface ReadOnlyDataStore<Type> {
    /** Resolves to the record, or `undefined` when no record matches. */
    getByID: (id: string) => Promise<Type | undefined>;
}
