import React from 'react'
import './style.css';
import { CommentListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import dayjs from 'dayjs';

//commentListMock 에서 데이터를 받아오는 연결을 '준비'
//Props : 데이터를 전달하는 객체
interface Props{

    commentListItem  : CommentListItem;
}

//              component : comment list item 컴포넌트                           //

export default function CommentItem({commentListItem}:Props) {

//              properties        //

const{nickname,profileImage,writeDatetime,content }= commentListItem
// console.log('CommentListItem변경?????+++++===========>')

// console.log('전달된 commentListItem========> ', commentListItem) 
// console.log('전달된 writeDatetime========> ', writeDatetime) // 출력됨 


//             function : 작성일 경과 시간 함수                                 //



const getElapsedTime = () =>{
    // 백엔드:CommentEntity : writeDatetime 포맷 )   writeDatetime  "yyyy-MM-dd HH:mm:ss"
    
    const now = dayjs().add(9, 'hour')
   
    //writeDatetime 에러는 없지만 하드코딩 , 댓글시간 제대로 안나옴.
    // const writeDatetime = '2024-01-05 12:30:45'; 
    const writeTime = dayjs(writeDatetime, { format: 'yyyy-MM-dd HH:mm:ss' });
    
    // console.log('writeTime========> ', writeTime)


    //now와 writeTime(게시글 작성시간) 사이의 차이를 초 단위로 계산
    const gap = now.diff(writeTime, 's');
    // console.log('gap ==========> ', gap)

    //1초 미만
    if (gap < 60) return `${gap}초 전`;
    //1시간 미만
    if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
    //하루미만
    if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;

    return `${Math.floor(gap / 86400)}일 전`;
}   


//              render : comment list item 렌더링                           //    
  return (
    <div className='comment-list-item'>
        <div className='comment-list-item-top'>

            <div className='comment-list-item-profile-box'>
                <div className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage? profileImage : defaultProfileImage})`}}></div>
            </div>

            <div className='comment-list-item-nickname'>{nickname}</div>
            <div className='comment-list-item-divider'>{'\|'}</div>
            <div className='comment-list-item-time'>{getElapsedTime()}</div>
        </div>

        <div className='comment-list-item-main'>
            <div className='comment-list-item-content'>
                {content}
            </div>
        </div>
    </div>
  )
}
