import './tailwind/tailwind.css';
import { getCvFromApi } from './frontend/getCvFromApi/getCvFromApi.ts';
import { UserDataSection } from './frontend/sections/UserDataSection.ts';
import { CoverLetterSection } from './frontend/sections/CoverLetterSection.ts';
import { GeneralSection } from './frontend/sections/GeneralSection.ts';
import { ExperienceSection } from './frontend/sections/ExperienceSection.ts';

addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app')!;

    const { user, coverLetter, experienceSection, sections } =
        await getCvFromApi('seasalt');

    app.appendChild(CoverLetterSection.create(coverLetter, user).render());

    app.appendChild(UserDataSection.create(user).render());
    app.appendChild(ExperienceSection.create(experienceSection).render());
    sections.forEach((section) =>
        app.appendChild(GeneralSection.create(section).render())
    );
});
