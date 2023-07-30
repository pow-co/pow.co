
import {useState} from "react";

import HandCashService from "../services/HandCashService";

import { useRouter } from 'next/router'

import { useEffect } from 'react'

import { useHandCash } from "../context/HandCashContext";

interface ServerProps {
    sessionToken: string;
    user: any;
}

export default function Home({sessionToken, user}: ServerProps) {
    console.log('AuthHandcash', { sessionToken, user })

    const [paymentResult, setPaymentResult] = useState<any>({status: 'none'});

    const { setProfileFromAuthToken } = useHandCash()

    const router = useRouter()

    console.log('query', router.query)

    const authToken = String(router.query.authToken)

    if (!authToken) {

      router.push('/settings')

    }

    useEffect(() => {

      setProfileFromAuthToken({ authToken }).then(() => {

        router.push('/settings')

      })

    }, [])

    return (
        <div className="flex flex-grow flex-col items-center justify-end self-start p-6">
        </div>
    )
}
