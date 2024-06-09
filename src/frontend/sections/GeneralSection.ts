import { Section } from './Section.ts';
import { General } from '../../types/CV/CV.ts';

export class GeneralSection implements Section {
    private readonly title: string;
    private readonly items: {
        title: string;
        link?: string;
        dates?: string;
        content: string[];
    }[];

    constructor({ title, items }: General) {
        this.title = title;
        this.items = items;
    }

    static create(general: General) {
        return new GeneralSection(general);
    }

    render() {
        return Section.createSection(`
        <h2 class="section-header">${this.title}</h2>
            ${this.items
                .map(
                    (item) =>
                        `
                        <li class="item vertically-spaced">
                            <h3 class="item-title">
                                ${
                                    item.link
                                        ? `<a href="${item.link}">${item.title}</a>`
                                        : item.title
                                } 
                            </h3>
                            <p class="item-content">
                                ${item.content
                                    .map(
                                        (point) => `
                                    <span class="item-point">${point}</span> 
                                `
                                    )
                                    .join('')}  
                            </p>
                            ${item.dates ? `<p class="dates"><strong>${item.dates}</strong></p>` : ''}  
                        </li> 
                    `
                )
                .join('')}
        `);
    }
}
