import { Mail, MapPin } from '@lucide/astro';
import GithubIcon from '../components/icons/GithubIcon.astro';
import LinkedinIcon from '../components/icons/LinkedinIcon.astro';

/**
 * Datos de contacto. No se traducen (son literales: email, usuario, URL),
 * por eso viven aquí y no en `src/i18n/`.
 */
export const contacts = [
  {
    icon: Mail,
    text: 'rubenag83@gmail.com',
    href: 'mailto:rubenag83@gmail.com',
  },
  { icon: MapPin, text: 'Madrid, España' },
  {
    icon: GithubIcon,
    text: 'github.com/ralvarez83',
    href: 'https://github.com/ralvarez83',
  },
  {
    icon: LinkedinIcon,
    text: 'linkedin.com/in/rubenalvarezgonzalez',
    href: 'https://linkedin.com/in/rubenalvarezgonzalez',
  },
];
