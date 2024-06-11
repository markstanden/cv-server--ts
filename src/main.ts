import './tailwind/tailwind.css';
import { getCvFromApi } from './frontend/getCvFromApi/getCvFromApi.ts';
import { UserDataSection } from './frontend/sections/UserDataSection.ts';
import { GeneralSection } from './frontend/sections/GeneralSection.ts';
import { tw } from './tailwind/tw/tw.ts';
import { ExperienceSection } from './frontend/sections/ExperienceSection.ts';
import { CoverLetterSection } from './frontend/sections/CoverLetterSection.ts';

addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app')!;
    app.className = tw`mx-auto max-w-5xl`;

    const { coverLetter, user, experienceSection, sections } =
        await getCvFromApi('seasalt');

    app.appendChild(CoverLetterSection.create(coverLetter, user).render());

    app.appendChild(UserDataSection.create(user).render());

    app.appendChild(ExperienceSection.create(experienceSection).render());
    sections.forEach((section) =>
        app.appendChild(GeneralSection.create(section).render())
    );
});
