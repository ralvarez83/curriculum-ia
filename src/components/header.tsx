import React from 'react';
import { LucideIcon} from 'lucide-react';

interface ContactInfo {
  icon: LucideIcon;
  text: string;
  href?: string;
}

interface HeaderProps {
  name: string;
  title: string;
  photo: string;
  contacts?: ContactInfo[];
}

const ContactInfo: React.FC<ContactInfo> = ({ icon: Icon, text, href }) => (
  <div className="flex items-center mb-2">
    <Icon className="w-5 h-5 mr-2 text-green-500" />
    {href ? (
      <a href={href} className="text-white hover:text-green-500 transition-colors" target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ) : (
      <span className="text-white">{text}</span>
    )}
  </div>
);

const Header: React.FC<HeaderProps> = ({ name, title, contacts = [], photo }) => {
  return (
    <header className="bg-gray-800 text-white p-6">
      <div className="flex items-center border-b-2 border-green-500 pb-4 mb-4">
        <img
          src={photo}
          alt={name}
          className="w-24 h-24 rounded-full border-2 border-green-500 mr-6"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">{name}</h1>
          <h2 className="text-xl">{title}</h2>
        </div>
      </div>
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <ContactInfo key={index} {...contact} />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;