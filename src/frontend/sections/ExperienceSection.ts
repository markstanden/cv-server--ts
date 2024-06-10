import { Experience, Location } from '../../types/CV/CV.ts';
import { Section } from './Section.ts';
import { tw } from '../../tailwind/tw/tw.ts';

export class ExperienceSection implements Section {
    private readonly title: string;
    private readonly items: {
        title: string;
        business: {
            title: string;
            link: string;
            location: Location;
            department: string;
        };
        dates: string;
        content: string[];
    }[];

    constructor({ title, items }: Experience) {
        this.title = title;
        this.items = items;
    }

    static create(experience: Experience) {
        return new ExperienceSection(experience);
    }

    render() {
        return Section.createSection(`
        <h2 class="${tw`mb-1 mt-1.5 border-b-2 border-b-indigo-700`}">${this.title}</h2>
        ${this.items
            .map(
                (item) => `
            <article class="${tw`my-2 print:my-1`}">
                <div class="${tw`mb-0.5 mt-1.5 flex flex-row`}">
                    <div class="${tw`flex flex-grow flex-col print:flex-row`}">
                        <h3 class="${tw`w-72 font-bold`}">${item.title}</h3>
                        <h4 class="${tw`flex-grow`}"><em>${item.business.title}, ${item.business.location.city}</em>
                        </h4>
                    </div>
                    <p class="${tw`font-bold`}">${item.dates}</p>
                </div>
                <ul class="${tw`position-bullets`}">
                ${item.content
                    .map(
                        (point) => `
                   <li class="${tw`bulleted-content`}">${point}</li> 
                `
                    )
                    .join('')}
                </ul>
            </article> 
        `
            )
            .join('')}
            
       `);
    }
}
