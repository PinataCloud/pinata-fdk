export type PinFileOptions = {
  pinataMetadata?: {
      name?: string,
      keyvalues?: Record<string, string>;
  },
  pinataOptions?: {  
    cidVersion: number
  }
};

/** The permitted types of `buttonIndex` in a Frame POST payload response */
export type ActionIndex = 1 | 2 | 3 | 4;
  
export type FrameInputMetadata = {
    text: string;
};

export type UserData = {
  fid: number, 
  username: string,
  pfp: string,
  bio: string
}

export type PinataConfig = {
  pinata_jwt: string;
  pinata_gateway: string;
}

export type FrameHTMLType = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  image?: {url: string};
  cid?: string;
  input?: FrameInputMetadata;
  post_url?: string;
  refresh_period?: number;
  aspect_ratio?: "1.91:1" | "1:1", 
  state?: object
} & (
  { image: {url: string}} | { cid: string }
);

export type FrameButtonMetadata = {
  label: string;
  action?: "post" | "post_redirect" | "mint" | "link" | 
  "tx";
  target?: string;
}

export interface ReplayResponse {
  data: {
    previously_used: boolean;
    message_bytes: string;
  }
}


export type FrameMetadataResponse = Record<string, string>;

export type AddressReturnType< Options extends { fallbackToCustodyAddress?: boolean } | undefined,
> = Options extends { fallbackToCustodyAddress: true }
  ? `0x${string}`
  : `0x${string}` | null;

  
/**
 * The body of valid `POST` requests triggered by Frame Buttons in other apps, when formatted as json, conforming to the Frames spec
 */
export type FrameActionPayload = {
  /** once validated, should be the only trusted source for accessing frame data */
  trustedData: { messageBytes: string };
  /**
   * untrustedData can be faked by anyone by hitting your frame with a POST with an arbitrary payload. We recommend only using
   * trustedData to do actions.
   */
  untrustedData: {
    /** the fid of the user who did the message. */
    fid: number;
    /** the url of the original frame, must be under 256 bytes */
    url: string;
    /** the hash of the `Farcaster` `AddFrameActionMessage` */
    messageHash: string;
    /** A Farcaster epoch timestamp (not UNIX timestamp) */
    timestamp: number;
    /** The Farcaster network is on network = 1 */
    network: number;
    /** the button index, starting from 1 that the user pressed to invoke this POST */
    buttonIndex: ActionIndex;
    /** the unique identifiers of the Farcaster cast, via the user who casted's `fid` and the cast `hash`, which is a unique identifier */
    castId: { fid: number; hash: string };
    /** text input by the user into any input provided, "" if requested and no input, undefined if input not requested */
    inputText?: string;
  };
};
