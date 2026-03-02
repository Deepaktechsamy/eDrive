const { GPT4All } = require("gpt4all");

async function generateResponse(prompt) {
    try {
        console.log("Initializing GPT-4All...");

        const gpt4all = new GPT4All("gpt4all-lora-quantized"); 
        await gpt4all.init();
        await gpt4all.open();

        console.log("Generating response...");
        const response = await gpt4all.chat(prompt, { max_tokens: 200 });

        console.log("AI Response:", response);
        await gpt4all.close();
        return response;
    } catch (error) {
        console.error("GPT4All Error:", error);
        return "Error generating response.";
    }
}

module.exports = { generateResponse };
