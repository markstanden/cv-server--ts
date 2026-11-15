import { ReadOnlyDataStore } from "./ReadOnlyDataStore.ts";

/** Read-only store alias kept for callers that do not need write access. */
export type DataStore<Type> = ReadOnlyDataStore<Type>;
