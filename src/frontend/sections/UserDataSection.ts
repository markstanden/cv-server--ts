import { Link, Location, UserData } from '../../types/CV/CV.ts';
import { Section } from './Section.ts';

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
        return Section.createSection(`
            <header class="headerBlock">
                <section class="personal">
                    <h1 class="applicantName">${this.name}</h1>
                    <address class="applicantLocation">
                        <ul>
                            <li class="flex">
                                <em class="info_title">Based: </em>
                                <strong>${this.location.city}, ${this.location.country}</strong>
                            </li>
                            <li class="flex">
                                <em class="info_title">Email: </em>
                                <a href="mailto:${this.contact.email}?subject=CV Review">${this.contact.email}</a>
                            </li>
                            <li class="flex">
                                <em class="info_title">Tel: </em>
                                <a href="tel:${this.contact.phone}">${this.contact.phone}</a>
                            </li>
                        </ul>
                    </address>
                </section>
                <nav style="display: flex; flex-direction: column">
                    <ul class="links">
                        ${this.links
                            .map((link) => {
                                return `
                               <li class="link-item">
                                    <em class="info_title">
                                        <span class="link-desc">${link.title}: </span>
                                    </em>
                                    <a href="${link.url}">${link.url}</a>
                                </li> 
                            `;
                            })
                            .join('')}
                    </ul>
                </nav>
            </header>
        `);
    }
}
