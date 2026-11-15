import { getCvFromApi } from "../getCvFromApi/getCvFromApi.ts";
import { UserDataSection } from "../sections/UserDataSection.ts";
import { GeneralSection } from "../sections/GeneralSection.ts";
import { tw } from "../../tailwind/tw/tw.ts";
import { ExperienceSection } from "../sections/ExperienceSection.ts";
import { CoverLetterSection } from "../sections/CoverLetterSection.ts";

/**
 * Fetches the CV for the supplied page key and renders it into the app root.
 *
 * @param app Root element that receives the rendered sections; a missing or
 * falsy element is a programming error.
 * @param key Page key selecting the CV branch; blank keys are rejected.
 */
export async function renderPage(
    app: Element | null | undefined,
    key: string | null | undefined,
): Promise<void> {
    if (!app) {
        throw new Error("renderPage: missing root app element");
    }
    if (!key || key.trim().length === 0) {
        throw new Error("renderPage: missing page key");
    }

    app.className = tw`mx-4 max-w-5xl`;
    const data = await getCvFromApi(key);

    if (!data) {
        throw new Error("renderPage: API returned no data");
    }

    const { coverLetter, user, experienceSection, sections } = data;

    const frag = document.createDocumentFragment();
    frag.appendChild(CoverLetterSection.create(coverLetter, user).render());
    frag.appendChild(UserDataSection.create(user).render());
    frag.appendChild(ExperienceSection.create(experienceSection).render());

    if (!Array.isArray(sections)) {
        throw new Error("renderPage: sections is not an array");
    }

    for (const section of sections) {
        frag.appendChild(GeneralSection.create(section).render());
    }

    app.appendChild(frag);
}
