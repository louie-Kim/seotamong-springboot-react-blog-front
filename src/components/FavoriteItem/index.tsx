import React from 'react'
import { FavoriteListItem } from 'types/interface'
import defaultProfileImage from 'assets/image/default-profile-image.png'
import './style.css';

interface Props{

  favoriteItemList : FavoriteListItem
}


//         component :   favorote list item 컴포넌트               // 
export default function FavoriteItem({favoriteItemList}:Props) {

//         properties :     //
    const{nickname,profileImage} = favoriteItemList

//         render :                                                  //
  return (
    <div className='favorite-list-item'>

        <div className='favorite-list-item-profile-box'>
            <div className='favorite-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
        </div>

        <div className='favorite-list-item-nickname'>{nickname}</div>
    </div>
  )
}
