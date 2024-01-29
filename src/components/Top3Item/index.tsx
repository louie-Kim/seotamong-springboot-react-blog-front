
import { BoardListItem } from 'types/interface';
import './style.css';
import defualtProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate } from 'react-router-dom';
import { BOARD_DETAIL_PATH, BOARD_PATH } from 'constant';

//top3BoardListMock 에서 데이터를 받아오는 연결을 '준비'
//Props : 데이터를 전달하는 객체
interface Props{
    //속성       :  타입
    top3ListItem : BoardListItem

}

// Top3 리스트 아이템
//                 componentn: Top3 list item 컴포넌트                  //
export default function Top3Item({top3ListItem}:Props) {
// console.log('탑3게시물 ????????' + top3ListItem)

//                 properties :  boardTitleImage 뒷배경 카드 사진        //
const {boardNumber,title,content,boardTitleImage} = top3ListItem;
const {favoriteCount,commentCount,viewCount} = top3ListItem;
const {writeDatetime, writerNickname, writerProfileImage} = top3ListItem;


//                 function : 네비게이트 함수                            //

//                 eventhandler: 게시물 아이템 클릭 이벤트 처리 함수     //
const navigate = useNavigate()

const onClickHandler = () =>{
    navigate(BOARD_PATH() +'/'+ BOARD_DETAIL_PATH(boardNumber));
}

console.log('댓글 수:', commentCount);

//                 render: Top3 list item 컴포넌트                       //
  return (
    <div className='top-3-list-item' style={{backgroundImage:`url(${boardTitleImage})`}} onClick={onClickHandler}> 
        <div className='top-3-list-item-main-box'>

            <div className='top-3-list-item-top'>

                <div className='top-3-list-item-profile-box'>
                    <div className='top-3-list-item-profile-image' style={{backgroundImage:`url(${writerProfileImage? writerProfileImage : defualtProfileImage})`}}></div>
                </div>
                <div className='top-3-list-item-write-box'>
                    <div className='top-3-list-item-nickname'>{writerNickname}</div>
                    <div className='top-3-list-item-write-date'>{writeDatetime}</div>
                </div>

            </div>

            <div className='top-3-list-item-middle'>
                <div className='top-3-list-item-title'>{title}</div>
                <div className='top-3-list-item-content'>{content}</div>
            </div>

            <div className='top-3-list-item-bottom'>
                <div className='top-3-list-item-counts'>
                    {`댓글 ${commentCount}  좋아요${favoriteCount} 조회수${viewCount}`}
                </div>
            </div>
        </div>
    </div>
  )
}
