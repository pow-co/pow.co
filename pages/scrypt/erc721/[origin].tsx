import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ThreeColumnLayout from '../../../components/ThreeColumnLayout'
import { useBitcoin } from '../../../context/BitcoinContext'
import UserIcon from '../../../components/UserIcon'
import Datepicker from "tailwind-datepicker-react"
import { useDropzone } from 'react-dropzone';
import { buf2hex } from '../../../utils/file'

import { SmartContract, Scrypt, bsv, PubKey, HashedMap, HashedSet, ScryptProvider, ContractCalledEvent } from "scrypt-ts";
import axios from "axios";
import useWallet from "../../../hooks/useWallet";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";


import { Meeting } from "../../../src/contracts/meeting";
import artifact from "../../../artifacts/meeting.json";

Meeting.loadArtifact(artifact);

import { Erc721 } from "../../../src/contracts/erc721";
import erc721 from "../../../artifacts/erc721.json";
import { fetchTransaction } from '../../../services/whatsonchain'

Erc721.loadArtifact(erc721);


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
    const [erc721, setErc721] = useState<Erc721 | null>(null)
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

    const [name, setName] = useState<string | null>();
    const [description, setDescription] = useState<string | null>();
    const [image, setImage] = useState<string | null>();
    const [metadata, setMetadata] = useState<any>({});

  const wallet = useWallet();

  const router = useRouter()


  useEffect(() => {
    if (!router.query.origin) return;

    const [txid, vout] = String(router.query.origin).split('_');

    fetchTransaction({ txid }).then(async (tx) => {
      console.log(tx);

      const instance = Erc721.fromTx(tx, vout ? parseInt(vout, 10) : 0, {
        owners: new HashedMap<bigint, PubKey>(),
      });

      setErc721(instance);

      console.log({erc721: instance})

    });
  }, [router.query.origin]);

  useEffect(() => {

    if (!erc721) return;

    try {

      setMetadata(JSON.parse(Buffer.from(erc721.metadata, 'hex').toString('utf8')))

    } catch(error) {

      console.error(error)

    }

    //@ts-ignore
    window.erc721 = erc721

    setName(Buffer.from(erc721.name, 'hex').toString('utf8'))
    setDescription(Buffer.from(erc721.description, 'hex').toString('utf8'))

    setImage(Buffer.from(erc721.image, 'hex').toString('utf8'))


  }, [erc721])

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


  return (
    <ThreeColumnLayout>
      <div className='mt-5 sm:mt-10 min-h-screen'>
        <div className='flex flex-col bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl py-5'>
            <h2 className='text-2xl text-center font-bold'>NFT Details</h2>
            <section>
                {!image ? (
                <div className='relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20'>
                    <p className='text-center text-gray-500'>No cover image provided.</p>
                </div>):(
                    <div className='relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20 hover:opacity-70'>
                        <img alt="event cover image" src={image} className="w-full h-full object-cover relative"/>
                    </div>
                )}
            </section>
            <div className='flex justify-start px-5'>
                <div className='mr-5'>
                    <UserIcon src={avatar!} size={46}/>
                </div>
                <div className='flex flex-col grow'>
                    <h3 className='text-lg font-semibold'>{erc721?.minter}</h3>
                    <p className='text-sm opacity-50'>Minter</p>
                </div>
            </div>
            <div className='px-5 mt-5'>
                <h4 className="text-xl font-bold">Name of the Collection:</h4>
                <p className="text-lg">{name}</p>
            </div>
            <div className='px-5 my-5'>
                <h4 className="text-xl font-bold">Description:</h4>
                <p>{description}</p>
            </div>

            <div className='px-5 my-5'>
                <h4 className="text-xl font-bold">Metadata:</h4>
                <p>{JSON.stringify(metadata)}</p>
            </div>
        </div>
    </div>

      </ThreeColumnLayout>

  );
};

export default NewCalendarEventPage;
