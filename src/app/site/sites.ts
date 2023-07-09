export interface Site {
  name: string;
  apiKey: string;
  group?: string;
};

export const SITES: Site[] = [
  {
    name: 'Jumpsquare Amsterdam',
    apiKey: 'jumpsquareamsterdam',
    group: 'reserveren'
  },
  {
    name: 'Street Jump Diemen',
    apiKey: 'sjdiemen'
  }
];
