import { openai } from '@/helpers/openai';
import { NextApiRequest, NextApiResponse } from 'next'

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
