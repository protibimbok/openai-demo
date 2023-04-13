import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    openai.listModels().then((response) => {
        res.status(200).json(response.data)
    }).catch((err) => {
        res.status(500).json(err);
    })
}
