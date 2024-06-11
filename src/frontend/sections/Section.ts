import { Renderable } from '../../types/Renderable/Renderable.ts';
import { tw } from '../../tailwind/tw/tw.ts';

export class Section implements Renderable {
    static create(): Section {
        return new Section();
    }

    static createSection(content?: string, tagName = 'section'): HTMLElement {
        const section = document.createElement(tagName);

        section.innerHTML = content ?? '';
        section.className = tw`m-0`;
        return section;
    }

    public render(): HTMLElement {
        return Section.createSection();
    }
}
