import React, { useEffect, useState, useRef, useCallback } from 'react'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export enum RequestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT"
}

export interface ApiReqProps {
    axiosConfigs: AxiosRequestConfig,
    axiosInstance?: AxiosInstance,
    onMount?: boolean,
    deps?: any[], // a predefined list of dependencies for useEffect
    maxReqNum?: number // max number of times it fetches
}

 
/**
 * Custom hook for making API requests using the Axios library.
 * Supports optional auto-fetch on component mount or manual triggering.
 *
 * Side Effects:
 * - useEffect dependencies: `axiosConfigs`, `axiosInstance`, `deps`
 * - refetch dependencies: `axiosConfigs`, `axiosInstance`, `deps`
 *
 * @param {AxiosRequestConfig} axiosConfigs - The Axios configuration object provided by the caller.
 * @param {AxiosInstance} [axiosInstance] - Optional custom Axios instance to use for the request.
 * @param {boolean} [onMount=false] - If true, the request will be triggered automatically on component mount.
 * @param {any[]} [deps=[]] - Optional dependency list to control when the request should re-run.
 * @param {number} [maxReqNum] - max request number. If -1, then there is no limit (default -1)
 *
 * @returns {{ 
*   data: any, 
*   loading: boolean, 
*   error: any, 
*   refetch: function 
* }} An object containing:
* - `data`: The response data from the request.
* - `loading`: Boolean indicating whether the request is in progress.
* - `error`: Error object if the request fails.
* - `refetch`: Function to manually trigger the API request (e.g., on user interaction).
*
* @example
* const { data, loading, error, refetch } = useApiRequest(config, axiosInstance, true, []);
*/

const useAPIReq = ({ axiosConfigs, axiosInstance = undefined, onMount = true, deps = [], maxReqNum = -1} : ApiReqProps) => {

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [currentReqNum, setCurrentReqNum ] = useState<number>(0);

    const abortControllerRef = useRef<AbortController| null>(null);

    const resetCount = () => setCurrentReqNum(0);

    const fetchTrigger = useCallback(async () => {

        if (maxReqNum > 0 && currentReqNum >= maxReqNum)
        {
            console.warn('Attempting to request past the request limit');
            return;
        }

        setCurrentReqNum(currentReqNum + 1);

        abortControllerRef.current?.abort();

        abortControllerRef.current = new AbortController();

        console.log("Fetching");

        try {

            setLoading(true);

            const config = {
                ...axiosConfigs, 
                signal: abortControllerRef.current.signal
            }
            const response = axiosInstance !== undefined ? 
                                                await axiosInstance(config) :  
                                                await axios(config)
            console.log("MY DATA", response.data);
            setData(response.data);
            setError(null);
            
        } catch (error: any) {

            if (error.name === 'CanceledError')
            {
                console.log('Request Aborted');
                setError('CanceledError');
            }
            else
                setError(error);

            console.log(error);
            setData(null);

        } finally {
            setLoading(false);
        }

    }, [axiosConfigs, axiosInstance, currentReqNum, ...deps]);
    
    useEffect(()=>{

        if (maxReqNum > 0 && currentReqNum >= maxReqNum)
        {
            console.warn('Attempting to request past the request limit');
            return;
        } 

        if (onMount)
        {
            fetchTrigger();
            setCurrentReqNum(currentReqNum + 1);
        }        

        return () => {

            abortControllerRef.current?.abort();
          };

    }, [axiosConfigs, axiosInstance, ...deps])


    return  { data, loading, error, resetCount, refetch: fetchTrigger };
}

export default useAPIReq