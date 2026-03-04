import axios from "axios";

/**
 * Configuración para la API de voz a texto (ej: OpenAI Whisper).
 * Para producción, usa variables de entorno:
 * - VITE_SPEECH_TO_TEXT_API_URL
 * - VITE_OPENAI_API_KEY (o la key que use tu proveedor)
 */
const SPEECH_API_URL =
  import.meta.env.VITE_SPEECH_TO_TEXT_API_URL 
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export interface SpeechToTextOptions {
  language?: string;
}

export interface SpeechToTextResult {
  text: string;
  error?: string;
}

/**
 * Envía un archivo de audio (Blob) a la API de transcripción (voz a texto).
 * Compatible con OpenAI Whisper. Para otra API, ajusta SPEECH_API_URL y el body.
 */
export async function speechToText(
  audioBlob: Blob,
  options: SpeechToTextOptions = {}
): Promise<SpeechToTextResult> {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");
    if (options.language) {
      formData.append("language", options.language);
    }

    const { data } = await axios.post<{ text: string }>(SPEECH_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      timeout: 60000,
    });

    return { text: data.text?.trim() ?? "" };
  } catch (err) {
    const message =
      axios.isAxiosError(err) && err.response?.data
        ? String(err.response.data?.error?.message ?? err.response.data)
        : err instanceof Error
          ? err.message
          : "Error al transcribir el audio";
    return { text: "", error: message };
  }
}
