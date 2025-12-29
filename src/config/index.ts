export interface AppConfig {
  webinar: {
    targetDate: string; // ISO date string
  };
  contact: {
    email: string;
  };
}

export const config: AppConfig = {
  webinar: {
    targetDate: '2026-02-02T19:00:00', 
  },
  contact: {
    email: 'contact@bigmikelabs.pl',
  },
};

export default config;
