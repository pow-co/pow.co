import { useState } from 'react';
import HandCashService from '../services/HandCashService';
import SessionTokenRepository from '../repositories/SessionTokenRepository';
import CodeSnippet from '../components/CodeSnippet';

export function getServerSideProps({ query }: any) {
  const { sessionToken } = query;
  const redirectionUrl = new HandCashService().getRedirectionUrl();
  try {
    return {
      props: {
        redirectionUrl,
        sessionToken: sessionToken || false,
        user: sessionToken ? SessionTokenRepository.decode(sessionToken).user : false,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        redirectionUrl,
        sessionToken: false,
        user: false,
      },
    };
  }
}

const codeExample = '// Pay 0.05 USD to yourself\n'
    + 'const {HandCashConnect} = require(\'@handcash/handcash-connect\');\n'
    + 'const handCashConnect = new HandCashConnect({\n'
    + '\tappId: \'<app-id>\',\n'
    + '\tappSecret: \'<secret>\',\n'
    + '});\n'
    + '\n'
    + 'const paymentParameters = {\n'
    + '\tpayments: [{ destination: \'your-handle\', currencyCode: \'USD\', sendAmount: 0.05 }]\n'
    + '};\n'
    + 'await account.wallet.pay(paymentParameters);\n';

interface ServerProps {
  redirectionUrl: string;
  sessionToken: string;
  user: any;
}

export default function Home({ redirectionUrl, sessionToken, user }: ServerProps) {
  console.log('AuthHandcash', { redirectionUrl, sessionToken, user });

  const [paymentResult, setPaymentResult] = useState<any>({ status: 'none' });

  const pay = async () => {
    setPaymentResult({ status: 'pending' });
    const response = await fetch(
      '/api/v1/pay',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );
    setPaymentResult(await response.json());
  };

  const onDisconnect = async () => {
    window.location.href = '/';
  };

  if (!sessionToken) {
    return (
      <div className="flex grow flex-col items-center justify-end self-start p-6">
        <h1 className="mb-12 text-5xl">
          Welcome to
          {' '}
          <a
            className="text-brandLight hover:text-brandLight/90"
            target="_blank"
            rel="noreferrer"
            href="https://docs.handcash.io/docs/overview-1"
          >
            HandCash Connect
          </a>
        </h1>

        <a
          href={redirectionUrl}
          className="bg-darkBackground-900 group m-6 flex w-full items-center gap-x-6 rounded-xl border p-4 hover:border-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>

          <div className="grow">
            <p className="text-brandLight text-lg font-bold">Run this code</p>
            <p className="text-base">Connect your HandCash account to this app to run the code below</p>
          </div>
        </a>

        <CodeSnippet code={codeExample} />
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center justify-end self-start p-6">
      <div className="mb-4 flex w-full items-end justify-between">
        <div className="group flex items-center gap-x-1">
          <div className="bg-darkBackground-900 m-0 rounded-full border hover:bg-white/5">
            <div className="flex gap-x-3 pr-6">
              <img
                src={user.avatarUrl}
                className="inline-block h-8 w-8 rounded-full border-y border-r border-white/50"
              />
              <div className="flex flex-col items-start justify-center gap-y-0.5">
                <span className="font-bold leading-4 text-white/90">
                  $
                  {user.handle}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="invisible rounded-lg border border-transparent bg-white/20 px-3 py-1.5 text-xs font-semibold text-red-400 shadow-sm shadow-white/20 hover:border-red-500/30 hover:text-red-500 group-hover:visible"
            onClick={onDisconnect}
            onKeyDown={onDisconnect}
          >
            Disconnect
          </button>
        </div>
        <button
          type="button"
          className={`from-brandNormal to-brandDark flex h-8 items-center rounded-full border bg-gradient-to-r px-4 text-sm font-semibold hover:cursor-pointer hover:opacity-90${paymentResult?.status === 'pending' ? 'animate-pulse' : ''}`}
          onClick={paymentResult?.status === 'pending' ? () => {} : pay}
          onKeyDown={paymentResult?.status === 'pending' ? () => {} : pay}
        >
          <p>
            {paymentResult?.status === 'pending' ? 'Running...' : 'Run this code'}
          </p>
        </button>
      </div>
      <CodeSnippet code={codeExample.replace('your-handle', user.handle)} />

      {paymentResult.status === 'sent'
                && (
                <div className="border-brandLight bg-brandLight/5 m-6 flex w-full items-center gap-x-6 rounded-xl border p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-brandLight h-10 w-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-bold text-white">Payment sent!</p>
                    <a
                      className="text-white/70"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://app.handcash.io/#/payment/${paymentResult.transactionId}`}
                    >
                      Open in HandCash
                    </a>
                  </div>
                </div>
                )}
      {paymentResult.status === 'error'
                && (
                <div
                  className="bg-red-500/3 m-6  flex w-full items-center gap-x-6 rounded-xl border border-red-400 p-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-10 w-10 text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <div>
                    <p className="text-lg font-bold text-white">Payment failed</p>
                    <p className="text-white/70">{paymentResult.message}</p>
                  </div>
                </div>
                )}
    </div>
  );
}
