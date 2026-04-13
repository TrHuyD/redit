import { Version } from "./dto";
import { ID } from "./ID";

export type SubRedditDto = {
    id: ID
    name: string
    image: string
}
export interface SubredditMinimalMd{
    id:bigint,
    name:string,
}

export interface SubredditBaseMd extends Version,SubredditMinimalMd{
    image:string;
    createdAt:bigint;
    latestUpdateAt:bigint;
    creatorId: bigint;
    bannerImage?:string;
    description:string;
}
export interface UserSubredditBaseMd extends SubredditBaseMd{
    isCreator:boolean,
    isMember:boolean,
    userCount:number
}
export interface subredditMemCount{
    id: bigint,
    Count:number
  }