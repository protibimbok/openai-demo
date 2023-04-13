import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
    organization: 'org-QhDLGlK9JYK128eXkzcRXVYd',
    apiKey: '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',
})
const openai = new OpenAIApi(configuration)

openai.listModels().then((response) => {
    console.log(JSON.stringify(response.data));
}).catch((err) => {
    console.error(err.message);
})