import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const API_KEY = process.env.OPENAI_API_KEY

interface SendMessageResponseBody {
    text: string
}

interface ApiResponseBody {
    success: boolean
    message?: string
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseBody>
) {
    /*if (req.method !== 'POST') {
        res.status(404).json({
            success: false,
            message: 'Request route is not valid!',
        })
        return
    }*/
    //const { prompt, length = 500, temperature = 0.5 } = req.body

    // Send a request to the OpenAI GPT-3 API to generate text based on the input prompt
    try {
        const response = await axios.post<SendMessageResponseBody>(
            'https://api.openai.com/v1/models',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        )
    
        // Extract the generated text from the OpenAI API response and return it in the HTTP response body
        const text = response.data.text
    
        res.status(200).json({
            success: true,
            data: text,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
