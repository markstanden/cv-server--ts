export interface ReadOnlyDataStore<Type> {
    getByID: (id: string) => Promise<Type>;
}
