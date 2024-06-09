import { Renderable } from '../../types/Renderable/Renderable.ts';

export class Section implements Renderable {
    static create(): Section {
        return new Section();
    }

    static createSection(content?: string): HTMLElement {
        const section = document.createElement('section');
        section.innerHTML = content ?? '';
        return section;
    }

    public render(): HTMLElement {
        return Section.createSection();
    }
}
