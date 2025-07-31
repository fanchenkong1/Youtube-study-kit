import { FileSlidersIcon } from "lucide-react";

export async function getStreamingPromptResult(session, prompt, updateResponse) {
    const callId = Date.now() + '-' + Math.random();
    try {
        let lastChunkTime = performance.now();
        const latencies = [];
        let firstChunk = true;

        console.log("start" + `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        const stream = session.promptStreaming(prompt);
        for await (const chunk of stream) {
            if (firstChunk) {
                performance.mark("generatePromptSession-first");
                firstChunk = false
            }
            const thisChunkTime = performance.now();
            const latency = thisChunkTime - lastChunkTime;
            latencies.push(latency);
            lastChunkTime = thisChunkTime;
            updateResponse(chunk)
        }
        console.log(`[${callId}] All chunk latencies:`, latencies);
        console.log(`${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
    } catch (error) {
        updateResponse(error);
        console.log(error);
    }
}

export async function getPromptResult(session, prompt) {
    try {
        console.log("start" + `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        const result = await session.prompt(prompt);
        console.log(`${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        return result;
    } catch (error) {
        console.log(error);
    }
    return "";
}