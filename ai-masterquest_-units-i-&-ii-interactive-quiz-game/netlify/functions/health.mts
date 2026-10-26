import type { Config } from '@netlify/functions';

export default async () => {
  return Response.json({
    status: 'ok',
    hasAiKey: true,
    model: 'gemini-3.8-flash',
  });
};

export const config: Config = {
  path: '/api/health',
};
