import type { NextApiRequest, NextApiResponse } from 'next';
import AuthTokenRepository from '../../../../repositories/AuthTokenRepository';
import HandCashService from '../../../../services/HandCashService';
import SessionTokenRepository from '../../../../repositories/SessionTokenRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(404);
  }
  try {
    const { authorization } = req.headers;
    const sessionToken = authorization?.split(' ')[1];
    if (!sessionToken) {
      return res.status(401).json({ error: 'Missing authorization.' });
    }

    const { sessionId, user } = SessionTokenRepository.verify(sessionToken);
    const authToken = AuthTokenRepository.getById(sessionId);
    if (!authToken) {
      return res.status(401).json({ status: 'error', error: 'Expired authorization.' });
    }
    const paymentResult = await new HandCashService(authToken).pay({
      destination: user.handle, amount: 0.05, currencyCode: 'USD',
    });
    return res.status(200).json({ status: 'sent', transactionId: paymentResult.transactionId });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ status: 'error', message: error.toString() });
  }
}
