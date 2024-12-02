import request from "../request";
import { BASR_API_URL } from "../../constant/index";

export const llmApi = {
  // 获取AI评估
  getAIMeasure: async (detail: string, onChunk: (chunk: string) => void) => {
    try {
      const start_time = Date.now();
      const response = await fetch(`${BASR_API_URL}/llm/get-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ detail }),
      });
      console.log("请求时间为", (Date.now() - start_time) / 1000, "秒");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed.token);
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error in postDialogueStream:", error);
      throw error;
    }
  },
  getAIRiskLevel: (detail: string) =>
    request.post("/llm/get-risk-level", {
      detail,
    }),
};
