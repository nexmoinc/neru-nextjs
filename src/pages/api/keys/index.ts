// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getKeys, deleteKeys } from '@/models/keys'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const keys = await getKeys();
      return res.status(200).json({ result: keys })
    case "DELETE":
      await deleteKeys();
      return res.status(200).json({ result: 'OK' })
    default:
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
