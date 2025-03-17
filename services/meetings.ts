import axios from "axios";

export interface Meeting {
    title: string;
    cover?: string;
    description: string;
    start: number;
    end: number;
    location: string;
    status: string;
    url: string;
    inviteRequired: boolean;
    organizer: string;
    origin: string;
    attendees?: any[];
    invitees?: any[];
    ticketPrice: number;
}

export async function getMeeting({ txid }: { txid: string }): Promise<Meeting | null> {

    try {

        const { data } = await axios.get(`https://www.pow.co/api/v1/meetings/${txid}`);

        return data.meeting as Meeting;

    } catch (error) {

        return null;

    }

}
