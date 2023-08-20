import React, { useCallback, useMemo, useState } from 'react'
import Meta from '../../components/Meta'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import { useBitcoin } from '../../context/BitcoinContext'
import UserIcon from '../../components/UserIcon'
import Datepicker from "tailwind-datepicker-react"
import { useDropzone } from 'react-dropzone';
import { buf2hex } from '../../utils/file'

import { SmartContract, Scrypt, bsv } from "scrypt-ts";
import axios from "axios";
import useWallet from "../../hooks/useWallet";
import { useRouter } from "next/router";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";

Meeting.loadArtifact(artifact);

const options = {
  title: "Choose a Date",
  autoHide: true,
  todayBtn: true,
  clearBtn: true,
  maxDate: new Date("2030-01-01"),
  minDate: new Date(),
  theme: {
    background: "bg-primary-200 dark:bg-primary-800",
    todayBtn: "bg-primary-500 hover:bg-primary-400",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "",
    input: "",
    inputIcon: "",
    selected: "bg-primary-500",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    ),
    next: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    ),
  },
  datepickerClassNames: "absolute top-18 ",
  defaultDate: new Date(),
  language: "en",
};

const NewCalendarEventPage = () => {
    const { avatar, userName } = useBitcoin()
    const [base64CoverImage, setBase64CoverImage] = useState("")
    const [eventTitle, setEventTitle] = useState("")
    const [eventDescription, setEventDescription] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date().toISOString().split('T')[1].substring(0,5))
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [endDate, setEndDate] = useState<Date>()
    const [endTime, setEndTime] = useState<string>()
    const startDateTime = useMemo(() => {
        let dateTime = startDate
        let [hours, minutes] = startTime.split(":").map(Number)
        dateTime.setHours(hours)
        dateTime.setMinutes(minutes)
        return dateTime
    } ,[startDate, startTime])
    const endDateTime = useMemo(() => {
        let dateTime
        if (endDate && endTime) {
            dateTime = endDate
            let [hours, minutes] = endTime.split(":").map(Number)
            dateTime.setHours(hours)
            dateTime.setMinutes(minutes)
        } else {
            dateTime = new Date (startDateTime)
            dateTime.setHours(startDateTime.getHours() + 1)
        }
        return dateTime
    }, [endDate, endTime, startDateTime])
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const [addEndDate, setAddEndDate] = useState(false)
    const [requireInvites, setRequireInvites] = useState(false)
    const isContractReady = useMemo(() => eventTitle.length > 0,[eventTitle])

  const wallet = useWallet();

    const router = useRouter()
    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.length > 0 && acceptedFiles.forEach((file: any) => {
            const reader = new FileReader();
    
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result as ArrayBuffer;
            const fileType = file.type;
            if (!binaryStr) {
              console.log('Error reading file');
              return;
            }
            console.log('file', file);
            console.log('binary', binaryStr)
            const hex = buf2hex(binaryStr);
    
            console.log('file hex', hex);
    
            const base64 = Buffer.from(hex, 'hex').toString('base64');
            console.log('file base64', `data:${fileType};base64,${base64}`);
            setBase64CoverImage(`data:${fileType};base64,${base64}`)
    
            };
            reader.readAsArrayBuffer(file);
        });
    }, []); 

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const handleChangeEventTitle = (e:any) => {
        e.preventDefault()
        setEventTitle(e.target.value)
    }

    const handleChangeEventDescription = (e:any) => {
        e.preventDefault()
        setEventDescription(e.target.value)
    }

    const handleChangeStartDate = (selectedDate: Date) => {
        setStartDate(selectedDate)
    }

    const handleCloseStartDatePicker = (state:boolean) => {
        setShowStartDatePicker(state)
    }

    const handleChangeStartTime = (e:any) => {
        e.preventDefault()
        setStartTime(e.target.value)
    }

    const handleChangeEndDate = (selectedDate: Date) => {
        setEndDate(selectedDate)
    }

    const handleCloseEndDatePicker = (state:boolean) => {
        setShowEndDatePicker(state)
    }

    const handleChangeEndTime = (e:any) => {
        e.preventDefault()
        setEndTime(e.target.value)
    }
    const handleAddEndDate = (e:any) => {
        e.preventDefault()
        setAddEndDate(!addEndDate)
    }

    const handleSubmitEvent = async (e:any) => {
        e.preventDefault()
        
        try {

            console.log('SUBMIT!', {eventTitle, eventDescription, startDateTime, endDateTime, requireInvites})

            const { data } = await axios.post(`https://pow.co/api/v1/meetings/new`, {
                title: eventTitle,
                description: eventDescription,
                start: startDateTime.getTime(),
                end: endDateTime.getTime(),
                owner: wallet?.publicKey?.toString() || '034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8',
                organizer: wallet?.publicKey?.toString() || '034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8',
                url: ' ',
                status: ' ',
                location: ' ',
                inviteRequired: requireInvites,
            })

            const script = bsv.Script.fromASM(data.scriptASM)

            const tx = await wallet?.createTransaction({
                outputs: [
                    new bsv.Transaction.Output({
                        script,
                        satoshis: 10
                    })
                ]
            })

            if (!tx) { return }

            console.log('meeting.created', tx.hash)

            router.push(`/${tx.hash}`)
    
            console.log('meeting.new', data)

        } catch(error) {

            console.error(error)

        }
        
        
    }
  };

  return (
    <>
    <Meta title='Calendar | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
        <div className='mt-5 sm:mt-10 min-h-screen'>
            <div className='flex flex-col bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl py-5'>
                <h2 className='text-2xl text-center font-bold'>Create an event</h2>
                <section>
                    {base64CoverImage.length === 0 ? (
                    <div {...getRootProps()} className='relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20'>
                        <input id="coverImage-dropzone" {...getInputProps()} />
                        <button onClick={onDrop} className='absolute bottom-0 right-0 m-5 px-3 py-2 bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer text-white font-semibold rounded-lg transition duration-500 transform hover:-translate-y-1'>Add a cover image</button>
                    </div>):(
                        <aside className='relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20 hover:opacity-70'>
                            <img alt="event cover image" src={base64CoverImage} className="w-full h-full object-cover relative"/>
                            <button className='absolute z-10 top-0 right-0 p-5' onClick={() => setBase64CoverImage("")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" rounded-full stroke-gray-500 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </aside>
                    )}
                </section>
                <div className='flex justify-start px-5'>
                    <div className='mr-5'>
                        <UserIcon src={avatar!} size={46}/>
                    </div>
                    <div className='flex flex-col grow'>
                        <h3 className='text-lg font-semibold'>{userName}</h3>
                        <p className='text-sm opacity-50'>Host (you)</p>
                    </div>
                </div>
                <div className='px-5 mt-5'>
                    <input 
                        type="text" 
                        required 
                        autoComplete='off' 
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        value={eventTitle}
                        onChange={handleChangeEventTitle}
                        placeholder='Title of the event'
                    />
                </div>
                <div className='px-5 my-5'>
                    <textarea id="nft-description" placeholder='Describe your event' maxLength={500} rows={4} value={eventDescription} onChange={handleChangeEventDescription} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" />
                </div>
                <p className='px-5 font-semibold mb-2'>Start date and time</p>
                <div className='px-5 flex relative'>
                    <Datepicker options={options} onChange={handleChangeStartDate} show={showStartDatePicker} setShow={handleCloseStartDatePicker} />
                    <input type="time" value={startTime} onChange={handleChangeStartTime} className="ml-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"/>
                </div>
                <div onClick={handleAddEndDate} className='px-5 my-5 flex text-primary-500 cursor-pointer hover:underline'>
                    {!addEndDate ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                    }

                    <p className=''>Add an end date/time</p>
                </div>
                {addEndDate && <>
                <p className='px-5 font-semibold mb-2'>End date and time</p>
                <div className='px-5 flex relative mb-5'>
                    <Datepicker options={options} onChange={handleChangeEndDate} show={showEndDatePicker} setShow={handleCloseEndDatePicker} />
                    <input type="time" value={endTime} onChange={handleChangeEndTime} className="ml-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"/>
                </div>
                </>}
                <div className='px-5'>
                    <input checked={requireInvites} id="require-invite" type="checkbox" onClick={(e:any) => setRequireInvites(!requireInvites)} className="w-4 h-4 accent-primary-500 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor='require-invite' className='ml-4 '>Require Invites?</label>
                </div>
                <button disabled={!isContractReady} onClick={handleSubmitEvent} className='mt-5 mx-5 py-3 bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer text-white font-semibold rounded-lg transition duration-500 transform hover:-translate-y-1 hover:disabled:translate-y-0 disabled:opacity-60 disabled:cursor-default'>Create Event</button>
            </div>
            <div className="flex justify-start px-5">
              <div className="mr-5">
                <UserIcon src={avatar!} size={46} />
              </div>
              <div className="flex flex-col grow">
                <h3 className="text-lg font-semibold">{userName}</h3>
                <p className="text-sm opacity-50">Host (you)</p>
              </div>
            </div>
            <div className="p-5">
              <input
                type="text"
                required
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                value={eventTitle}
                onChange={handleChangeEventTitle}
                placeholder="Title of the event"
              />
            </div>
            <p className="px-5 font-semibold mb-2">Start date and time</p>
            <div className="px-5 flex relative">
              <Datepicker
                options={options}
                onChange={handleChangeStartDate}
                show={showStartDatePicker}
                setShow={handleCloseStartDatePicker}
              />
              <input
                type="time"
                className="ml-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
            <div
              onClick={handleAddEndDate}
              className="px-5 my-5 flex text-primary-500 cursor-pointer hover:underline"
            >
              {!addEndDate ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 12H6"
                  />
                </svg>
              )}

              <p className="">Add an end date/time</p>
            </div>
            {addEndDate && (
              <>
                <p className="px-5 font-semibold mb-2">End date and time</p>
                <div className="px-5 flex relative mb-5">
                  <Datepicker
                    options={options}
                    onChange={handleChangeStartDate}
                    show={showEndDatePicker}
                    setShow={handleCloseEndDatePicker}
                  />
                  <input
                    type="time"
                    className="ml-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  />
                </div>
              </>
            )}
            <div className="px-5">
              <input
                checked={requireInvites}
                id="require-invite"
                type="checkbox"
                onClick={(e: any) => setRequireInvites(!requireInvites)}
                className="w-4 h-4 accent-primary-500 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="require-invite" className="ml-4 ">
                Require Invites?
              </label>
            </div>
            <button
              disabled={!isContractReady}
              onClick={handleSubmitEvent}
              className="mt-5 mx-5 py-3 bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer text-white font-semibold rounded-lg transition duration-500 transform hover:-translate-y-1 hover:disabled:translate-y-0 disabled:opacity-60 disabled:cursor-default"
            >
              Create Event
            </button>
          </div>
      </ThreeColumnLayout>
    </>
  );
};

export default NewCalendarEventPage;
