export type Language = "es" | "en";

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface Project {
  title: string;
  shortDescription: string;
  image: string;
  projectLink?: string;
  sourceLink?: string;
  dockerLink?: string;
}
interface LanguageSkill {
  language: string;
  level: "Básico" | "Intermedio" | "Avanzado" | "Nativo";
}

export interface Translation {
  name: string;
  title: string;
  photo: string;
  sections: {
    profile: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    languages: string;
  };
  profile: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  languages: LanguageSkill[];
}

export const translations: Record<Language, Translation> = {
  es: {
    name: "Rubén Álvarez",
    title: "Desarrollador Back-end",
    photo: "photo.jpg",
    sections: {
      profile: "Perfil",
      experience: "Experiencia",
      education: "Educación",
      skills: "Habilidades",
      projects: "Proyectos",
      languages: "Idiomas",
    },
    profile:
      "Me gusta el **desarrollo de productos de software** y me encanta trabajar lo mejor que puedo, aplicando las **mejores prácticas** que conozco. Disfruto buscando **nuevas y mejores maneras de hacer las cosas**. Siempre estoy en busca de **innovaciones** que puedan mejorar mi trabajo y los productos que desarrollo. Me esfuerzo por **aprender y adaptarme** a nuevas tecnologías y metodologías. Me motiva enfrentar **desafíos** que me permitan **crecer profesionalmente** y contribuir de manera significativa a los proyectos en los que participo. Valoro mucho la **colaboración con mis compañeros**, ya que creo que el **trabajo en equipo mejora los resultados**. Me esfuerzo cada día por **mejorar mis habilidades y conocimientos** para poder aprovechar las herramientas y tecnologías que tengo a mi alcance.",
    experience: [
      {
        title: "Agile Coach / Formador",
        company: "Estratecno",
        period: "Oct. 2019 - Jul. 2024",
        responsibilities: [
          "Implementé Scrum, Kanban y SAFe en diversas empresas, proporcionando formación y coaching.",
          "Practiqué TDD, BDD antes de promoverlas junto a DevOps para maximizar la eficacia de la agilidad en entornos de desarrollo.",
        ],
      },
      {
        title: "Scrum Master / Agile Coach",
        company: "UST-Global",
        period: "Jun. 2018 - Oct. 2019",
        responsibilities: [
          "Ayudé a equipos de trabajo a funcionar de manera más efectiva aplicando marcos ágiles como Scrum y técnicas concretas de SAFe adaptadas.",
          "Puse sobre la mesa en un tiempo reducido la viabilidad de los proyectos.",
        ],
      },
      {
        title: "Co-Fundador – CTO",
        company: "Spika Tech",
        period: "Nov. 2015 - Feb. 2018",
        responsibilities: [
          "Lideré proyectos tecnológicos para clientes como BBVA y HP.",
          "Diseñé las soluciones software, gestioné equipos y seleccioné tecnologías clave.",
          "Sectores: Fintech, Realidad Virtual médica, herramientas 3D, turismo y educación.",
          "Mentoricé al equipo junior.",
          "Tecnologías: **.Net Core**, **Azure**, **MySQL**, **SQL Server**, **PostgreSQL**, Xamarin, Stripe, Paypal, Unity3D, Unreal, Cuda, Angular JS, Java (Jersey y Spring), PHP, PhoneGap, etc.",
        ],
      },
      {
        title: "Co-Fundador – CTO",
        company: "DreamTechnology",
        period: "Ene. 2013 - Nov. 2015",
        responsibilities: [
          "Dirigí proyectos de e-commerce y logística, diseñando soluciones software y seleccionando tecnologías.",
          "Gestioné relaciones con clientes y proporcioné tutoría técnica al equipo.",
          "Tecnologías: **.Net 4.5**, **Entity Framework** y **LINQ**, **Selenium**, **SQL Server**, PHP con Zend Framework y Doctrine, MySQL",
        ],
      },
      {
        title: "Experiencias anteriores",
        company: "",
        period: "May 2007 - E. 2013",
        responsibilities: [
          "**Profesor de .Net 4.5** - Innopulse Asesores Tecnológicos: **C#**, **VB**, **Entity Framework**, **LINQ**, **MVC**, **Web Services**, Security, and XML.",
          "**Desarrollador Senior** - Kincubator: Java (API REST), Oauth2, Protege, Jena, SDB)",
          "**Desarrollador Senior** - Innopulse Asesores Tecnológicos: **.Net 3.5**, TFS, TFS Build y **pruebas automáticas**",
          "**Desarrollador Junior** - Innopulse Asesores Tecnológicos y Tecnología y Desarrollo en Internet: **.Net 3.5** y Java (Servlets)",
        ],
      },
    ],
    education: [
      {
        degree: "Master en Investigación en Inteligencia Artificial",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2008 - Jun. 2011",
      },
      {
        degree: "Grado en Ingeniería del Software",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2009 - Jun. 2010",
      },
      {
        degree: "Master en Computación de Ciencias y Tecnología",
        institution: "Universidad Carlos III de Madrid",
        period: "Sept. 2007 - Jun. 2008",
      },
      {
        degree: "Ingeniería Técnica en Sistemas Informáticos",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2003 - Mar. 2007",
      },
    ],
    skills: [
      ".Net Core",
      "API REST",
      "Dockers",
      "DDD",
      "CQRS",
      "Arquitectura Hexagonal",
      "xUnit",
      "Azure",
      "xUnit",
      "React",
      "Jest",
      "Scrum",
      "SAFe",
    ],
    projects: [
      {
        title: "Movi-info",
        shortDescription:
          "Aplicación de aprendizaje para gestión de información de películas. Desarrollada con **React** y **TypeScript** en el frontend, **DotNet Core 8** en el backend, siguiendo una arquitectura hexagonal y patrones DDD, Repository y Criteria. Implementa pruebas automáticas y está containerizada con **Docker**.",
        image: "/movi-info.png",
        projectLink: "http://194.164.174.221:8181",
        sourceLink: "https://github.com/ralvarez83/movi-info",
        dockerLink:
          "https://hub.docker.com/repository/docker/rubenag83/movi-info-react-dotnet-frontend",
      },
      {
        title: "Datos de Auto-Evaluaciones",
        shortDescription:
          "Aplicación web para procesar y visualizar datos de auto-evaluaciones de agilidad organizacional. Desarrollada con **ReactJs**, implementando parcialmente una **arquitectura Hexagonal**. Procesa archivos Excel de Microsoft Forms y genera visualizaciones gráficas. **Dockerizada** y desplegada en un servidor web.",
        image: "/graficas-auto-evaluacion.png",
        projectLink: "http://194.164.174.221:8080",
        sourceLink: "https://github.com/ralvarez83/selft-assesment-charts",
        dockerLink: "https://hub.docker.com/r/rubenag83/selft-assesment-charts",
      },
    ],
    languages: [
      { language: "Español", level: "Nativo" },
      { language: "Inglés", level: "Intermedio" },
    ],
  },
  en: {
    name: "Ruben Alvarez",
    title: "Back-end Developer",
    photo: "/photo.jpg",
    sections: {
      profile: "Profile",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      languages: "Languages",
    },
    profile:
      "I enjoy **software product development** and love working to the best of my ability, applying the **best practices** I know. I enjoy finding **new and better ways to do things**. I am always looking for **innovations** that can improve my work and the products I develop. I strive to **learn and adapt** to new technologies and methodologies. I am motivated by facing **challenges** that allow me to **grow professionally** and contribute significantly to the projects I am involved in. I greatly value **collaboration with my colleagues** as I believe that **teamwork improves results**. I strive every day to **improve my skills and knowledge** to make the most of the tools and technologies available to me.",
    experience: [
      {
        title: "Agile Coach / Trainer",
        company: "Estratecno",
        period: "Oct. 2019 - Jul. 2024",
        responsibilities: [
          "Implemented Scrum, Kanban, and SAFe in various companies, providing training and coaching.",
          "Practised TDD and BDD before promoting them along with DevOps to maximize agility effectiveness in development environments.",
        ],
      },
      {
        title: "Scrum Master / Agile Coach",
        company: "UST-Global",
        period: "Jun. 2018 - Oct. 2019",
        responsibilities: [
          "Helped work teams function more effectively by applying agile frameworks such as Scrum and specific adapted SAFe techniques.",
          "Quickly demonstrated project viability.",
        ],
      },
      {
        title: "Co-Founder – CTO",
        company: "Spika Tech",
        period: "Nov. 2015 - Feb. 2018",
        responsibilities: [
          "Led technology projects for clients such as BBVA and HP.",
          "Designed software solutions, managed teams, and selected key technologies.",
          "Sectors: Fintech, Medical Virtual Reality, 3D tools, tourism, and education.",
          "Managed client relationships and provided technical mentoring to the team.",
          "Technologies: **.Net Core**, **Azure**, **MySQL**, **SQL Server**, **PostgreSQL**, Xamarin, Stripe, Paypal, Unity3D, Unreal, Cuda, Angular JS, Java (Jersey and Spring), PHP, PhoneGap, etc.",
        ],
      },
      {
        title: "Co-Founder – CTO",
        company: "DreamTechnology",
        period: "Jan. 2013 - Nov. 2015",
        responsibilities: [
          "Directed e-commerce and logistics projects, designing software solutions and selecting technologies.",
          "Managed client relationships and provided technical mentoring to the team.",
          "Technologies: **.Net 4.5**, **Entity Framework** and **LINQ**, **Selenium**, **SQL Server**, PHP with Zend Framework and Doctrine, MySQL",
        ],
      },
      {
        title: "Previous Experiences",
        company: "",
        period: "May 2007 - Jan. 2013",
        responsibilities: [
          "**.NET 4.5 Instructor** - Innopulse Technology Advisors: **C#**, **VB**, **Entity Framework**, **LINQ**, **MVC**, **Web Services**, Security, and XML.",
          "**Senior Developer** - Kincubator: Java (REST API), Oauth2, Protege, Jena, SDB)",
          "**Senior Developer** - Innopulse Technology Advisors: **.NET 3.5**, TFS, TFS Build and **automated testing**",
          "**Junior Developer** - Innopulse Technology Advisors and Technology and Internet Development: **.NET 3.5** and Java (Servlets)",
        ],
      },
    ],
    education: [
      {
        degree: "Master's in Artificial Intelligence Research",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2008 - Jun. 2011",
      },
      {
        degree: "Degree in Software Engineering",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2009 - Jun. 2010",
      },
      {
        degree: "Master's in Computer Science and Technology",
        institution: "Universidad Carlos III de Madrid",
        period: "Sept. 2007 - Jun. 2008",
      },
      {
        degree: "Technical Engineering in Computer Systems",
        institution: "Universidad Politécnica de Madrid",
        period: "Sept. 2003 - Mar. 2007",
      },
    ],
    skills: [
      ".Net Core",
      "API REST",
      "Dockers",
      "DDD",
      "CQRS",
      "Hexagonal Architecture",
      "xUnit",
      "Azure",
      "xUnit",
      "React",
      "Jest",
      "Scrum",
      "SAFe",
    ],
    projects: [
      {
        title: "Movi-info",
        shortDescription:
          "Learning application for movie information management. Developed with **React** and **TypeScript** for the frontend, **DotNet Core 8** for the backend, following a hexagonal architecture and DDD, Repository, and Criteria patterns. It implements automated tests and is containerized with **Docker**.",
        image: "/movi-info.png",
        projectLink: "http://194.164.174.221:8181",
        sourceLink: "https://github.com/ralvarez83/movi-info",
        dockerLink:
          "https://hub.docker.com/repository/docker/rubenag83/movi-info-react-dotnet-frontend",
      },
      {
        title: "Self-Assessment Data",
        shortDescription:
          "Web application for processing and visualizing organizational agility self-assessment data. Developed with **ReactJs**, partially implementing a **Hexagonal architecture**. Processes Microsoft Forms Excel files and generates graphical visualizations. **Dockerized** and deployed on a web server.",
        image: "/graficas-auto-evaluacion.png",
        projectLink: "http://194.164.174.221:8080",
        sourceLink: "https://github.com/ralvarez83/selft-assesment-charts",
        dockerLink: "https://hub.docker.com/r/rubenag83/selft-assesment-charts",
      },
    ],
    languages: [
      { language: "Spanish", level: "Nativo" },
      { language: "Inglés", level: "Intermedio" },
    ],
  },
};
