import React from 'react';

// Definimos los tipos de nivel de idioma
type LanguageLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';

// Interfaz para las propiedades del componente
interface LanguageSkillProps {
  language: string;
  level: LanguageLevel;
}

// Componente para una habilidad de idioma individual
const LanguageSkill: React.FC<LanguageSkillProps> = ({ language, level }) => {
  // Función para determinar el color de fondo basado en el nivel
  const getBackgroundColor = (level: LanguageLevel) => {
    switch (level) {
      case 'Básico': return 'bg-blue-200';
      case 'Intermedio': return 'bg-green-200';
      case 'Avanzado': return 'bg-yellow-200';
      case 'Nativo': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 mb-2 rounded-lg shadow-sm">
      <span className="font-medium text-gray-700">{language}</span>
      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getBackgroundColor(level)}`}>
        {level}
      </span>
    </div>
  );
};

// Interfaz para las propiedades del componente principal
interface LanguageSkillsProps {
  skills: Array<{ language: string; level: LanguageLevel }>;
}

// Componente principal que muestra todas las habilidades de idioma
const LanguageSkills: React.FC<LanguageSkillsProps> = ({ skills }) => {
  return (
    <div className="language-skills">
      <h3 className="text-xl font-bold mb-4">Idiomas</h3>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <LanguageSkill key={index} language={skill.language} level={skill.level} />
        ))}
      </div>
    </div>
  );
};

export default LanguageSkills;
