import OpenAI from "openai";
import FAKE_JSON from "./fake_response.json"
import CONFIG from "./config.json"
import { Convert } from "./helpers";

const DEBUG = true;

const client = new OpenAI({
    apiKey: CONFIG.openai_api_key,
    dangerouslyAllowBrowser: true // This is a demo lol
})

export interface SomeUsableResponseIdk {
    status: 'success' | 'failure'
    err_message?: string;
    start_line?: number;
    end_line?: number;
    suggestion: string;
}

export class Generation {
    /*
    * Makes a response to a fake API for demonstrating the vulnerability
    * minus the randomness. `message` can be any string, it gets ignored.
    */
    public static async post(message: string): Promise<any> {
        // @ts-ignore
        const _ = message;

        const res = {
            content: FAKE_JSON.generation.content,
        };

        return res;
    }
}

export class Validation {
    /*
    * Posts `message` to an LLM for code validation, deserializes
    * response into a usable JS object.
    */
    public static async post(message: string): Promise<void> {
        if (DEBUG) {
            console.log(FAKE_JSON.validation);
            return;
        }
        if (!CONFIG.openai_api_key) throw Error("Set your OpenAI API key please senor")
        const res = await client.chat.completions.create({
            model: "gpt-5",
            messages: [
                { role: "system", content: CONFIG.system },
                { role: "user", content: message }
            ]
        })


        const bleh = res.choices[0].message;
        const usableResponses = Convert.toSomeUsableResponses(bleh.content || "{}");
        console.log(usableResponses)
    }
}
