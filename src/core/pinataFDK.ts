import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import {
  FrameHTMLType,
  ReplayResponse,
  UserData,
  FrameActionPayload,
  AnalyticsOptions,
  WarpcastPayload,
  SignedKeyRequest,
  SignerList,
  CastRequest,
  CastResponse,
  CastDelete,
  LikeCast,
  RecastCast,
  FollowUser,
} from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { Message } from "@farcaster/core";
import { sendAnalytics } from "./sendAnalytics";
import { convertUrlToIPFS } from "./convertUrlToIPFS";
import { getUserByFid } from "./getUserByFid";
import { getAddressForFid } from "./getAddressForFid";
import { checkForReplays } from "./checkForReplay";
import { analyticsMiddleware } from "../middleware/analyticsMiddleware";
import { createSigner } from "./createSigner";
import { pollSigner } from "./pollSigner";
import { createSponsoredSigner } from "./createSponsoredSigner";
import { getSigners } from "./getSigners";
import { sendCast } from "./sendCast";
import { deleteCast } from "./deleteCast";
import { likeCast } from "./likeCast";
import { unlikeCast } from "./unlikeCast";
import { recastCast } from "./recastCast";
import { removeRecast } from "./removeRecast";
import { followUser } from "./followUser";
import { unfollowUser } from "./unfollowUser";

const formatConfig = (config: PinataConfig | undefined) => {
  let gateway = config?.pinata_gateway;
  if (config && gateway) {
    if (gateway && !gateway.startsWith("https://")) {
      gateway = `https://${gateway}`;
    }
    config.pinata_gateway = gateway;
  }
  return config;
};

export class PinataFDK {
  config: PinataConfig | undefined;

  constructor(config?: PinataConfig) {
    this.config = formatConfig(config);
  }
  getFrameMetadata(metadata: FrameHTMLType): string {
    return getFrameMetadata(metadata, this.config);
  }

  validateFrameMessage(payload: FrameActionPayload): Promise<{
    isValid: boolean;
    message: Message | undefined;
  }> {
    return validateFrameMessage(payload);
  }

  decodedFrameMetadata(metadata: FrameHTMLType): Record<string, string> {
    return decodedFrameMetadata(metadata, this.config);
  }

  sendAnalytics(
    frame_id: string,
    frame_data: FrameActionPayload,
    custom_id?: string,
  ): Promise<{ success: boolean }> {
    return sendAnalytics(frame_id, frame_data, this.config, custom_id);
  }

  convertUrlToIPFS(url: string): Promise<string | undefined> {
    return convertUrlToIPFS(url, this.config);
  }

  getUserByFid(fid: number): Promise<UserData> {
    return getUserByFid(fid);
  }

  getEthAddressForFid(fid: number): Promise<string> {
    return getAddressForFid(fid);
  }

  checkForReplays(
    frame_id: string,
    frame_data: FrameActionPayload,
  ): Promise<ReplayResponse> {
    return checkForReplays(frame_id, frame_data, this.config);
  }

  analyticsMiddleware(options: AnalyticsOptions) {
    return analyticsMiddleware(options, this.config);
  }

  createSigner(): Promise<WarpcastPayload> {
    return createSigner(this.config);
  }

  createSponsoredSigner(): Promise<WarpcastPayload> {
    return createSponsoredSigner(this.config);
  }

  pollSigner(token: string): Promise<SignedKeyRequest> {
    return pollSigner(token, this.config);
  }

  getSigners(fid?: number): Promise<SignerList> {
    return getSigners(this.config, fid);
  }

  sendCast(cast: CastRequest): Promise<CastResponse> {
    return sendCast(cast, this.config);
  }

  deleteCast(cast: CastDelete): Promise<CastResponse> {
    return deleteCast(cast, this.config);
  }

  likeCast(cast: LikeCast): Promise<CastResponse> {
    return likeCast(cast, this.config);
  }

  unlikeCast(cast: LikeCast): Promise<CastResponse> {
    return unlikeCast(cast, this.config);
  }

  recastCast(cast: RecastCast): Promise<CastResponse> {
    return recastCast(cast, this.config);
  }

  removeRecast(cast: RecastCast): Promise<CastResponse> {
    return removeRecast(cast, this.config);
  }

  followUser(followRequest: FollowUser): Promise<CastResponse> {
    return followUser(followRequest, this.config);
  }

  unfollowUser(followRequest: FollowUser): Promise<CastResponse> {
    return unfollowUser(followRequest, this.config);
  }
}
