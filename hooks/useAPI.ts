import useSWR, { Fetcher} from "swr";
import axios, { AxiosRequestConfig } from "axios"

//const baseURL = "https://pow.co";
const baseURL = "http://localhost:8000";

export const BASE = `${baseURL}/api/v1`;


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

export function fetcher(params: AxiosRequestConfig<any>) {
  return axios(params).then(({ data }) => {
    return data;
  });
}

export function useAPI(path: string, queryParams: string) {
  let params = queryParams || "";
  let {
    data,
    error,
    mutate: refresh,
    isValidating: loading,
  } = useSWR(`${BASE}${path}${params}`, fetcher, { revalidateOnFocus: false });

  return { data, error, refresh, loading };
}