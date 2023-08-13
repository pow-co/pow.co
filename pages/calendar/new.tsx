import React, { useState } from 'react'
import Meta from '../../components/Meta'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import { useBitcoin } from '../../context/BitcoinContext'
import UserIcon from '../../components/UserIcon'
import Datepicker from "tailwind-datepicker-react"

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
		prev: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      ,
		next: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      ,
	},
	datepickerClassNames: "absolute top-18",
	defaultDate: new Date(),
	language: "en",
}

const NewCalendarEventPage = () => {
    const { avatar, userName } = useBitcoin()
    const [eventTitle, setEventTitle] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [startTime, setStartTime] = useState(new Date().toISOString().split('T')[1])

    const handleChangeEventTitle = (e:any) => {
        e.preventDefault()
        setEventTitle(e.target.value)
    }

    const handleChangeStartDate = (selectedDate: Date) => {
        console.log(selectedDate)
        setStartDate(selectedDate)
    }

    const handleCloseStartDatePicker = (state:boolean) => {
        setShowStartDatePicker(state)
    }

    const handleChangeStartTime = (e:any) => {
        e.preventDefault()
        setStartTime(e.target.value)
    }
  return (
    <>
    <Meta title='Calendar | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
        <div className='mt-5 sm:mt-10 min-h-screen'>
            <div className='flex flex-col bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl py-5'>
                <h2 className='text-2xl text-center font-bold'>Create an event</h2>
                <div className='relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20'>
                    <button className='absolute bottom-0 right-0 m-5 px-3 py-2 bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer text-white font-semibold rounded-lg transition duration-500 transform hover:-translate-y-1'>Add a cover image</button>
                </div>
                <div className='flex justify-start px-5'>
                    <div className='mr-5'>
                        <UserIcon src={avatar!} size={46}/>
                    </div>
                    <div className='flex flex-col grow'>
                        <h3 className='text-lg font-semibold'>{userName}</h3>
                        <p className='text-sm opacity-50'>Host (you)</p>
                    </div>
                </div>
                <div className='p-5'>
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
                <div className='px-5 flex relative'>
                    <Datepicker options={options} onChange={handleChangeStartDate} show={showStartDatePicker} setShow={handleCloseStartDatePicker} />
                </div>
            </div>
        </div>
        
    </ThreeColumnLayout>
    </>
  )
}

export default NewCalendarEventPage