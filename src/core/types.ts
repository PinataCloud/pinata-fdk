export type PinFileOptions = {
  pinataMetadata?: {
    name?: string;
    keyvalues?: Record<string, string>;
  };
  pinataOptions?: {
    cidVersion: number;
  };
};

/** The permitted types of `buttonIndex` in a Frame POST payload response */
export type ActionIndex = 1 | 2 | 3 | 4;

export type FrameInputMetadata = {
  text: string;
};

export type UserData = {
  fid: number;
  username: string;
  pfp: string;
  bio: string;
};

export type PinataConfig = {
  pinata_jwt: string;
  pinata_gateway: string;
  app_fid?: string;
  app_mnemonic?: string;
};

export type FrameHTMLType = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  image?: { url: string };
  cid?: string;
  input?: FrameInputMetadata;
  post_url?: string;
  refresh_period?: number;
  aspect_ratio?: "1.91:1" | "1:1";
  state?: object;
} & ({ image: { url: string } } | { cid: string });

export type FrameButtonMetadata = {
  label: string;
  action?: "post" | "post_redirect" | "mint" | "link" | "tx";
  target?: string;
};

export interface ReplayResponse {
  data: {
    previously_used: boolean;
    message_bytes: string;
  };
}

export type FrameMetadataResponse = Record<string, string>;

export type AddressReturnType<
  Options extends { fallbackToCustodyAddress?: boolean } | undefined,
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

export type AnalyticsOptions = {
  frameId: string;
  customId?: string;
};

export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

export const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

export type WarpcastPayload = {
  signer_id: string;
  token: string;
  deep_link_url: string;
  status: string;
};

export type SignerInfo = {
  signer_uuid: string;
  public_key: string;
  signer_approved: 'pending_approval' | 'approved';
};

export type SignedKeyRequest = {
  token: string;
  deeplinkUrl: string;
  key: string;
  requestFid: number;
  state: 'completed' | 'pending';
  isSponsored: boolean;
  userFid: number;
}

export type Signer = {
  id: number;
  signer_uuid: string;
  fid: number;
  public_key: string;
  signer_approved: boolean;
  revoked: boolean;
}

export type SignerList = {
  signers: Signer[],
  next_page_token: string
}

export type CastRequest = {
  signerId: string;
  castAddBody: CastBody;
}

export type CastDelete = {
  hash: string;
  signerId: string;
}

export type CastDeleteRequest = {
  signerId: string;
  hash: string;
}

export type CastId = {
  fid: number;
  hash: string;
}

export type Embed = {
  url?: string | null;
  castId?: CastId | null;
}

export type CastBody = {
  embedsDeprecated?: string[];
  mentions?: number[];
  parentCastId?: CastId | null;
  parentUrl?: string | null;
  text?: string | null;
  mentionsPositions?: number[] | null;
  embeds?: Embed[] | null;
}

export type CastResponse = {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    castAddBody: {
      embedsDeprecated: any[];
      mentions: any[];
      text: string;
      mentionsPositions: any[];
      embeds: any[];
    };
  };
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
  dataBytes: string;
};

export type LikeCast = {
  hash: string,
  signerId: string
}

export type RecastCast = {
  hash: string;
  signerId: string;
}

export type FollowUser = {
  fid: number;
  signerId: string;
}
