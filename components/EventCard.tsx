import Link from 'next/link';
import React from 'react'
import UserIcon from './UserIcon';
import { transaction } from 'boostpow';
import moment from 'moment';

export interface EventCardProps {
    transaction: string;
    admin: Player;
    eventTitle: string;
    eventCoverImage?: string;
    startDate: Date;
    startTime: string;
    endDate?: Date;
    endTime?: string;
    invitesRequired: boolean;
    invitees: Player[];
    attendees: Player[];
}

//TODO improve this
interface Player {
  name: string;
  paymail?: string;
  avatar?: string;
}

const EventCard = ({ admin, attendees, eventCoverImage, invitees, endDate, endTime, eventTitle, startDate, startTime, transaction }: EventCardProps) => {
  return (
    <div className='flex flex-col'>
      <img alt={`Event ${transaction} Cover Image`} src={eventCoverImage} className="rounded-xl h-56 w-full grid object-cover"/>
      <p className='mt-2 text-sm opacity-50'>
        <span>Starts {moment(startDate).format('MMMM Do YYYY')} at {startTime}</span>

        {endDate && endTime &&<><span className='mx-2'>-</span><span>Ends {moment(endDate).format('MMMM Do YYYY')} at {endTime}</span></>}
        </p>
      <h2 className='text-2xl font-bold'>{eventTitle}</h2>
      <p className='text-sm opacity-50'>
        <span>{invitees.length} invitees</span>
        <span className='mx-2'>-</span>
        <span>{attendees.length} attending</span>
      </p>
    </div>
  )
}

export default EventCard