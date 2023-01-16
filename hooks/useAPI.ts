import useSWR from "swr";

const baseURL = "https://askbitcoin.ai";
//const baseURL = "http://localhost:5200";

export const BASE = `${baseURL}/api/v1`;

import axios from "../utils/axios";

//const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' });
const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

export function fetcher(params) {
  return axios(params).then(({ data }) => {
    return data;
  });
}

export function useAPI(path, queryParams) {
  let params = queryParams || "";
  let {
    data,
    error,
    mutate: refresh,
    isValidating: loading,
  } = useSWR(`${BASE}${path}${params}`, fetcher, { revalidateOnFocus: false });

  return { data, error, refresh, loading };
}