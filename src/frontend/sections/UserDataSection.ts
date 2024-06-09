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
            <h1 class="${tw`border-b-2 border-b-indigo-700 text-3xl`}">${this.name}</h1>
                <section class="${tw`flex flex-row`}">
                    
                    <address class="${tw`flex-grow`}">
                        <ul class="${tw`flex flex-col text-base`}">
                            <li class="${tw`flex`}">
                                <strong class="${tw`min-w-16`}">Based: </strong>
                                <em>${this.location.city}, ${this.location.country}</em>
                            </li>
                            <li class="${tw`flex`}">
                                <strong class="${tw`min-w-16`}">Email: </strong>
                                <a href="mailto:${this.contact.email}?subject=CV Review">${this.contact.email}</a>
                            </li>
                            <li class="${tw`flex`}">
                                <strong class="${tw`min-w-16`}">Tel: </strong>
                                <a href="tel:${this.contact.phone}">${this.contact.phone}</a>
                            </li>
                        </ul>
                    </address>
                
                    <nav>
                        <ul class="${tw`flex flex-grow flex-col items-end`}">
                            ${this.links
                                .map((link) => {
                                    return `
                                   <li class="${tw`flex flex-row`}">
                                        <em class="${tw`mr-2`}">
                                            <span class="${tw`flex flex-grow`}">${link.title}: </span>
                                        </em>
                                        <a href="${link.url}">${link.url.split('//')[1]}</a>
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
