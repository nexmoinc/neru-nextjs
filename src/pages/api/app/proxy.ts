import { getProxyURL, setProxyURL } from '@/models/proxy';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, body } = req;

    const url: string = body.url;

    switch (method) {
        case 'PUT':
            await setProxyURL(url);
            return res.status(200).json({ result: 'OK' })
        case 'GET':
            const result = await getProxyURL();
            return res.status(200).json({ result: result })
        default:
            res.setHeader('Allow', ['GET'])
            return res.status(405).end(`Method ${method} Not Allowed`)
    }
}
