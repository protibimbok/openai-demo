import { pageTitle } from '@/helpers/site'
import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'
import Msg, { MsgProps } from '@/components/Msg'
import { useGet, usePost2 } from '@/helpers/http'

interface Cache {
    models: string[]
    lastCall: number
    msgs: MsgProps[]
}

const CACHE: Cache = {
    models: [],
    lastCall: 0,
    msgs: [],
}

export default function Home() {
    const [{ loading: gettingModels, error: modelErr }, getModels] = useGet()
    const [models, setModels] = useState<string[]>([])
    const [msgs, setMsgs] = useState(CACHE.msgs)

    useEffect(() => {
        if (CACHE.models.length > 0) {
            setModels(CACHE.models)
        } else if (CACHE.lastCall + 60 < Date.now()) {
            CACHE.lastCall = Date.now()
            const req = getModels('/api/openai')
            req.then((res) => {
                setModels(res.data.map((model: any) => model.id))
            })
        }
    }, [])

    const [{ loading }, POST] = usePost2()

    const [prompt, setPrompt] = useState('')
    const [temperature, setTemperature] = useState(0.5)
    const [model, setModel] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const postData: Record<string, any> = {
                prompt,
                temperature,
            }
            if (model) {
                postData.model = model
            }
            setMsgs(addNewMsg({
                text: prompt,
                self: true,
                time: 'NOW',
                loading: true,
            }))
            setPrompt('')
            const response = await POST('/api/prompt', postData)
            
            setMsgs(addNewMsg({
                text: response.data.choices[0].text,
                self: false,
                time: 'NOW',
            }, true))
            console.log(response)
        } catch (error: any) {
            let err = error.message
            if (error.response) {
                err = error.response.data?.data?.error?.message || error.response.data?.message || err
            }

            setMsgs(addNewMsg({
                text: err,
                self: false,
                error: true,
                time: 'NOW'
            }, true))
        }
    }

    return (
        <>
            <Head>
                <title>{pageTitle('Home')}</title>
            </Head>
            <form className="lg:flex container mx-auto lg:flex-row-reverse h-full py-4">
                <div className="w-full lg:w-96 lg:min-w-[300px] lg:pl-4">
                    <div className="sticky top-1 p-4 bg-white rounded-md">
                        <h1 className="text-xl font-bold mb-4">
                            Configuration
                        </h1>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="model"
                            >
                                Model
                            </label>
                            {models.length > 0 ? (
                                <select
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                    id="model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                >
                                    <option value="" key={0}>
                                        Select model
                                    </option>
                                    {models.map((model) => (
                                        <option value={model} key={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                                    id="model"
                                >
                                    {gettingModels
                                        ? 'Loading...'
                                        : modelErr
                                        ? modelErr
                                        : 'Available models could not be loaded...'}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="temperature"
                            >
                                Randomness
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                id="temperature"
                                type="number"
                                value={temperature}
                                onChange={(e) =>
                                    setTemperature(parseFloat(e.target.value))
                                }
                                min="0"
                                max="1"
                                step="0.01"
                                placeholder="Enter the level of randomness in the generated text (between 0 and 1)"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-grow bg-gray-100 rounded-lg flex flex-col">
                    <div className="flex-grow overflow-auto p-3">
                        {msgs.map((msg, idx) => (
                            <Msg key={idx} {...msg} />
                        ))}
                    </div>
                    <div className="flex py-3 px-4">
                        <textarea
                            disabled={loading}
                            className="bg-white rounded-lg px-4 py-2 mr-2 w-full focus:outline-none focus:shadow-outline"
                            placeholder="Type your message..."
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="w-max">
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-4 py-2"
                                onClick={handleSubmit}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

function addNewMsg(msg: MsgProps, lastLoading?: boolean): MsgProps[] {
    const oldMsgs = [...CACHE.msgs]
    lastLoading && (oldMsgs[oldMsgs.length - 1].loading = false)
    oldMsgs.push(msg)
    CACHE.msgs = oldMsgs
    return oldMsgs
}
