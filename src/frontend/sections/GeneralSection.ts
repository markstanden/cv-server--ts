import { Section } from './Section.ts';
import { General } from '../../types/CV/CV.ts';
import { tw } from '../../tailwind/tw/tw.ts';

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
        <h2 class="text-xl/8 border-b-2 border-b-indigo-700 mt-6 print:mt-1 mb-1 print:text-base/6">${this.title}</h2>
            ${this.items
                .map(
                    (item) =>
                        `
                        <li class="${tw`grid-auto-rows text-base/6.5 my-1 inline-grid w-full sm:grid-rows-1 print:my-0 print:text-xs/5 [&:nth-child(odd)]:bg-indigo-50 ${item.dates ? tw`sm:grid-cols-[8rem_1fr_6rem] print:grid-cols-[4rem_1fr_6rem]` : tw`sm:grid-cols-[8rem_1fr] print:grid-cols-[6rem_1fr]`} gap-1 sm:gap-4`}">
                            <h3 class"${tw`text-bold order-1`}">
                                ${
                                    item.link
                                        ? `<a href="${item.link}">${item.title}</a>`
                                        : item.title
                                } 
                            </h3>
                            <p class"${tw`order-3 ml-0.5 border-l-2 border-indigo-700 sm:order-2 sm:border-l-0 print:text-xs/5`}">
                                ${item.content
                                    .map(
                                        (point) => `
                                    <span class"${tw``}">${point}</span> 
                                `
                                    )
                                    .join('')}  
                            </p>
                            ${item.dates ? `<p class"${tw`order-2 sm:order-3 sm:text-right`}">${item.dates}</p>` : ''}  
                        </li> 
                    `
                )
                .join('')}
        `);
    }
}
