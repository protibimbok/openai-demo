import { openai } from '@/helpers/openai'
import { NextApiRequest, NextApiResponse } from 'next'

interface ApiResponseBody {
    success: boolean
    message?: string
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseBody>
) {
    if (req.method !== 'POST') {
        res.status(404).json({
            success: false,
            message: 'Request route is not valid!',
        })
        return
    }
    const {
        prompt,
        temperature = 0.5,
        model = 'text-davinci-003',
    } = req.body

    // Send a request to the OpenAI GPT-3 API to generate text based on the input prompt
    try {
        const completion = await openai.createCompletion({
            model,
            prompt,
            temperature
        })

        res.status(200).json({
            success: true,
            data: completion.data,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            data: err.response?.data
        })
    }
}
