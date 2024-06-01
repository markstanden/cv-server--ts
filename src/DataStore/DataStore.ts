import { ReadOnlyDataStore } from './ReadOnlyDataStore.ts';

export interface DataStore<Type> extends ReadOnlyDataStore<Type> {}
