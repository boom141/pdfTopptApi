import GPT from 'openai'

class SummarizeService {
    private helper = new GPT({apiKey: process.env.OPENAI_API_KEY as string});
    private HelperType = 'summarize '
    private helperEngine = process.env.OPENAI_MODEL  as string

    createTextContent = async (content: string): Promise<string | any> => {
        let response = await this.helper.completions.create({
            model: this.helperEngine,
            prompt: this.HelperType + content,
            max_tokens: 50,
        })

        return response
    }

}   

export default SummarizeService;