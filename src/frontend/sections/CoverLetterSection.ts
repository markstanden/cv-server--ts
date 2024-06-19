import { CoverLetter, Location, UserData } from '../../types/CV/CV.ts';
import { Section } from './Section.ts';
import { tw } from '../../tailwind/tw/tw.ts';

export class CoverLetterSection implements Section {
    private readonly name: string;
    private readonly location: Location;
    private readonly contact: { phone: string; email: string };
    private readonly greeting: string;
    private readonly text: string[];
    private readonly signOff: string;

    constructor(
        { greeting, text, signOff }: CoverLetter,
        { name, location, contact }: UserData
    ) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.greeting = greeting;
        this.text = text;
        this.signOff = signOff;
    }

    static create(coverLetter: CoverLetter, userData: UserData) {
        return new CoverLetterSection(coverLetter, userData);
    }

    render() {
        return Section.createSection(`
            <article class="${tw`avoid-page-break mx-auto mb-20 flex max-w-4xl flex-col self-center print:mb-0 print:break-after-page print:text-sm`}">
                <div class="${tw`flex justify-end`}"> 
                    <address class="${tw`mb-8 max-w-max text-right`}"> 
                        <p>${this.name},</p>
                        <p>${this.location.city},</p>
                        <p>${this.location.country}.</p>
                        <p>
                            <a href="mailto:${this.contact.email}?subject=CV Review">${this.contact.email}</a>
                        </p>
                        <p>
                            <a href="tel:${this.contact.phone}">${this.contact.phone}</a>
                        </p>
                    </address>
                </div>
                <p>${this.greeting},</p>
                <div>
                    ${this.text
                        .map((paragraph) => {
                            return `
                            <p class="${tw`my-3 first-of-type:ml-4`}">
                                ${paragraph}
                            </p> 
                        `;
                        })
                        .join('')}
                </div>
                <p class="mt-8">${this.signOff}</p>
                <p>${this.name}</p>
            </article>
        `);
    }
}
