export interface CV {
    user: UserData;
    coverLetter: CoverLetter;
    experienceSection: Experience;
    sections: Section[];
}

export interface UserData {
    name: string;
    location: Location;
    contact: {
        phone: string;
        email: string;
    };
    links: Link[];
}

export interface CoverLetter {
    greeting: string;
    text: string[];
    signOff: string;
}

export interface Experience {
    title: string;
    items: {
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
}

export interface Section {
    title: string;
    items: {
        title: string;
        link?: string;
        dates?: string;
        content: string[];
    }[];
}

export interface Location {
    city: string;
    country: string;
}

export interface Link {
    title: string;
    url: string;
}
