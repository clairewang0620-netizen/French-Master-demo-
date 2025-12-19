
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LanguageLevel } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Enhanced French TTS Utility
 */
export const playTTS = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak this French text naturally and clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a clear, standard French accent
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio stream empty");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (error) {
    console.warn("Gemini TTS Unavailable, switching to Native Web Speech API", error);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export const generateVocabulary = async (level: LanguageLevel, count: number = 8) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} high-frequency French vocabulary words specifically for CEFR level ${level}. Include phonetic transcriptions (IPA), accurate Chinese meanings, and 2 distinct example sentences for each word. Context should be daily life.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            meaning: { type: Type.STRING },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sentence: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ["sentence", "translation"]
              }
            }
          },
          required: ["word", "phonetic", "meaning", "examples"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateDailySentences = async (category: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide 8 authentic French phrases for the situation: "${category}". Use modern spoken French. Include phonetics and Chinese translations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            meaning: { type: Type.STRING }
          },
          required: ["sentence", "phonetic", "meaning"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateGrammar = async (level: LanguageLevel) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain 3 essential French grammar rules for ${level} level. Explanations must be in Chinese and very clear. Provide 3 examples per rule.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              explanation: { type: Type.STRING },
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sentence: { type: Type.STRING },
                    translation: { type: Type.STRING }
                  },
                  required: ["sentence", "translation"]
                }
              }
            },
            required: ["title", "explanation", "examples"]
          }
        }
      }
    });
    return JSON.parse(response.text);
};

export const generateArticle = async (level: LanguageLevel) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a 250-350 word engaging article or dialogue in French suitable for ${level} learners. Use relevant vocabulary. Provide a Chinese translation and extract 5 key vocabulary terms.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          translation: { type: Type.STRING },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "translation", "keywords"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateExam = async (level: LanguageLevel) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a 10-question multiple-choice quiz testing French ${level}. Include grammar, vocabulary, and situational questions. Each question must have exactly 4 options and one clear explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              answerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "answerIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text);
};
