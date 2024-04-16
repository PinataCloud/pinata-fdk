import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import {
  FrameHTMLType,
  ReplayResponse,
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
  CastByHashResponse,
  CastsResponse,
  UsersResponse,
  UserByFidResponse,
  ChannelsResponse,
  ChannelsFollowingResponse,
  ChannelFollowingStatusResponse,
  ChannelResponse,
  ChannelFollowersResponse
} from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { Message } from "@farcaster/core";
import { sendAnalytics } from "./analytics/sendAnalytics";
import { convertUrlToIPFS } from "./ipfs/convertUrlToIPFS";
import { getAddressForFid } from "./getAddressForFid";
import { checkForReplays } from "./checkForReplay";
import { analyticsMiddleware } from "../middleware/analyticsMiddleware";
import { createSigner } from "./galactus/auth/createSigner";
import { pollSigner } from "./galactus/auth/pollSigner";
import { createSponsoredSigner } from "./galactus/auth/createSponsoredSigner";
import { getSigners } from "./galactus/auth/getSigners";
import { sendCast } from "./galactus/casts/sendCast";
import { deleteCast } from "./galactus/casts/deleteCast";
import { likeCast } from "./galactus/casts/likeCast";
import { unlikeCast } from "./galactus/casts/unlikeCast";
import { recastCast } from "./galactus/casts/recastCast";
import { removeRecast } from "./galactus/casts/removeRecast";
import { followUser } from "./galactus/users/followUser";
import { unfollowUser } from "./galactus/users/unfollowUser";
import { getCasts } from "./galactus/casts/getCasts";
import { getCastByHash } from "./galactus/casts/getCastByHash";
import { getUsers } from "./galactus/users/getUsers";
import { getUserByFid } from "./galactus/users/getUserByFid";
import { getChannelsFollowing } from "./galactus/users/getChannelsFollowing";
import { getChannelsFollowingStatus } from "./galactus/users/getChannelFollowingStatus";
import { getChannels } from "./galactus/channels/getChannels";
import { getChannelByName } from "./galactus/channels/getChannelByName";
import { getChannelFollowers } from "./galactus/channels/getChannelFollowers";

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

  //Auth

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

  //Casts
  getCasts(pageToken?: string): Promise<CastsResponse> {
    return getCasts(this.config, pageToken);
  }

  getCastByHash(hash: string): Promise<CastByHashResponse> {
    return getCastByHash(hash, this.config);
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

  // Users
  followUser(followRequest: FollowUser): Promise<CastResponse> {
    return followUser(followRequest, this.config);
  }

  unfollowUser(followRequest: FollowUser): Promise<CastResponse> {
    return unfollowUser(followRequest, this.config);
  }

  getUsers(pageToken?: string): Promise<UsersResponse> {
    return getUsers(this.config, pageToken);
  }

  getUserByFid(fid: number): Promise<UserByFidResponse> {
    return getUserByFid(fid, this.config);
  }

  getChannelsFollowing(fid: number, pageToken?: string): Promise<ChannelsFollowingResponse> {
    return getChannelsFollowing(this.config, fid, pageToken);
  }

  getChannelFollowingStatus(fid: number, name: string): Promise<ChannelFollowingStatusResponse> {
    return getChannelsFollowingStatus(this.config, fid, name);
  }
  
  //Channels
  getChannels(pageToken?: string): Promise<ChannelsResponse> {
    return getChannels(this.config, pageToken);
   }

  getChannelByName(name: string): Promise<ChannelResponse> {
    return getChannelByName(this.config, name);
  }

  getChannelFollowers(name: string, pageToken?: string): Promise<ChannelFollowersResponse> {
    return getChannelFollowers(this.config, name, pageToken);
  }

}
