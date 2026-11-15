/** Removes characters that are not permitted in a resource identifier. */
export interface Sanitiser {
    /** Returns the sanitised form of the supplied raw value. */
    sanitise: (rawString: string) => string;
}
