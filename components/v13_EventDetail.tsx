'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import { Meeting } from '../services/meetings'
import Drawer from './v13_Drawer';
import BoostPopup from './v13_BoostpowButton/BoostPopup';

interface EventDetailCardProps {
    meeting: Meeting;
}
const EventDetailCard = ({meeting}:EventDetailCardProps) => {
    const [boostPopupOpen, setBoostPopupOpen] = useState(false)

    const handleBuy = (e:any) => {
        e.preventDefault()
    }

    const handleBoost = (e:any) => {
        e.preventDefault()
        setBoostPopupOpen(true)
    }
  return (
    <>
    <div className='grid grid-cols-2 gap-5 min-h-screen mt-5 mb-24 sm:mb-0'>
        <div className='px-5 col-span-2 sm:hidden'>
            <h2 className='text-3xl font-bold break-words whitespace-pre-line'>{meeting.title}</h2>
            {<p className='mt-1 truncate'>By <span className='truncate w-44 text-lg font-semibold bg-gradient-to-r from-primary-400  to-primary-800 text-transparent bg-clip-text'><Link href={`/profile/${meeting.organizer}`}>{meeting.organizer}</Link></span></p>}
            <p className='mt-1 opacity-50'>{meeting.description}</p>
        </div>
        <div className='sm:pl-10 col-span-2 sm:col-span-1'>
            <div className='h-[333px] sm:h-[420px] w-full flex flex-col justify-center items-center overflow-hidden relative sm:rounded-t-lg bg-primary-200 dark:bg-primary-800/20'>
                <img className='h-full w-full object-contain select-none' src={meeting.cover || "https://dogefiles.twetch.app/793eaf19c59f24a20c3671024f5d3f4b4892e8b06f5b8973038a5a7e9505b02d"}/>
            </div>
            <div className='bg-primary-100 dark:bg-primary-600/20 sm:rounded-b-lg p-5'>
                {/* <div onClick={() => setExpandList(!expandList)} className={`flex justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 ${expandList ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}>
                    <div className='flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-green-500 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        <p className='ml-2 font-bold'>List for sale</p>
                    </div>
                    <div>
                        {expandList ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>)
                                : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>)
                        }
                    </div>
                </div>
                {expandList && (
                <div className='flex flex-wrap sm:flex-nowrap justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-b-lg cursor-pointer'>
                    <div className='relative w-full mb-3 sm:mb-0 sm:mr-8'>
                        <input 
                            type='number' 
                            value={listAmount} 
                            onChange={handleChangeListAmount} 
                            placeholder='Amount'
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className='absolute inset-y-0 right-0 flex items-center'>
                            <label htmlFor="currency" className="sr-only">Currency</label>
                            <p className='pr-3 opacity-50'>BSV</p>
                        </div>
                    </div>
                    <button className='w-full sm:w-44 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1' onClick={handleList}>
                        List for sale
                    </button>
                </div>    
                )}
                <div onClick={() => setExpandTransfer(!expandTransfer)} className={`mt-5 flex justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 ${expandTransfer ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}>
                    <div className='flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                        <p className='ml-2 font-bold'>Transfer Item</p>
                    </div>
                    <div>
                        {expandTransfer ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>)
                                : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>)
                        }
                    </div>
                </div>
                {expandTransfer && (
                <div className='flex flex-wrap sm:flex-nowrap justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-b-lg cursor-pointer'>
                    <div className='relative w-full mb-3 sm:mb-0 sm:mr-8'>
                        <input 
                            type='text' 
                            autoComplete='off'
                            value={transferAddress} 
                            onChange={handleChangeTransferAddress} 
                            placeholder='Send to Bitcoin address'
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <button className='w-full sm:w-44 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1' onClick={handleTransfer}>
                        Send
                    </button>
                </div>    
                )} */}
                <button onClick={handleBuy} className={`mt-5 flex w-full justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-lg cursor-pointer`}>
                    <div className="flex">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 2499.6 2500" viewBox="0 0 2499.6 2500"><path d="m2499.6 1250c0 690.2-559.6 1249.8-1250.1 1249.9-690 0-1249.6-559.7-1249.5-1250-.2-690.3 559.4-1249.9 1249.7-1249.9s1249.9 559.7 1249.9 1250z" fill="#eab300"/><g fill="#fff"><path d="m1741.5 943.8c-16.1-167.4-160.6-223.5-343.2-239.5v-232.3h-141.3v226.1c-37.1 0-75.1.7-112.8 1.5v-227.6h-141.3l-.1 232.1c-30.6.6-60.7 1.2-90 1.2v-.7l-194.9-.1v151s104.4-2 102.6-.1c57.3 0 75.9 33.2 81.3 61.9v264.6c4 0 9.1.2 14.9 1h-14.9l-.1 370.7c-2.5 18-13.1 46.7-53.1 46.8 1.8 1.6-102.7 0-102.7 0l-28.1 168.8h184c34.2 0 67.9.6 100.9.8l.1 234.9h141.2v-232.4c38.7.8 76.2 1.1 112.9 1.1l-.1 231.3h141.3v-234.4c237.6-13.6 404.1-73.5 424.7-296.7 16.7-179.7-67.8-260-202.7-292.4 82.1-41.6 133.4-115.1 121.4-237.6zm-197.8 502.2c0 175.5-300.5 155.6-396.4 155.6v-311.3c95.9.2 396.4-27.3 396.4 155.7zm-65.8-439.1c0 159.7-250.8 141-330.6 141.1v-282.2c79.9 0 330.7-25.4 330.6 141.1z"/>
                        <path d="m902 1175.7h21v15.5h-21z"/></g>
                        </svg>
                        <p className="ml-2 font-bold">Buy a ticket Now</p>
                    </div>
                    <div className="flex">
                        <p className="font-bold mr-5">{meeting.ticketPrice! * 1e-8 || 0} BSV</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </button>
                <button 
                    onClick={handleBoost} 
                    className={`mt-5 flex w-full justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-lg cursor-pointer`}
                >
                    <div className="flex">
                        <svg strokeWidth={1}  className='h-6 w-6 stroke-blue-500' viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="transparent" d="M8.63087 4.58404C8.63087 6.17213 7.73487 7.5501 6.42172 8.24224C5.84707 8.54502 5.19204 6.51507 4.49688 6.51507C3.76151 6.51507 3.07249 8.57593 2.4762 8.24224C1.21561 7.5347 0.365967 6.13196 0.365967 4.58404C0.365967 2.30382 2.21666 0.453125 4.49688 0.453125C6.77705 0.453125 8.63087 2.30075 8.63087 4.58404Z" />
                        </svg>
                        <p className="ml-2 font-bold">Boost</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
        <div className='col-span-2 sm:col-span-1 sm:pr-10'>
            <div className='hidden sm:block'>
                <h2 className='text-3xl font-bold break-words whitespace-pre-line'>{meeting.title}</h2>
                <p className='mt-1 truncate'>
                    By <span className='text-lg font-semibold bg-gradient-to-r from-primary-400  to-primary-800 text-transparent bg-clip-text'>
                        <Link href={`/profile/${meeting.organizer}`}>
                            {meeting.organizer}
                        </Link>
                        </span>
                </p>
                <p className='mt-1 opacity-50'>{meeting.description}</p>
            </div>
            <div className='mt-5 bg-primary-100 dark:bg-primary-600/20 p-5 sm:rounded-lg'>
                <h3 className='text-xl font-bold mb-5'>Event Details</h3>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Start</p>
                    <p className='opacity-70'>{new Date(meeting.start).toLocaleString()}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>End</p>
                    <p className='opacity-70'>{new Date(meeting.end).toLocaleString()}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Location</p>
                    <p className='opacity-70'>{meeting.location}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Status</p>
                    <p className='opacity-70'>{meeting.status}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Invites Required</p>
                    <p className='opacity-70 '>{meeting.inviteRequired ? 'Yes' : 'No'}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Attendees</p>
                    <p className='opacity-70 '>{meeting.attendees}</p>
                </div>
                <div className='flex justify-between mb-1'>
                    <p className='font-semibold'>Invitees</p>
                    <p className='opacity-70 '>{meeting.invitees}</p>
                </div>            
            </div>
            {/* <div className='mt-5 bg-primary-100 dark:bg-primary-600/20 p-5 sm:rounded-lg'>
                <h3 className='text-xl font-bold mb-5'>Comments</h3>
            </div> */}
        </div>
        
    </div>
    <Drawer
    selector="#boostPopupControler"
    isOpen={boostPopupOpen}
    onClose={() => setBoostPopupOpen(false)}
  >
    <BoostPopup content={meeting.origin} onClose={() => setBoostPopupOpen(false)} />
    </Drawer>
    </>
  )
}

export default EventDetailCard