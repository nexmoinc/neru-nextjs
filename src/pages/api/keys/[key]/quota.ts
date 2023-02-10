import { setQuota, getQuota } from '@/models/quota';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function userHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, body, query } = req;
    const { key } = query;
    const date: string = body.date;
    const quota: number = body.quota;

    let apiKey;

    if (typeof key === 'string') {
        apiKey = key;
    } else {
        return res.status(400).json({ error: 'api_key not found' })
    }

    switch (method) {
        case 'POST':
            if (!date) {
                return res.status(400).json({ error: 'body.date not found' })
            }

            if (quota == null) {
                return res.status(400).json({ error: 'body.quota not found' })
            }

            if (typeof quota !== 'number') {
                return res.status(400).json({ error: 'body.quota is not a number' })
            }

            await setQuota(key, date, quota)
            return res.status(200).json({ result: 'OK' })
        case 'GET':
            const result = await getQuota(key, date)
            console.log(result)
            return res.status(200).json({ result: result })
        default:
            res.setHeader('Allow', ['POST', 'GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
