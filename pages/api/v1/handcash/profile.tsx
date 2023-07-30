
import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';
import AuthTokenRepository from '../../../../repositories/AuthTokenRepository';
import HandCashService from '../../../../services/HandCashService';
import SessionTokenRepository from '../../../../repositories/SessionTokenRepository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const authToken = String(req.query.authToken);

  console.log("auth token", authToken)

  if (!authToken) {
    return res.status(400).json({ message: 'authToken is required' });
  }

  console.log("auth token", authToken)

  try {

    const { publicProfile } = await new HandCashService(authToken).getProfile();

    /*const payload = {
      publicProfile
    };
    */

    //const sessionToken = SessionTokenRepository.generate(payload);
    //AuthTokenRepository.setAuthToken(authToken, payload.sessionId);

    //console.log('session', { payload, sessionToken });

    return res.json(publicProfile)

  } catch(error: any) {

    return res.status(400).json({ message: error.message });

  }

}
