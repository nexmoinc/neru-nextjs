import { addKey, getKey } from '@/models/keys';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function userHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, query } = req;

    const key: string = query.key as string;

    if (!key) {
        return res.status(404)
    }

    switch (method) {
        case 'POST':
            await addKey(key)
            res.status(200).json({ result: 'OK' })
            break
        case 'GET':
            const result = await getKey(key);

            if (!result) {
                return res.status(404).json({ error: 'key not found' })
            }

            return res.status(200).json({ result: JSON.parse(result) })

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}