// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getKeys } from '@/models/keys'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const keys = await getKeys();
  res.status(200).json({data: keys})
}
