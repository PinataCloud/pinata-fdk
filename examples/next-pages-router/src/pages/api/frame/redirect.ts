import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    res.redirect(302, 'https://github.com/PinataCloud/pinata-fdk/blob/main/examples/next-pages-router')
}
