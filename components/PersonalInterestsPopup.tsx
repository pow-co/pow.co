import React, { useEffect, useMemo, useState } from "react";

interface PersonalInterestsProps {
  onClose: () => void;
}

const PersonalInterestsPopup = ({ onClose }: PersonalInterestsProps) => {
  const [step, setStep] = useState(1)
  const [input, setInput] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [weights, setWeights] = useState<number[]>([])
  const [balance, setBalance] = useState(10000)
  const locked = useMemo(() => {
    return weights.reduce((acc, cv) => acc + cv , 0)
  },[weights])
  const available = useMemo(() => {
    return balance - locked
  },[locked])

  useEffect(() => {
    const weightsArray = Array(keywords.length).fill(0);
    setWeights(weightsArray);
  },[keywords])

  const SAMPLE_TOPIC = [
    "business",
    "art",
    "health",
    "politics",
    "sports",
    "bitcoin",
    "family",
    "music",
    "technology",
  ];

  const sanitizeString = (input: string): string => {
    // Trim leading and trailing whitespace
    const trimmed = input.trim();
    
    // Trim to a maximum of 20 characters
    const sanitized = trimmed.slice(0, 20);
    
    // Convert to lowercase
    const lowercase = sanitized.toLowerCase();
    
    return lowercase;
  };

  

  const handleChangeInput = (e:any) => {
    e.preventDefault()
    setInput(e.target.value)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Split the input into keywords separated by commas
      const keywords = input.split(/[, ]+/);
      
      // Process and submit each keyword
      keywords.forEach(keyword => {
        const sanitizedKeyword = sanitizeString(keyword.trim());
        submitKeyword(sanitizedKeyword);
      });
      
      // Clear the input state
      setInput("");
    }
  };

  const submitKeyword = (entry: string) => {
    // check for duplicates here
    if (keywords.includes(entry)) {
      // Handle duplicate keyword case (e.g., show an error message)
      console.log('Duplicate keyword');
      return;
    }
    setKeywords(prev => [...prev, entry])
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    let keywords = input.split(',')
    keywords.forEach(element => {
      element = sanitizeString(element)
      submitKeyword(element)
    });
    setInput("")
    
  }

  const deleteKeyWord = (index: number) => {
    // delete keyword at index from array
    setKeywords(prev => {
      const updatedKeywords = [...prev];
      updatedKeywords.splice(index, 1);
      return updatedKeywords;
    });
  }

  const handleWeightChange = (e:any, index: number) => {
    let value = parseFloat(e.target.value);
    if (value < 0){
      value = 0
    } 
    setWeights(prev => {
      const updatedWeights = [...prev];
      if (available > 0){
        updatedWeights[index] = value;
      } else {
        if (value < updatedWeights[index]){
          updatedWeights[index] = value 

        } else {
          updatedWeights[index] = updatedWeights[index] - Math.abs(available)
        }
      }
      
      
      return updatedWeights;
    });
  }

  const handleSign = (e:any) => {
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0">
      <div className="flex flex-col h-screen">
        <div onClick={onClose} className="grow" />
        <div className="flex">
          <div onClick={onClose} className="grow" />
          <div className="flex flex-col justify-center min-w-lg max-w-lg p-10 sm:rounded-lg bg-primary-100 dark:bg-primary-900">
            {step === 1 && <div className="">
              <h1 className="text-2xl font-bold text-center">
                What are you interested in?
              </h1>
              <h2 className="text-lg italic text-center text-gray-600 dark:text-gray-400">
                Create a dedicated feed that matches your topics of interest
              </h2>
              <div className="flex mt-5">
                <button onClick={handleSubmit} className="mr-4 rounded-full p-2 bg-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <input onKeyDown={handleKeyDown} value={input} onChange={handleChangeInput} className="w-full py-2 px-4" type="search" placeholder="Enter a list of keywords..."/>
                {keywords.length > 0 && <button onClick={()=> setKeywords([])} className="ml-5 text-primary-500 font-semibold hover:underline">Clear</button>}
              </div>
              <div className="mt-5 justify-around flex flex-wrap p-3 gap-2">
                {keywords.map((topic: string, index: number) => (
                  <div onClick={() => deleteKeyWord(index)} className="group flex cursor-pointer rounded-full border border-gray-400 dark:border-gray-600 p-5 py-2 bg-primary-500 border-none">
                    <div className="">
                      {topic}
                    </div>
                    <div className="hidden group-hover:block  ml-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button disabled={keywords.length === 0} onClick={()=>setStep(step + 1)} className="mt-5 text-sm disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0 leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-end py-2 px-5 transition duration-500 transform hover:-translate-y-1">
                  Next
                </button>
              </div>
            </div>}
            {step === 2 && <div className="">
              <h1 className="text-2xl font-bold text-center">
                Rank your topics
              </h1>
              <h2 className="text-lg italic text-center text-gray-600 dark:text-gray-400">
                Add weight (in sats) to each keywords based on your preferences
              </h2>
              <div className="p-5 flex justify-center">
                <p className="text-lg"><span>{locked}</span> / <input className="bg-transparent text-xl font-bold border-none w-20 text-primary-600 dark:text-primary-400" type="number" value={balance} min={10000}/> sats locked into the contract</p>
              </div>
              <div className="flex flex-col p-3 gap-2">
                {keywords.map((topic: string, index: number) => (
                  <div className="grid grid-cols-6">
                    <p className=" col-span-2">{topic}</p>
                    <input className="w-full col-span-4" type="range" onChange={(e:any) => handleWeightChange(e,index)} value={weights[index]} max={balance}/>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={()=>setStep(step - 1)} className="mt-5 text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-end py-2 px-5 transition duration-500 transform hover:-translate-y-1">
                  Back
                </button>
                <button disabled={locked <= 0 || locked > balance} onClick={()=>setStep(step + 1)} className="mt-5 text-sm disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0 leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-end py-2 px-5 transition duration-500 transform hover:-translate-y-1">
                  Next
                </button>
              </div>
            </div>}
            {step === 3 && <div className="">
              <h1 className="text-2xl font-bold text-center">
                Your Contract
              </h1>
              <h2 className="text-lg italic text-center text-gray-600 dark:text-gray-400">
                Here are the terms of the <b>personal interest</b> contract you're about to sign
              </h2>
              <div className="p-5 flex justify-center">
                <p className="text-lg"><span>{locked}</span> sats locked into the contract</p>
              </div>
              <div className="flex flex-col p-3 gap-2">
                {keywords.map((topic: string, index: number) => (
                  <div className="grid grid-cols-6">
                    <p className="col-span-2">{topic}</p>
                    <input disabled className=" col-span-4 w-full" type="range" onChange={(e:any) => handleWeightChange(e,index)} value={weights[index]} max={balance}/>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={()=>setStep(step - 1)} className="mt-5 text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-end py-2 px-5 transition duration-500 transform hover:-translate-y-1">
                  Back
                </button>
                <button disabled={locked < 0} onClick={handleSign} className="mt-5 text-sm disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0 leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-end py-2 px-5 transition duration-500 transform hover:-translate-y-1">
                  Sign contract({locked} sat)
                </button>
              </div>
            </div>}
          </div>
          <div onClick={onClose} className="grow" />
        </div>
        <div onClick={onClose} className="grow" />
      </div>
    </div>
  );
};

export default PersonalInterestsPopup;
