import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useYoursWallet, YoursProvider as ExternalYoursProvider } from 'yours-wallet-provider';
import { useLocalStorage } from "../utils/storage";
import { config } from "../template_config";
import YoursWallet from '../wallets/yours';

// Import the actual YoursProvider from the package

type YoursContextValue = {
  yoursWallet: YoursWallet | undefined | null;
  yoursAuthenticate: () => Promise<void>;
  yoursAuthenticated: boolean;
  yoursLogout: () => Promise<void>;
  yoursAvatar: string | undefined;
  yoursPaymail: string | undefined;
  yoursUserName: string | undefined;
  yoursPublicKey: string | undefined;
  ready: boolean;
};

const YoursContext = createContext<YoursContextValue | undefined>(undefined);

// This is our custom provider that will be used within our app
const YoursContextProvider = (props: { children: React.ReactNode }) => {
  // Get the wallet instance from the yours-wallet-provider
  const wallet = useYoursWallet();
  const [yoursPaymail, setYoursPaymail] = useLocalStorage(`${config.appname}__YoursProvider_paymail`);
  const [yoursUserName, setYoursUserName] = useLocalStorage(`${config.appname}__YoursProvider_username`);
  const [yoursPublicKey, setYoursPublicKey] = useLocalStorage(`${config.appname}__YoursProvider_publicKey`);
  const [yoursWallet, setYoursWallet] = useState<YoursWallet | null | undefined>();
  const [ready, setReady] = useState(false);

  const yoursAvatar = useMemo(
() => 
    (yoursUserName ? `https://api.dicebear.com/6.x/pixel-art/svg?seed=${yoursUserName}` : undefined), 
    [yoursUserName],
  );

  const yoursAuthenticate = useCallback(async () => {
    if (!wallet?.isReady) {
      window.open("https://yours.org", "_blank");
      return;
    }

    try {
      const identityPubKey = await wallet.connect();
      
      if (identityPubKey) {
        setYoursPublicKey(identityPubKey);
        
        // In a real implementation, you might want to fetch the paymail and username
        // from the Yours API using the public key
        const tempPaymail = `${identityPubKey.substring(0, 8)}@yours.org`;
        setYoursPaymail(tempPaymail);
        setYoursUserName(`Yours User ${identityPubKey.substring(0, 6)}`);
        
        setYoursWallet(new YoursWallet(wallet));
      }
    } catch (error) {
      console.error('Yours wallet authentication error:', error);
    }
  }, [wallet, setYoursPaymail, setYoursPublicKey, setYoursUserName]);

  const yoursLogout = useCallback(async () => {
    if (wallet) {
      await wallet.disconnect();
    }
    
    setYoursPaymail(undefined);
    setYoursUserName(undefined);
    setYoursPublicKey(undefined);
    setYoursWallet(null);
  }, [wallet, setYoursPaymail, setYoursUserName, setYoursPublicKey]);

  useEffect(() => {
    if (wallet?.on) {
      wallet.on('switchAccount', () => {
        console.log('switchAccount');
        // Re-authenticate when account is switched
        yoursAuthenticate();
      });

      wallet.on('signedOut', () => {
        console.log('signedOut');
        yoursLogout();
      });
    }
    
    setReady(true);
  }, [wallet, yoursAuthenticate, yoursLogout]);

  const yoursAuthenticated = useMemo(() => !!yoursPublicKey, [yoursPublicKey]);

  const value = useMemo(
    () => ({
      yoursWallet,
      yoursAuthenticate,
      yoursAuthenticated,
      yoursLogout,
      yoursAvatar,
      yoursPaymail,
      yoursUserName,
      yoursPublicKey,
      ready,
    }),
    [
      yoursWallet,
      yoursAuthenticate,
      yoursAuthenticated,
      yoursLogout,
      yoursAvatar,
      yoursPaymail,
      yoursUserName,
      yoursPublicKey,
      ready,
    ],
  );

  return <YoursContext.Provider value={value} {...props} />;
};

const useYours = () => {
  const context = useContext(YoursContext);
  if (context === undefined) {
    throw new Error("useYours must be used within a YoursProvider");
  }
  return context;
};

// Create a combined provider that wraps our context provider with the external provider
const YoursProvider = ({ children }: { children: React.ReactNode }) => (
    <ExternalYoursProvider>
      <YoursContextProvider>{children}</YoursContextProvider>
    </ExternalYoursProvider>
  );

export { YoursProvider, useYours }; 
