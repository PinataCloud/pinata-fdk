import { FrameActionPayload } from "./types";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

/**
 * Validates a frame message by querying a Farcaster hub.
 * @param body The frame action payload containing the message to validate.
 * @returns A Promise that resolves with an object containing whether the message signature is valid and the validated message.
 */
export async function validateFrameMessage(body: FrameActionPayload): Promise<{
  isValid: boolean;
  message: Message | undefined;
}> {
  const HUB_URL = "hub-grpc.pinata.cloud"
  const client = getSSLHubRpcClient(HUB_URL);
  const frameMessage = Message.decode(Buffer.from(body?.trustedData?.messageBytes || '', 'hex'));
  const result = await client.validateMessage(frameMessage);  
  if (result.isOk() && result.value.valid) {        
      return {
      isValid: result.value.valid,
      message: result.value.message
    };
  } else {
    return {
      isValid: false,
      message: undefined,
    };
  }
}



