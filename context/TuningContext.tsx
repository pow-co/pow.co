import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../utils/storage";
import { useRouter } from "next/router";

import moment from "moment";

import { config } from "../template_config"

function ago(period: moment.DurationInputArg2) {
  return moment().subtract(1, period).unix() * 1000;
}

type ContextValue = {
    filter: "last-hour" | "last-day" | "last-week" | "last-month" | "last-year" | "all-time",
    setFilter: (filter: "last-hour" | "last-day" | "last-week" | "last-month" | "last-year" | "all-time") => void;
    locale: string;
    setLocale: (locale: string) => void;
    zenMode: boolean;
    setZenMode: (zenMode: boolean) => void;

}

const TuningContext = createContext<ContextValue | undefined>(undefined);

const filters = {
  "last-hour": ago("hour"),
  "last-day": ago("day"),
  "last-week": ago("week"),
  "last-month": ago("month"),
  "last-year": ago("year"), 
  "all-time": 0,
};
const sort = {
  latest: -1,
  oldest: 1,
  boost: 0,
};

const TuneProvider = (props: { children: React.ReactNode }) => {
  const router = useRouter();
  const [filter, setFilter] = useLocalStorage(filterStorageKey, "all-time");
  const [zenMode, setZenMode] = useLocalStorage(zenModeStorageKey, false);
  const [locale, setLocale] = useLocalStorage(langStorageKey, "en");
  const [sort, setSort] = useLocalStorage(sortStorageKey, "latest");
  const [startTimestamp, setStartTimestamp] = useState(0);
  //const [endTimestamp, setEndTimestamp] = useState(moment.now().unix());

  useEffect(() => {
    //@ts-ignore
    setStartTimestamp(filters[filter]);
  }, [filter, sort, router]);

  const value = useMemo(
    () => ({
      filter,
      setFilter,
      locale,
      setLocale,
      sort,
      setSort,
      zenMode,
      setZenMode,
      startTimestamp,
    }),
    [
      filter,
      setFilter,
      locale,
      setLocale,
      sort,
      setSort,
      startTimestamp,
      zenMode,
      setZenMode,
    ]
  );

  return <TuningContext.Provider value={value} {...props} />;
};

const useTuning = () => {
  const context = useContext(TuningContext);
  if (context === undefined) {
    throw new Error("useTuning must be used within a TuningProvider");
  }
  return context;
};

export { TuneProvider, useTuning };

//
// Utils
//

const filterStorageKey = `${config.appname}__TuneProvider_filter`;
const sortStorageKey = `${config.appname}__TuneProvider_sort`;
const zenModeStorageKey = `${config.appname}__TuneProvider_zenMode`;
const langStorageKey = `${config.appname}__TuneProvider_lang`;