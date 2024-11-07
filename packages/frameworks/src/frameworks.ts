import { Framework } from './types';

export const frameworks: Framework[] = [
  {
    name: 'React.js',
    slug: 'reactjs',
    logo: 'https://assets.redge.dev/frameworks/logo/react.svg',
    description: 'The library for web and native user interfaces',
  },
  {
    name: 'Vue.js',
    slug: 'vuejs',
    logo: 'https://assets.redge.dev/frameworks/logo/vue.svg',
    description:
      'An approachable, performant and versatile framework for building web user interfaces.',
  },
  {
    name: 'Angular',
    slug: 'angular',
    logo: 'https://assets.redge.dev/frameworks/logo/angular.svg',
    description:
      'Angular is a web framework that empowers developers to build fast, reliable applications.',
  },
  {
    name: 'Svelte',
    slug: 'svelte',
    logo: 'https://assets.redge.dev/frameworks/logo/svelte.svg',
    description:
      'Svelte is a framework for building user interfaces on the web.',
  },
  {
    name: 'Other',
    slug: 'other',
    logo: 'https://assets.redge.dev/frameworks/logo/other.svg',
    description: 'No framework or an unoptimized framework.',
  },
] as const;
