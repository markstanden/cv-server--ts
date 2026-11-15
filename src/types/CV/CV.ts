/**
 * Root CV payload rendered by the page: identity, cover letter, experience
 * and any additional free-form sections.
 */
export interface CV {
    /** Applicant identity and contact details. */
    user: UserData;
    /** Opening letter addressed to the reader. */
    coverLetter: CoverLetter;
    /** Professional history. */
    experienceSection: Experience;
    /** Additional sections rendered in the supplied order. */
    sections: General[];
}

/** Applicant identity and contact details. */
export interface UserData {
    /** Full display name. */
    name: string;
    /** City and country shown in the header. */
    location: Location;
    /** Contact channels for the applicant. */
    contact: {
        /** Telephone number, including country code when needed. */
        phone: string;
        /** Email address used for the contact link. */
        email: string;
    };
    /** External profiles and portfolio links. */
    links: Link[];
}

/** Opening letter addressed to the reader. */
export interface CoverLetter {
    /** Salutation line, without the trailing comma. */
    greeting: string;
    /** Paragraphs of the letter, rendered in order. */
    text: string[];
    /** Closing line before the signature. */
    signOff: string;
}

/** Professional history. */
export interface Experience {
    /** Heading for the experience section. */
    title: string;
    /** Roles rendered in the supplied order. */
    items: {
        /** Job title held. */
        title: string;
        /** Employer details for the role. */
        business: {
            /** Employer name. */
            title: string;
            /** Employer website, when one exists. */
            link: string;
            /** Employer location. */
            location: Location;
            /** Department or team within the employer. */
            department: string;
        };
        /** Human-readable employment dates. */
        dates: string;
        /** Achievement bullets for the role. */
        content: string[];
    }[];
}

/** Additional free-form section rendered after the experience. */
export interface General {
    /** Heading for the section. */
    title: string;
    /** Entries rendered in the supplied order. */
    items: {
        /** Entry title, linked when a URL is supplied. */
        title: string;
        /** Optional URL the title links to. */
        link?: string;
        /** Optional human-readable dates for the entry. */
        dates?: string;
        /** Detail text for the entry. */
        content: string[];
    }[];
}

/** A city and country pair used in headers and employer details. */
export interface Location {
    /** City name. */
    city: string;
    /** Country name. */
    country: string;
}

/** An external link shown in the header. */
export interface Link {
    /** Label shown before the URL. */
    title: string;
    /** Absolute URL including the protocol. */
    url: string;
}
