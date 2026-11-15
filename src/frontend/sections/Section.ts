import { Renderable } from "../../types/Renderable/Renderable.ts";
import { tw } from "../../tailwind/tw/tw.ts";

/** Base section wrapper that renders markup into a fresh DOM element. */
export class Section implements Renderable {
    /** Creates an empty section. */
    static create(): Section {
        return new Section();
    }

    /**
     * Builds an element and fills it with the supplied markup.
     *
     * @param content Markup inserted as the element's inner HTML; omitted for
     * an empty element.
     * @param tagName Element name to create; `section` by default.
     * @returns The new DOM element.
     */
    static createSection(content?: string, tagName = "section"): HTMLElement {
        const section = document.createElement(tagName);

        section.innerHTML = content ?? "";
        section.className = tw`m-0`;
        return section;
    }

    /** Renders an empty section element. */
    public render(): HTMLElement {
        return Section.createSection();
    }
}
