import {User} from 'next-auth'
import { DropdownMenu, DropdownMenuTrigger } from '../dropdown-menu'
import { UserAvatar } from './UserAvatar'
interface UserAccountNavProp 
{
    user:Pick<User,'name'|'image'|'email'>
}

export const UserAccountNav = ({user}:UserAccountNavProp) => {
    return <DropdownMenu>
        
        <DropdownMenuTrigger>
            <UserAvatar user={user}/>
        </DropdownMenuTrigger>
        </DropdownMenu>
}