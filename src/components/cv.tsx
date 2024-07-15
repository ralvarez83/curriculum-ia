import React, { useState } from 'react';
import { Code, Briefcase, GraduationCap, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Header from './header';
import { Language, Translation, translations } from '../data/translations-ts';
import Section from './section';
import Card from './card';
import Skills from './skills';
import ProjectCard from './project';
import { contacts } from '../data/contact';
import '../themes/cv-friki.css'

const CV: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  const t: Translation = translations[lang];

  const toggleLanguage = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-green-500">
        <div className="flex justify-end p-4 languaje-boton">
          <button
            onClick={toggleLanguage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
        <Header
          name={t.name}
          title={t.title}
          photo={t.photo}
          contacts={contacts}
        />

        <div className="p-6">
          <Section title={t.sections.profile} icon={Code}>
            <ReactMarkdown className="text-gray-700 bg-gray-100 p-4 rounded-lg border-l-4 border-green-500">
              {t.profile}
            </ReactMarkdown>
          </Section>

          <Section title={t.sections.skills} icon={Code}>
            <Skills skills={t.skills} />
          </Section>

          <Section title={t.sections.projects} icon={Folder}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  {...project}
                />
              ))}
            </div>
          </Section>

          <Section title={t.sections.experience} icon={Briefcase}>
            {t.experience.map((job, index) => (
              <Card
                key={index}
                title={job.title}
                subtitle={`${job.company} | ${job.period}`}
                content={job.responsibilities}
              />
            ))}
          </Section>

          <Section title={t.sections.education} icon={GraduationCap}>
            {t.education.map((edu, index) => (
              <Card
                key={index}
                title={edu.degree}
                subtitle={`${edu.institution} | ${edu.period}`}
              />
            ))}
          </Section>

        </div>
      </div>
    </div>
  );
};

export default CV;
