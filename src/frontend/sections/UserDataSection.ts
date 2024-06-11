import { Link, Location, UserData } from '../../types/CV/CV.ts';
import { Section } from './Section.ts';
import { tw } from '../../tailwind/tw/tw.ts';

export class UserDataSection implements Section {
    private readonly name: string;
    private readonly location: Location;
    private readonly contact: { phone: string; email: string };
    private readonly links: Link[];

    constructor({ name, location, contact, links }: UserData) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.links = links;
    }

    static create(userData: UserData) {
        return new UserDataSection(userData);
    }

    render() {
        return Section.createSection(
            `
            <h1 class="${tw`mb-1 mt-6 border-b-2 border-b-indigo-700 text-2xl/8 print:mt-0 print:text-base/6`}">${this.name}</h1>
                <section class="${tw`flex flex-col sm:flex-row`}">
                    
                    <address class="${tw`flex-grow`}">
                        <ul class="${tw`flex flex-col print:text-xs/4`}">
                            <li class="${tw`inline-grid grid-cols-2 gap-4 sm:grid-cols-[8rem_auto] print:grid-cols-[4rem_auto]`}">
                                <strong class="${tw``}">Based:</strong>
                                ${this.location.city}, ${this.location.country}</em>
                            </li>
                            <li class="${tw`inline-grid grid-cols-2 gap-4 sm:grid-cols-[8rem_auto] print:grid-cols-[4rem_auto]`}">
                                <strong class="${tw``}">Email:</strong>
                                <a class="${tw``}" href="mailto:${this.contact.email}?subject=CV Review">${this.contact.email}</a>
                            </li>
                            <li class="${tw`inline-grid grid-cols-2 gap-4 sm:grid-cols-[8rem_auto] print:grid-cols-[4rem_auto]`}">
                                <strong class="${tw``}">Tel: </strong>
                                <a class="${tw``}" href="tel:${this.contact.phone}">${this.contact.phone}</a>
                            </li>
                        </ul>
                    </address>
                
                    <nav>
                        <ul class="${tw`mt-2 flex flex-col sm:mt-0 sm:flex-grow print:text-xs/4`}">
                            ${this.links
                                .map((link) => {
                                    return `
                                   <li class="${tw`inline-grid grid-cols-2 gap-4`}">
                                        <strong class="${tw`font-bold sm:text-right`}">${link.title}:</strong>
                                        <a class="${tw`break-words sm:text-right print:whitespace-break-spaces`}" href="${link.url}">${link.url.split('//')[1]}</a>
                                    </li> 
                                `;
                                })
                                .join('')}
                        </ul>
                    </nav>
                    
                </section>
        `,
            'header'
        );
    }
}
