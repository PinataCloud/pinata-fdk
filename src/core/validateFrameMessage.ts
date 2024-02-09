import { FrameActionPayload} from "./types";
import { hexStringToUint8Array } from "./utils";
import { FrameActionMessage, Message } from "@farcaster/core";

/**
 * @returns a Promise that resolves with whether the message signature is valid, by querying a Farcaster hub, as well as the message itself
 */
export async function validateFrameMessage(body: FrameActionPayload): Promise<{
  isValid: boolean;
  message: FrameActionMessage | undefined;
}> {
  const hubBaseUrl = "https://hub.pinata.cloud/";

  const validateMessageResponse = await fetch(
    `${hubBaseUrl}/v1/validateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: hexStringToUint8Array(body.trustedData.messageBytes),
    }
  );

  const validateMessageJson = await validateMessageResponse.json();

  if (!validateMessageJson.valid) {
    return {
      isValid: false,
      message: undefined,
    };
  } else {
    return {
      isValid: true,
      message: Message.fromJSON(
        validateMessageJson.message
      ) as FrameActionMessage,
    };
  }
}
