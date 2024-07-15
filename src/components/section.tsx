import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
        <Icon className="mr-2 text-green-500" />
        {title}
      </h3>
      {children}
    </section>
  );
};

export default Section;
