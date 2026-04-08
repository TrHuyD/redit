import { Version } from "./dto";
import { ID } from "./ID";

export type SubRedditDto = {
    Id: ID
    name: string
    image: string         
}
export interface SubredditMinimalMd{
    Id:bigint,
    name:string,
}

export interface SubredditBaseMd extends Version,SubredditMinimalMd{
    image:string;
    createdAt:bigint;
    latestUpdateAt:bigint;
    creatorId: bigint;
    bannerImage?:string;
}
export interface UserSubredditBaseMd extends SubredditBaseMd{
    isCreator:boolean,
    isMember:boolean,
    userCount:number
}
export interface subredditMemCount{
    Id: bigint,
    Count:number
  }