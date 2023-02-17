
import {Environments, HandCashConnect} from "@handcash/handcash-connect";

const appId: string = String(process.env.handcash_app_id);
const appSecret: string = String(process.env.handcash_app_secret);

const handCashConnect = new HandCashConnect({
    appId: appId,
    appSecret: appSecret,
});

export default class HandCashService {
    account: any;
    constructor(authToken?: string) {
        if (authToken) {
            this.account = handCashConnect.getAccountFromAuthToken(authToken);
        }
    }

    async getProfile() {
        return this.account.profile.getCurrentProfile();
    }

    async pay({destination, amount, currencyCode}: { destination: string, amount: number, currencyCode: string }) {
        return this.account.wallet.pay({
            payments: [
                {destination, amount, currencyCode},
            ],
            description: 'Testing Connect SDK',
        });
    }

    getRedirectionUrl() {
        return handCashConnect.getRedirectionUrl();
    }
}