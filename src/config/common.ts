export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://data-list-collaborative.vercel.app',
  'https://simplists.net',
  'https://www.simplists.net',
  'ws://ws.simplists.net',
  'wss://ws.simplists.net',
];

export const corsOptions = {
  origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean) => void) => {
    if ((origin && allowedOrigins.indexOf(origin) !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('not allowed by CORS policies'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
