import { BoardListItem } from 'types/interface';
import './style.css';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { BOARD_DETAIL_PATH, BOARD_PATH } from 'constant';
//최신게시글 만들기???

//latestBoardListMock 에서 데이터를 받아오는 연결을 '준비'
//Props : 데이터를 전달하는 객체
interface Props{
    
    // boardListItem라는 이름으로 BoardListItem 타입의 데이터 받아올 준비
    // 속성       :  타입
    boardListItem : BoardListItem
}

//           component: boardListItem 컴포넌트                        //
export default function BoardItem({boardListItem}:Props) {

//           properties                                                 //
 const {boardNumber, title, content, boardTitleImage } = boardListItem;
 const{favoriteCount,commentCount,viewCount}= boardListItem;
 const{writeDatetime, writerNickname,writerProfileImage } = boardListItem;

 //         function: 내비게이트 함수                                    //
 const navigate = useNavigate();


 //         event handler : 게시물 아이템 클릭 이벤트 처리 함수           //
const onClickHandler = () =>{
    navigate(BOARD_PATH() +'/'+ BOARD_DETAIL_PATH(boardNumber));
}


//           render: Board List Item 컴포넌트                            //
  return (
    <div className='board-list-item' onClick={onClickHandler}>
        <div className='board-list-item-main-box'>

            <div className='board-list-item-top'>

                <div className='board-list-item-profile-box'>
                    <div className='board-list-item-profile-image' style={{background:`url(${writerProfileImage ? writerProfileImage : defaultProfileImage})`}}></div>
                </div>

                <div className='board-list-item-write-box'>
                    <div className='board-list-item-nickname'>{writerNickname}</div>
                    <div className='board-list-item-write-date'>{writeDatetime}</div>
                </div>
            </div>

            <div className='board-list-item-middle'>
                <div className='board-list-item-title'>{title}</div>
                <div className='board-list-item-content'>{content}</div>
            </div>

            <div className='board-list-item-bottom'>
                <div className='board-list-item-counts'>{`댓글 ${commentCount}  좋아요${favoriteCount} 조회수${viewCount}`}</div>
            </div>

        </div>
         {/* boardTitleImage: 가 있으면 보여줌 */}
        {boardTitleImage !== null &&(

        <div className='board-list-item-image-box'>
            <div className='board-list-item-image'style={{background:`url(${boardTitleImage})`}}> </div>
        </div>

        )}

    </div>
  )
}
