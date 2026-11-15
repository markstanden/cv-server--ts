/** A renderable fragment with a DOM node as its output. */
export interface Renderable {
    /** Builds and returns the rendered DOM element. */
    render(): HTMLElement;
}
