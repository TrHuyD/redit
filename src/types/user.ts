import { ID } from "./ID"

export interface UserDto  {
    id: ID
    name: string
    username:string
    image: string         
}
export interface UserProfileDto extends UserDto {
    banner:string
    createdAt:number
}
