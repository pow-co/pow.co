
import {useState} from "react";
import HandCashService from "../services/HandCashService";
import SessionTokenRepository from "../repositories/SessionTokenRepository";

import { useRouter } from 'next/router'

import { useHandCash } from "../context/HandCashContext";

interface ServerProps {
    sessionToken: string;
    user: any;
}

export default function Home({sessionToken, user}: ServerProps) {
    console.log('AuthHandcash', { sessionToken, user })

    const [paymentResult, setPaymentResult] = useState<any>({status: 'none'});

    const { handcashPaymail, handcashAuthenticate, handcashAuthenticated, handcashLogout, setHandCashAuthToken } = useHandCash()

    const router = useRouter()

    console.log('query', router.query)

    new HandCashService(router.query.authToken).getProfile().then(({ publicProfile }) => {

      const payload = {
        user: {
          handle: publicProfile.handle,
          displayName: publicProfile.displayName,
          avatarUrl: publicProfile.avatarUrl,
        },
      };

      console.log(payload)

    })


    return (
        <div className="flex flex-grow flex-col items-center justify-end self-start p-6">
        </div>
    )
}
