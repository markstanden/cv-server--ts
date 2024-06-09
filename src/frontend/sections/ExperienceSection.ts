import { Experience, Location } from '../../types/CV/CV.ts';
import { Section } from './Section.ts';

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
        <h2 class="section-header">${this.title}</h2>
        ${this.items
            .map(
                (item) => `
            <article class="vertically-spaced">
                <div class="position-header">
                    <div class="position-title">
                        <h3><strong>${item.title}</strong></h3>
                        <h4 class="position-company"><em>${item.business.title}, ${item.business.location.city}</em>
                        </h4>
                    </div>
                    <p class="dates"><strong>${item.dates}</strong></p>
                </div>
                <ul class="position-bullets">
                ${item.content
                    .map(
                        (point) => `
                   <li class="bulleted-content">${point}</li> 
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
