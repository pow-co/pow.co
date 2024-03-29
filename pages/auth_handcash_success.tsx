
import {useState} from "react";

import HandCashService from "../services/HandCashService";

import { useRouter } from 'next/router'

import { useEffect } from 'react'

import { useHandCash } from "../context/HandCashContext";

import { useBitcoin } from "../context/BitcoinContext";

interface ServerProps {
    sessionToken: string;
    user: any;
}

export default function Home({sessionToken, user}: ServerProps) {

    const [paymentResult, setPaymentResult] = useState<any>({status: 'none'});

    const { setWallet } = useBitcoin()

    const { setProfileFromAuthToken } = useHandCash()

    const router = useRouter()

    useEffect(() => {

      const authToken = router.query.authToken

      if (!authToken) { return }

      setProfileFromAuthToken({ authToken: String(authToken) }).then(() => {

        setWallet('handcash')

        router.push('/settings')

      })

    }, [router.query])

    return (
        <div className="flex flex-grow flex-col items-center justify-end self-start p-6">
        </div>
    )
}
