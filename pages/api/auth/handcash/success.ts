import {v4 as uuidv4} from 'uuid';
import AuthTokenRepository from "../../../../repositories/AuthTokenRepository";
import HandCashService from "../../../../services/HandCashService";
import SessionTokenRepository from "../../../../repositories/SessionTokenRepository";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>)
    
{

    var authToken = String(req.query.authToken)

    if (!authToken) {
        return res.status(400).json({message: 'authToken is required'});
    }

    const {publicProfile} = await new HandCashService(authToken).getProfile();

    const payload = {
        sessionId: uuidv4(),
        user: {
            handle: publicProfile.handle,
            displayName: publicProfile.displayName,
            avatarUrl: publicProfile.avatarUrl,
        },
    };
    const sessionToken = SessionTokenRepository.generate(payload);
    AuthTokenRepository.setAuthToken(authToken, payload.sessionId);

    console.log('session', { payload, sessionToken})

    //setHandCashAuthToken(authToken)
    //setHandCashSessionToken(sessionToken)

    return res.redirect(`/auth_handcash_new/?sessionToken=${sessionToken}`);
}