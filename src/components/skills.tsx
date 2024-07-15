import React from 'react';

interface SkillsProps {
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => (
  <div className="flex flex-wrap gap-2">
    {skills.map((skill, index) => (
      <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
        {skill}
      </span>
    ))}
  </div>
);

export default Skills;
