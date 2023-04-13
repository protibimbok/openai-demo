import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useState } from 'react'

type GetBody = [
    {
        loading: boolean
        result: any
        error: any
    },
    (url: string, config?: AxiosRequestConfig) => Promise<any>
]

type PostBody = [
    {
        loading: boolean
        result: any
        error: any
    },
    (url: string, data: any, config?: AxiosRequestConfig) => Promise<any>
]

export const useGet = (): GetBody => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const GET = (url: string, config?: AxiosRequestConfig): Promise<any> => {
        return new Promise((resolve) => {
            setLoading(true)
            const req = axios.get(url, config)
            req.then((response: AxiosResponse) => {
                setResult(response.data)
                resolve(response.data)
            })
                .catch((err) => {
                    setError(err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }
    return [
        {
            loading,
            result,
            error,
        },
        GET,
    ]
}

export const usePost = (): PostBody => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const POST = (
        url: string,
        data: any,
        config?: AxiosRequestConfig
    ): Promise<any> => {
        return new Promise((resolve) => {
            setLoading(true)
            const req = axios.post(url, data, config)
            req.then((response: AxiosResponse) => {
                setResult(response.data)
                resolve(response.data)
            })
                .catch((err) => {
                    setError(err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }
    return [
        {
            loading,
            result,
            error,
        },
        POST,
    ]
}


export const usePost2 = (): PostBody => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()
    const [error, setError] = useState()
    const POST = (
        url: string,
        data: any,
        config?: AxiosRequestConfig
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            const req = axios.post(url, data, config)
            req.then((response: AxiosResponse) => {
                setResult(response.data)
                resolve(response.data)
            })
                .catch((err) => {
                    setError(err.message)
                    reject(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }
    return [
        {
            loading,
            result,
            error,
        },
        POST,
    ]
}
