
import type { NextApiRequest, NextApiResponse } from 'next';
import HandCashService from '../../../../services/HandCashService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const authToken = String(req.query.authToken);

  if (!authToken) {
    return res.status(400).json({ message: 'authToken is required' });
  }

  try {

    const { publicProfile } = await new HandCashService(authToken).getProfile();

    return res.json(publicProfile)

  } catch(error: any) {

    return res.status(400).json({ message: error.message });

  }

}
