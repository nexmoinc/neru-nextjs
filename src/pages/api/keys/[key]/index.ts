import { addKey, keyExists } from '@/models/keys';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function userHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, query } = req;
    const today = new Date().toISOString().slice(0, 10);

    const key: string = query.key as string;

    if (!key) {
        return res.status(404)
    }

    switch (method) {
        case 'POST':
            if (await keyExists(key)) {
                return res.status(400).json({ error: `key:${key} already exists` })
            }

            await addKey(key, today);
            res.status(200).json({ result: 'OK' })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}