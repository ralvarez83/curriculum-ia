import React from 'react';
import ReactMarkdown from 'react-markdown';

interface CardProps {
  title: string;
  subtitle?: string;
  content?: string[];
}

const Card: React.FC<CardProps> = ({ title, subtitle, content }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-green-500 mb-4">
      <h4 className="text-xl font-medium text-gray-800 mb-2">{title}</h4>
      {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}
      {content && content.length > 0 && (
        <div className="text-gray-700">
          {content.map((paragraph, index) => (
            <p key={index} className="text-justify mb-2 last:mb-0">
              <ReactMarkdown className="inline">{paragraph}</ReactMarkdown>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;