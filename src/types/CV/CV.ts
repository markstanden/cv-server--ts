export interface CV {
    user: UserData;
    coverLetter: CoverLetter;
    experienceSection: Experience;
    sections: General[];
}

export interface CVSection {}

export interface UserData extends CVSection {
    name: string;
    location: Location;
    contact: {
        phone: string;
        email: string;
    };
    links: Link[];
}

export interface CoverLetter extends CVSection {
    greeting: string;
    text: string[];
    signOff: string;
}

export interface Experience extends CVSection {
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

export interface General extends CVSection {
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
