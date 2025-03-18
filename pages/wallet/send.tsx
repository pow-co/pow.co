import React, { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useBitcoin } from '../../context/BitcoinContext';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';
import Drawer from '../../components/Drawer';
import WalletProviderPopUp from '../../components/WalletProviderPopUp';

const WalletSendPage = () => {
    const { authenticated, wallet, paymail } = useBitcoin();
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);
    const router = useRouter();

    const handleCopyPaymail = (e:any) => {
        e.preventDefault();
        if (paymail) {
            navigator.clipboard.writeText(paymail).then(() => toast('Copied to clipboard', {
                icon: '✅',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
            }));
        }
    };
    const handleBack = (e:any) => {
        e.preventDefault();
        router.back();
    };

    const handleCloseWalletPopup = useCallback(() => {
        setWalletPopupOpen(false);
    }, [setWalletPopupOpen]);

    if (!authenticated && wallet !== "local") {
        return (
            <>
            <ThreeColumnLayout>
                <div className="mt-5 h-screen sm:mt-10">
                    <p className="py-5 text-center text-lg">To access this feature, please sign in with your seed phrase.</p>
                    <div
                      onClick={() => setWalletPopupOpen(true)}
                      className="relative flex h-8 cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-base font-semibold leading-4 text-white  transition duration-500 hover:-translate-y-1"
                    >
                        <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                        <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
                        </svg>
                        <span className="ml-4"><FormattedMessage id="Connect wallet" /></span>
                    </div>
                </div>
            </ThreeColumnLayout>
            <Drawer
              selector="#walletProviderPopupControler"
              isOpen={walletPopupOpen}
              onClose={handleCloseWalletPopup}
            >
                <WalletProviderPopUp onClose={handleCloseWalletPopup} />
            </Drawer>
            </>
        );
    }
  return (
    <ThreeColumnLayout>
            <div className="mt-5 min-h-screen sm:mt-10">
                <div className=" bg-primary-100 p-5 dark:bg-primary-700/20 sm:rounded-xl">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex w-full justify-between">
                            <button type="button" onClick={handleBack} className="hidden opacity-80 sm:block">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <div className="grow" />
                            <button type="button" onClick={handleCopyPaymail} id="wallet_paymail" className="cursor-pointer opacity-50 sm:-ml-6">{paymail}</button>
                            <div className="grow" />
                        </div>
                        <Tooltip
                          anchorSelect="#wallet_paymail"
                          style={{ width: "fit-content", borderRadius: "4px" }}
                          place="bottom"
                          className="text-white dark:bg-gray-100 dark:text-black"
                        >
                            Copy to clipboard
                        </Tooltip>
                        <div className="m-5 flex w-full flex-col items-center justify-center" />
                    </div>
                </div>
            </div>
    </ThreeColumnLayout>
  );
};

export default WalletSendPage;
