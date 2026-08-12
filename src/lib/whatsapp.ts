// import { logger } from "./logger"; // Removed because logger object does not exist in logger.ts

// Define Types
export interface WhatsAppMessageResponse {
  messaging_product: "whatsapp";
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

export interface WhatsAppErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_data?: {
      messaging_product: string;
      details: string;
    };
    fbtrace_id: string;
  };
}

/**
 * Get credentials from process.env
 * Alternatively, you could fetch these from the Settings DB model if preferred.
 */
const getWhatsAppCredentials = () => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp credentials (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID) are missing from environment variables.");
  }

  return { token, phoneNumberId };
};

/**
 * Sends a free-form text message to a WhatsApp number.
 * Note: Free-form messages can only be sent within 24 hours of the user's last message to you.
 * 
 * @param to The recipient's phone number (with country code, no + or spaces, e.g., '919876543210')
 * @param text The message content
 */
export async function sendWhatsAppTextMessage(to: string, text: string): Promise<WhatsAppMessageResponse | null> {
  const { token, phoneNumberId } = getWhatsAppCredentials();
  
  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API is not configured.");
  }

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "text",
    text: {
      preview_url: false,
      body: text,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as WhatsAppErrorResponse;
      console.error(`WhatsApp API Error (${errorData.error?.code}): ${errorData.error?.message}`);
      throw new Error(`WhatsApp API Error: ${errorData.error?.message}`);
    }

    return data as WhatsAppMessageResponse;
  } catch (error: any) {
    console.error("Failed to send WhatsApp message", error);
    throw error;
  }
}

/**
 * Sends a template message to a WhatsApp number.
 * Template messages are required to initiate a conversation outside the 24-hour window.
 * 
 * @param to The recipient's phone number
 * @param templateName The name of the approved template in Meta Business Manager
 * @param languageCode The language code (e.g., 'en', 'en_US', 'hi')
 * @param components Optional template components (header, body, buttons parameters)
 */
export async function sendWhatsAppTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "en",
  components: any[] = []
): Promise<WhatsAppMessageResponse | null> {
  const { token, phoneNumberId } = getWhatsAppCredentials();

  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API is not configured.");
  }

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: components,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as WhatsAppErrorResponse;
      console.error(`WhatsApp API Template Error (${errorData.error?.code}): ${errorData.error?.message}`);
      throw new Error(`WhatsApp API Error: ${errorData.error?.message}`);
    }

    return data as WhatsAppMessageResponse;
  } catch (error: any) {
    console.error("Failed to send WhatsApp template message", error);
    throw error;
  }
}
