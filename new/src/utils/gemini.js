/**
 * HabAIt Mentor utility — communicates with Google Gemini API
 * Fallback chain tries models in order of preference.
 */

const MODELS = [
  'gemini-3.5-flash',       // Primary — best quality
  'gemini-3.1-flash-lite',  // 500 RPD free
  'gemini-2.5-flash-lite',  // 20 RPD free
  'gemini-3-flash',         // 20 RPD free
  'gemma-4-26b',            // 1500 RPD free, text model
];

async function callGeminiModel(model, apiKey, contents, systemInstruction) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();

  if (resJson.promptFeedback?.blockReason) {
    throw new Error(`Response blocked: ${resJson.promptFeedback.blockReason}`);
  }

  const candidate = resJson?.candidates?.[0];
  const candidateText = candidate?.content?.parts?.[0]?.text;

  if (!candidateText) {
    throw new Error('Gemini returned an empty response. Try rephrasing your message.');
  }

  return candidateText.trim();
}

export async function queryHabAIt(systemInstruction, chatHistory, userMessage) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in backend environment variables.');
  }

  const contents = [];

  chatHistory.forEach(msg => {
    const role = msg.role === 'user' ? 'user' : 'model';
    contents.push({ role, parts: [{ text: msg.content }] });
  });

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  if (contents.length === 0 || contents[0].role !== 'user') {
    contents.unshift({ role: 'user', parts: [{ text: 'Hi' }] });
  }

  const cleaned = [contents[0]];
  for (let i = 1; i < contents.length; i++) {
    const last = cleaned[cleaned.length - 1];
    if (contents[i].role === last.role) {
      last.parts[0].text += '\n' + contents[i].parts[0].text;
    } else {
      cleaned.push(contents[i]);
    }
  }

  let lastError;
  for (const model of MODELS) {
    try {
      return await callGeminiModel(model, apiKey, cleaned, systemInstruction);
    } catch (error) {
      lastError = error;
      console.warn(`HabAIt: ${model} failed (${error.message}), trying next...`);
      const isRetryable = error.message.includes('429') || error.message.includes('5');
      if (!isRetryable) throw error;
    }
  }

  throw lastError || new Error('All Gemini models are currently unavailable.');
}
