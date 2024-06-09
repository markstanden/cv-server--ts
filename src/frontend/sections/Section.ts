import { Renderable } from '../../types/Renderable/Renderable.ts';

export class Section implements Renderable {
    static create(): Section {
        return new Section();
    }

    static createSection(content?: string, tagName = 'section'): HTMLElement {
        const section = document.createElement(tagName);
        section.innerHTML = content ?? '';
        return section;
    }

    public render(): HTMLElement {
        return Section.createSection();
    }
}
