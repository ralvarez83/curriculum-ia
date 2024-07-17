import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  shortDescription: string;
  image: string;
  projectLink?: string;
  sourceLink?: string;
  dockerLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  shortDescription,
  image,
  projectLink,
  sourceLink,
  dockerLink
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-green-500 flex flex-col h-full">
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h4 className="text-lg font-medium text-gray-800 mb-2">{title}</h4>
      <ReactMarkdown className="text-gray-600 mb-4 flex-grow">{shortDescription}</ReactMarkdown>
      <div className="flex flex-wrap gap-2 mt-auto screen-only">
        {projectLink && (
          <a href={projectLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition-colors flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" /> View
          </a>
        )}
        {sourceLink && (
          <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition-colors flex items-center">
            <Github className="w-4 h-4 mr-1" /> Source
          </a>
        )}
        {dockerLink && (
          <a href={dockerLink} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" /> Docker
          </a>
        )}
      </div>
      <div className="hidden print-only">
        {projectLink && <div>View: {projectLink}</div>}
        {sourceLink && <div>Source: {sourceLink}</div>}
        {dockerLink && <div>Docker: {dockerLink}</div>}
      </div>
    </div>
  );
};

export default ProjectCard;