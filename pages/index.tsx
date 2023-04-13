import { pageTitle } from '@/helpers/site'
import Head from 'next/head'
import { FormEvent, useState } from 'react'
import axios from 'axios'

export default function Home() {
    const [prompt, setPrompt] = useState('')
    const [length, setLength] = useState(500)
    const [temperature, setTemperature] = useState(0.5)
    const [result, setResult] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const response = await axios.post('/api/prompt', {
                prompt,
                length,
                temperature,
            })

            setResult(response.data.text)
        } catch (error) {
            console.error(error)
            setResult('Error generating text')
        }
    }

    return (
        <>
            <Head>
                <title>{pageTitle('Home')}</title>
            </Head>
            <form className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Article Writer</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="prompt"
                    >
                        Prompt
                    </label>
                    <textarea
                        className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt for the article"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="length"
                    >
                        Maximum length
                    </label>
                    <input
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        id="length"
                        type="number"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        min="1"
                        max="2048"
                        placeholder="Enter the maximum length of the generated text (in characters)"
                    />
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
                <div className="mb-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Generate text
                    </button>
                </div>
                {result && (
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="result"
                        >
                            Result
                        </label>
                        <textarea
                            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            id="result"
                            value={result}
                            readOnly
                        />
                    </div>
                )}
            </form>
        </>
    )
}
