import { FrameActionPayload } from "./types";
import { hexStringToUint8Array } from "./utils";
import { Message } from "@farcaster/core";

/**
 * Validates a frame message by querying a Farcaster hub.
 * @param body The frame action payload containing the message to validate.
 * @returns A Promise that resolves with an object containing whether the message signature is valid and the validated message.
 */
export async function validateFrameMessage(body: FrameActionPayload): Promise<{
  isValid: boolean;
  message: Message | undefined;
}> {
  const hubBaseUrl = "https://hub.pinata.cloud";
  const data = body.trustedData.messageBytes
  const validateMessageResponse = await fetch(
    `${hubBaseUrl}/v1/validateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: hexStringToUint8Array(data),
    }
  );
  const result = await validateMessageResponse.json()

  if (result && result.valid) {        
      return {
      isValid: result.valid,
      message: result.message
    };
  } else {
    return {
      isValid: false,
      message: undefined,
    };
  }
}



