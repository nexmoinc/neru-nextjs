import { neru } from 'neru-alpha'
import {getURL} from '@/models/url'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    switch (method) {
        case 'GET':
            const url = await getURL();
            return res.status(200).json({ result: url })
        default:
            res.setHeader('Allow', ['GET'])
            return res.status(405).end(`Method ${method} Not Allowed`)
    }
}
