import React, { useEffect, useMemo, useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import {
  Scrypt,
  bsv,
  HashedSet,
  PubKey,
  ScryptProvider,
  ContractCalledEvent,
} from "scrypt-ts";
import axios from "axios";
import { useRouter } from "next/router";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";
import { useBitcoin } from "../../context/BitcoinContext";
import UserIcon from "../../components/UserIcon";

import useWallet from "../../hooks/useWallet";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";
import { fetchTransaction } from "../../services/whatsonchain";

Meeting.loadArtifact(artifact);

Scrypt.init({
  apiKey: String(process.env.NEXT_PUBLIC_SCRYPT_API_KEY),
  network: bsv.Networks.livenet,
});

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
        className="h-6 w-6"
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
        className="h-6 w-6"
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
  const { avatar, userName } = useBitcoin();
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime] = useState(
    new Date().toISOString().split("T")[1],
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [endTime] = useState(
    new Date().toISOString().split("T")[1],
  );
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [addEndDate, setAddEndDate] = useState(false);
  const [requireInvites, setRequireInvites] = useState(false);
  const isContractReady = useMemo(() => eventTitle.length > 0, [eventTitle]);

  const wallet = useWallet();

  const router = useRouter();

  useEffect(() => {
    if (!router.query.txid) return;

    fetchTransaction({ txid: router.query.txid as string }).then(async (tx) => {
      console.log(tx);

      const meeting = Meeting.fromTx(tx, 0, {
        attendees: new HashedSet<PubKey>(),
        invitees: new HashedSet<PubKey>(),
      });

      await meeting.connect(new ScryptProvider());

      console.log({ meeting });

      const subscription = Scrypt.contractApi.subscribe(
        {
          clazz: Meeting, // contract class
          id: {
            txId: router.query.txid as string,
            outputIndex: 0,
          }, // contract id
          methodNames: ["attend", "invite", "decline", "cancel", "uncancel"],
        },
        (event: ContractCalledEvent<Meeting>) => {
          // callback when receiving a notification
          console.log(`${event.methodName} is called with args: ${event.args}`);
        },
      );

      console.log({ subscription });

      return () => {
        subscription.unsubscribe();
      };
    });
  }, [router.query.txid]);

  const handleChangeEventTitle = (e: any) => {
    e.preventDefault();
    setEventTitle(e.target.value);
  };

  const handleChangeStartDate = (selectedDate: Date) => {
    console.log(selectedDate);
    setStartDate(selectedDate);
  };

  const handleCloseStartDatePicker = (state: boolean) => {
    setShowStartDatePicker(state);
  };

  const handleChangeEndDate = (selectedDate: Date) => {
    console.log(selectedDate);
    setEndDate(selectedDate);
  };

  const handleCloseEndDatePicker = (state: boolean) => {
    setShowEndDatePicker(state);
  };

  const handleAddEndDate = () => {
    setAddEndDate(!addEndDate);
  };

  const handleSubmitEvent = async () => {
    try {
      console.log("SUBMIT!", {
        eventTitle,
        startDate,
        startTime,
        endDate,
        endTime,
        requireInvites,
      });

      const { data } = await axios.post(`https://www.pow.co/api/v1/meetings/new`, {
        title: eventTitle,
        description: eventTitle,
        start: startDate.getTime(),
        end: endDate.getTime(),
        owner:
          wallet?.publicKey?.toString()
          || "034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8",
        organizer:
          wallet?.publicKey?.toString()
          || "034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8",
        url: " ",
        status: " ",
        location: " ",
        inviteRequired: false,
      });

      const script = bsv.Script.fromASM(data.scriptASM);

      const tx = await wallet?.createTransaction({
        outputs: [
          new bsv.Transaction.Output({
            script,
            satoshis: 10,
          }),
        ],
      });

      if (!tx) {
        return;
      }

      console.log("meeting.created", tx.hash);

      router.push(`/${tx.hash}`);

      console.log("meeting.new", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <ThreeColumnLayout>
        <div className="mt-5 min-h-screen sm:mt-10">
          <div className="flex flex-col bg-primary-100 py-5 dark:bg-primary-700/20 sm:rounded-xl">
            <h2 className="text-center text-2xl font-bold">Create an event</h2>
            <div className="relative my-5 h-44 w-full bg-primary-200 dark:bg-primary-600/20">
              <button type="button" className="absolute bottom-0 right-0 m-5 cursor-pointer rounded-lg bg-gradient-to-tr from-primary-400 to-primary-500 px-3 py-2 font-semibold text-white transition duration-500 hover:-translate-y-1">
                Add a cover image
              </button>
            </div>
            <div className="flex justify-start px-5">
              <div className="mr-5">
                <UserIcon src={avatar!} size={46} />
              </div>
              <div className="flex grow flex-col">
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
            <p className="mb-2 px-5 font-semibold">Start date and time</p>
            <div className="relative flex px-5">
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
              className="my-5 flex cursor-pointer px-5 text-primary-500 hover:underline"
            >
              {!addEndDate ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
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
                  className="h-6 w-6"
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
                <p className="mb-2 px-5 font-semibold">End date and time</p>
                <div className="relative mb-5 flex px-5">
                  <Datepicker
                    options={options}
                    onChange={handleChangeEndDate}
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
                onClick={() => setRequireInvites(!requireInvites)}
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 accent-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="require-invite" className="ml-4 ">
                Require Invites?
              </label>
            </div>
            <button
              type="button"
              disabled={!isContractReady}
              onClick={handleSubmitEvent}
              className="mx-5 mt-5 cursor-pointer rounded-lg bg-gradient-to-tr from-primary-400 to-primary-500 py-3 font-semibold text-white transition duration-500 hover:-translate-y-1 disabled:cursor-default disabled:opacity-60 hover:disabled:translate-y-0"
            >
              Create Event
            </button>
          </div>
        </div>
      </ThreeColumnLayout>
  );
};

export default NewCalendarEventPage;
