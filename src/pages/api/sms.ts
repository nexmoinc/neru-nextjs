// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { hasQuota, incrementQuota } from '@/models/quota'
import { keyExists } from '@/models/keys';
import { getProxyURL } from '@/models/proxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const { from, text, to, api_key, api_secret } = body;
  const today = new Date().toISOString().slice(0, 10);

  if (!from) {
    return res.status(400).json({ error: 'body.from not found' })
  }

  if (!text) {
    return res.status(400).json({ error: 'body.text not found' })
  }

  if (!to) {
    return res.status(400).json({ error: 'body.to not found' })
  }

  if (!api_key) {
    return res.status(400).json({ error: 'body.api_key not found' })
  }

  if (!api_secret) {
    return res.status(400).json({ error: 'body.api_secret not found' })
  }

  if (typeof api_key !== 'string') {
    return res.status(400).json({ error: 'api_key should be a string' })
  }

  switch (method) {
    case 'POST':
      if (!await keyExists(api_key)) {
        return res.status(404).json({ error: `api_key:${api_key} not found` })
      }

      if (!await hasQuota(api_key, today)) {
        return res.status(403).json({ error: `quota for key:${api_key} for date:${today} has been exceeded` })
      }

      const proxy_url: string = await getProxyURL();

      await fetch(proxy_url, {
        "method": "POST",
        "headers": {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, api_key, api_secret, text })
      });

      incrementQuota(api_key, today);

      res.status(200).json({ result: 'OK' })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
