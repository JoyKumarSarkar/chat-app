import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user, onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 bg-black border border-transparent border-b-slate-600 hover:border hover:border-slate-600 rounded cursor-pointer'>
        <div>
            <Avatar
                width={50}
                height={50}
                name={user?.name}
                userId={user?._id}
                imageUrl={user?.profile_pic}
            />
        </div>
        <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
        </div>
    </Link>
  )
}

export default UserSearchCard
