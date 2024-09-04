import { getCvFromApi } from '../getCvFromApi/getCvFromApi.ts';
import { UserDataSection } from '../sections/UserDataSection.ts';
import { GeneralSection } from '../sections/GeneralSection.ts';
import { tw } from '../../tailwind/tw/tw.ts';
import { ExperienceSection } from '../sections/ExperienceSection.ts';
import { CoverLetterSection } from '../sections/CoverLetterSection.ts';

export async function renderPage(app: Element, key: string) {
    if (app && key) {
        app.className = tw`mx-4 max-w-5xl`;
        const { coverLetter, user, experienceSection, sections } =
            await getCvFromApi(key);

        app.appendChild(CoverLetterSection.create(coverLetter, user).render());
        app.appendChild(UserDataSection.create(user).render());
        app.appendChild(ExperienceSection.create(experienceSection).render());
        sections.forEach((section) =>
            app.appendChild(GeneralSection.create(section).render())
        );
    }
}
