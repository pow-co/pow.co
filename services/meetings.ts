import axios from "axios";

export interface Meeting {
    title: string;
    description: string;
    start: number;
    end: number;
    location: string;
    status: string;
    url: string;
    inviteRequired: boolean;
    organizer: string;
    origin: string;
}

export async function getMeeting({ txid }: {txid: string}): Promise<Meeting | null> {

    try {

        const { data } = await axios.get(`https://pow.co/api/v1/meetings/${txid}`)

        return data.meeting as Meeting

    } catch(error) {

        return null

    }



}
