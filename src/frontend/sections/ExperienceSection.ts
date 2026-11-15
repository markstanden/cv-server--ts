import { Experience, Location } from "../../types/CV/CV.ts";
import { Section } from "./Section.ts";
import { tw } from "../../tailwind/tw/tw.ts";

/** Renders the professional-history section. */
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

    /** Binds the experience payload used by the render pass. */
    constructor({ title, items }: Experience) {
        this.title = title;
        this.items = items;
    }

    /**
     * Creates the section from its CV payload.
     *
     * @param experience Experience content to render.
     * @returns The configured section.
     */
    static create(experience: Experience) {
        return new ExperienceSection(experience);
    }

    /** Renders the roles as a heading and a list of articles. */
    render() {
        return Section.createSection(`
        <h2 class="${tw`mb-1 mt-6 border-b-2 border-b-indigo-700 text-xl/8 print:mt-1 print:text-base/6`}">${this.title}</h2>
        ${this.items
            .map(
                (item) => `
            <article class="${tw`my-2 print:my-1`}">
                <div class="${tw`mb-0.5 ml-0.5 mt-1.5 flex flex-col sm:flex-row print:text-sm/5`}">
                    <div class="${tw`flex flex-grow flex-col print:flex-row print:align-middle print:text-base/5`}">
                        <h3 class="${tw`text-lg font-bold print:text-sm/5`}">${item.title}</h3>
                        <span class="${tw`hidden print:mx-2 print:inline-block`}">//</span>
                        <span class="${tw`flex-grow print:text-sm/5`}">
                            <em>${item.business.title}, ${item.business.location.city}</em>
                        </span>
                    </div>
                    <p class="${tw`font-bold print:text-sm/5`}">${item.dates}</p>
                </div>
                <ul class="${tw`ml-0.5 border-l-2 border-indigo-700 pl-2 sm:border-l-2 print:text-xs/4`}">
                ${item.content
                    .map((point) => `<li class="${tw``}">${point}</li>`)
                    .join("")}
                </ul>
            </article> 
        `,
            )
            .join("")}
            
       `);
    }
}
