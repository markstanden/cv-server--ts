export interface Sanitiser {
    sanitise: (rawString: string) => string;
}
