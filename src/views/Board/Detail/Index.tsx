import { ResponseDto } from 'apis/Response';
import { DeleteBoardResponseDto, GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto, IncreaseViewCountResponseDto, PostCommentResponseDto, PutFavoriteResponseDto } from 'apis/Response/board/indexs';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import CommentItem from 'components/CommentItem';
import FavoriteItem from 'components/FavoriteItem';
import Pagination from 'components/Pagination';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { Board } from 'types/interface';
import CommentListItem from 'types/interface/commnet-list-item.interface';
import FavoriteListItem from 'types/interface/favorite-list-item.interface';
import './style.css';
import { PostCommentRequest, deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListRequest, increaseViewCountRequest, putFavoriteRequest } from 'apis';
import dayjs from 'dayjs';
import { useCookies } from 'react-cookie';
import PostCommentRequestDto from 'apis/Request/board/post-comment.RequestDto';
import usePagination from 'hooks/pagination.hook';



//          component: 게시물 상세 화면  컴포넌트                             //
export default function BoardDetail() {

//          state  : 게시물 번호 path variable 상태       //

//게시물번호 들고 오기
//BOARD_DETAIL_PATH = (boardNumber: string|number) => `detail/${boardNumber}`;
//직접 입력한 ${boardNumber}를 들고 온다
const {boardNumber} = useParams();
// console.log("경로변수=============>",boardNumber)

//          state : 로그인 유저 상태                      //
//
const { loginUser} = useLoginUserStore();

//           state : more버튼 상태                        //

const [showMore, setShowMore] = useState<boolean>(false);
//          state: 쿠키 상태                              //
/**
 * 컴포넌트 내부에서 사용하면 해당 컴포넌트에서 로그인된 사용자의 쿠키 정보를 사용할 수 있습니다. 
 * 하지만 이는 컴포넌트 안에서만 유효한 정보이며, 전역적으로 다른 컴포넌트에서 사용할 수 있는 전역 상태가 아닙니다.
 * 최상위 컴포넌트 or 사용할 컴포넌트에서 = useCookies(); 해야 에러 안남
 */
const [cookies, setCookies] = useCookies();

//          function :  네비게이트 함수                   //

const navigate = useNavigate();
//         function : increase view count 처리 함수       //

const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto|ResponseDto|null) =>{

  if(!responseBody) return;
  const {code} = responseBody;
  if(code === 'NB') alert('존재하지 않는 게시판입니다.')
  if(code === 'DBE') alert('데이터베이스 오류 입니다.')
  
 
}

//          component: 게시물 상세 상단 화면  컴포넌트                //

  const BoardDetailTop =()=>{

//           state : more버튼 상태                        //

const [board, setBoard] = useState<Board|null>(null);    

//           state : more버튼 상태                        //

const [showMore, setShowMore] = useState<boolean>(false);



//          function : 작성일 포맷 변경 함수              //
//npm i dayjs
const getWriteDateFormat = () => {
  if(!board) return null;
  // console.log('board.writeDatetime======>' , board.writeDatetime)
  // console.log('board.boardNumber======>' , board.boardNumber)

  const date = dayjs(board.writeDatetime);
  //백엔드) postBoard, BoardEntity에서  : "yyyy-MM-dd" 형식으로 변환
  return date.format('YYYY. MM. DD')

}

//          function : get board response 처리 함수                       //

const getBoardResponse =(Body: GetBoardResponseDto|ResponseDto|null)=>{

  /**
   * GetBoardResponseDto가 ResponseDto와 Board의 모든 속성을 가지고 있음,
   * Body가 이 두 인터페이스를 모두 충족하는 경우라면 형변환을 하더라도 문제 없이 동작
   */

  if(!Body)return
  const{code} = Body ; // ResponseDto에서 추출
  if(code === 'NB') alert('존재하지 않는 게시물 입니다.')
  if(code ==='DBE') alert('데이터 베이스 오류 입니다.')
  if(code !=='SU'){
    navigate(MAIN_PATH());
    return;
  }
  /**
   * Body => GetBoardResponseDto 의 모든 필드 결과들을 포함
   * ResponseDto의 속성
   */
  // console.log('Body==============>' , Body)
  
  /**
   * GetBoardResponseDto 의 필드 데이터들이 출력,
   * Body 의 모든 요소를 복사하여  GetBoardResponseDto로 형변환
   */
  const board : Board ={...Body as GetBoardResponseDto};

  // console.log('board.writeDatetime======>' , board.writeDatetime)
  // console.log('board.boardNumber======>' , board.boardNumber)
  setBoard(board);


}
//          function : delete board response 처리함수               //

const deleteBoardResponse = (responseBody: DeleteBoardResponseDto|ResponseDto|null)=>{

  if(!responseBody) return;
  const {code} = responseBody;
  if(code === "VF")alert('잘못된 접근입니다.');
  if(code === "NU")alert('존재하지 않는 유저 입니다');
  if(code === "NB")alert('존재하지 않는 게시물 입니다.');
  if(code === "AF")alert('인즈에 실패하였습니다.');
  if(code === "NP")alert('권한이 없습니다');
  if(code === "DBE")alert('데이터 베이스 오류 입니다.');
  if(code !== "SU")return

  navigate(MAIN_PATH())

}

//           event handler : nickname 버튼 클릭 이벤트 처리         //

//닉네임클릭  --> 
const onNicknameClickHandler = () =>{
  if(!board) return
  //                  /user/${userEmail}
  //USER_PATH = (userEmail: string)=> `/user/${userEmail}`;
  navigate(USER_PATH(board.writerEmail));
}


//           event handler : more 버튼 클릭 이벤트 처리     //
//more버튼 보이게 하기
const onMoreButtonClickHandler = () =>{
  
  //초기값 false ==> !showMore = true
  setShowMore(!showMore);
}
//           event handler : 수정 버튼 클릭 이벤트 처리     //

//수정버튼 처리
const onUpdateButtonClickHandler = () =>{
  
  if(!board || !loginUser) return;

  if(loginUser.email !== board.writerEmail) return;
  //                                 /board/update/${boardNumber}
  navigate(BOARD_PATH()+ '/' + BOARD_UPDATE_PATH(board.boardNumber))
}
//           event handler : 삭제 버튼 클릭 이벤트 처리     //

//삭제버튼 처리
const onDeleteButtonClickHandler = () =>{
  
  if(!boardNumber || !board || !loginUser || !cookies.accessToken) return;

  if(loginUser.email !== board.writerEmail) return;

  deleteBoardRequest(boardNumber,cookies.accessToken).then(deleteBoardResponse)
}


//           effect : 게시물 번호 path variable이 바뀔때 마다 게시물 불러오기//
    useEffect(()=>{
      /**
       * 왜 4번이나 작동하지?????
       */
    if(!boardNumber) {
      navigate(MAIN_PATH())
      return;
    }
    //api요청
    getBoardRequest(boardNumber).then(getBoardResponse);

    },[boardNumber])

//          render: 게시물 상세 상단 화면  렌더링                             //

if(!board) return <></> // board가 없으면 렌더링 없음.
    //boar가 있으면 렌더링
    return(
      <div id='board-detail-top'>
          <div className='board-detail-top-header'>
              <div className='board-detail-title'>{board.title}</div>
              <div className='board-detail-top-sub-box'>
                
                <div className='board-detail-write-info-box'>
                  <div className='board-detail-writer-profile-image' 
                  style={{backgroundImage:`url(${ board.writerProfileImage? board.writerProfileImage :defaultProfileImage})`}}></div>
                  <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{board.writerNickname}</div>
                  <div className='board-detail-info-divider'>{'\|'}</div>
                  <div className='board-detail-write-date'>{getWriteDateFormat()}</div>
                </div>

                {/* 더보기 아이콘 버튼 */}
                <div className='icon-button' onClick={onMoreButtonClickHandler}>
                  <div className='icon more-icon'></div>
                </div>

                {/* 더보기 아이콘 상세: update, delete버튼 
                showMore = true : mores아이콘 보임*/}
                {showMore && 
                <div className='board-detail-more-box'>
                  <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                  <div className='divider'></div>
                  <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                </div>}
                

              </div>
          </div>
          <div className='divider'></div>

          <div className='board-detail-top-main'>
              <div className='board-detail-main-text'>{board.content}</div>
              {board.boardImageList.map(image=> <img className='board-detail-main-image' 
              src={image}/>)}
              
          </div>
        
      </div>
    );

  }
//          component: 게시물 상세 하단 화면  컴포넌트                        //

  const BoardDetailBottom =()=>{

//         state: 댓글 textarea 참조 상태                                  //

const commentRef = useRef<HTMLTextAreaElement|null>(null);
//         state: 페이지네이션 관련 상태                                  //
//usePagination 호출
//타입 : CommentListItem  , 한페이지에 5개 보여줌
//pagination hook에서 받아 온것들
const { currentPage,currentSection,viewList,viewPageList,totalSection, 
  setCurrentPage,setCurrentSection,setTotalList
  } = usePagination<CommentListItem>(5); // countPerPage =3

//         state: 좋아요 리스트 상태                                       //
/**
 * 타입 :<FavoriteListItem[]> : email, nickname, profileImage 필드를 가진 인터페이스
 * 초기값 [] 빈배열
*/
const [favoriteList , setFavoriteList] = useState<FavoriteListItem[]>([]);

//         state: 좋아요 상태                                                //

const[isFavorite , setFavorite] = useState<boolean>(false);

//         state: 좋아요 상자 보기 상태                                    //

const[showFavorite , setShowFavorite] = useState<boolean>(false);

//         state: 댓글 상자 보기 상태                                      //

const[showComment , setShowComment] = useState<boolean>(false);

//         state: 댓글 상태                                      //

const[comment , setCommennt] = useState<string>('');

//        state : 전체 댓글 갯수 상태                           //

const[totalcommnetCount, setTotalCommentcount] = useState<number>(0);

//         function : get favorite list response 처리 함수             //

const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {

  // console.log("responseBody========>", responseBody); //출력됨.

  if (!responseBody) return;
    
    const { code } = responseBody 
    if (code === 'NB') alert('존재하지 않는 게시판입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;
    
    const { favoriteList } = responseBody as GetFavoriteListResponseDto;
    // console.log("favoriteList ==============>", favoriteList);
    setFavoriteList(favoriteList);

    if(!loginUser) {
      setFavorite(false);
      return}

      // 로그인 -> 게시물 검색 -> 자동 좋아요 
      /**
       * xx => xx.email  : favoriteList 에서 email속성을 찾기
       * findIndex 메소드가 배열에서 찾고자 하는 조건을 만족하는 요소를 찾았을 때, 
       * 해당 요소의 인덱스가 반환되어 -1이 아니기 때문에 이 조건은 true가 되어 
       * 해당 조건을 만족하는 요소가 존재한다는 것을 나타냅니다.
       * 
       * (xx => xx.email === loginUser.email ) 0 반환(인덱스번호):  0 !== -1 --> true(달참 같거)
       * 
       */
     const isFavorite = favoriteList.findIndex(xx => xx.email === loginUser.email ) !== -1;
    //  console.log('isFavorite==============?', isFavorite) // true
     setFavorite(isFavorite); //true , 좋아요가 클릭됨
}
//         function : get comment list response 처리 함수             //
const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null)=>{

  // console.log("responseBody========>", responseBody); 
  if (!responseBody) return;
    
    const { code } = responseBody 
    if (code === 'NB') alert('존재하지 않는 게시판입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;
    
    const { commentList } = responseBody as GetCommentListResponseDto;
    // console.log("commentList ==============>", commentList);
    setTotalList(commentList); //usePagination: setTotalList 호출
    setTotalCommentcount(commentList.length) 
}
//         function : put favorite response 처리 함수                 // 
const putFavoriteResponse =(responseBody: PutFavoriteResponseDto|ResponseDto|null)=>{

  if (!responseBody) return;
  const { code } = responseBody 
    if (code === 'VF') alert('잘못된 접근입니다.');
    if (code === 'NU') alert('존재하지 않는 유저입니다.');
    if (code === 'NB') alert('존재하지 앟는 게시물 입니다.')
    if (code === 'AF') alert('인증에 실패 했습니다.')
    if (code === 'DBE') alert('데이터베이스 오류입니다.')
    if (code !== 'SU') return;
    
    //좋아요 클릭 ==> favoriteList.length 증가, 좋아요 인원 증가
    //{favoriteList.map(item=><FavoriteItem favoriteItemList={item}/>)} 에 한명더 추가
    if(!boardNumber) return
    getFavoriteListRequest(boardNumber).then(getFavoriteListResponse)

}

//         function : post comment response 처리 함수                        //

const postedComment = (responseBody: PostCommentResponseDto | ResponseDto | null)=>{

  console.log('댓글 처리 됐나???=========>', responseBody)

  if (!responseBody) return;
  const { code } = responseBody 
    if (code === 'VF') alert('잘못된 접근입니다.');
    if (code === 'NU') alert('존재하지 않는 유저입니다.');
    if (code === 'NB') alert('존재하지 앟는 게시물 입니다.')
    if (code === 'AF') alert('인증에 실패 했습니다.')
    if (code === 'DBE') alert('데이터베이스 오류입니다.')
    if (code !== 'SU') return;

    //댓글 작성후 textarea비워주기
    setCommennt('');

    //댓글 작성후 commentList 길이 늘리기
    if(!boardNumber) return
    getCommentListRequest(boardNumber).then(getCommentListResponse)

}

//        event handler : 좋아요 클릭 이벤트 처리                            //

const onFavoriteClickHandler =()=>{
  //isFavorite : false --> true
  // setFavorite(!isFavorite)
  if(!boardNumber || !loginUser || !cookies.accessToken ) return;
  // console.log('게시물 상세 하단 컴포넌트  cookies.accessToken ==================>', cookies.accessToken)

  putFavoriteRequest(boardNumber,  cookies.accessToken).then(putFavoriteResponse)

}
//        event handler : 좋아요 상자 보기                                  //

const onShowFavoriteClickHandler =()=>{
  //showFavorite : false --> true
  setShowFavorite(!showFavorite)

}

//        event handler : 댓글 상자 보기                                    //

const onShowCommentClickHandler =()=>{
  //showComment : false --> true
  setShowComment(!showComment)

}
//        event handler : 댓글 작성 버튼 클릭 이벤트 처리                   //

const onCommentsubmitButtonClickHandler =()=>{
  
  if(!comment ||!boardNumber||!loginUser||!cookies.accessToken) return
  const requestBody :PostCommentRequestDto = {content:comment};
  PostCommentRequest(boardNumber,requestBody,cookies.accessToken).then(postedComment) //

}
//        event handler : 댓글 변경 이벤트 처리                            //

const onCommentChangeHandler =(event: ChangeEvent<HTMLTextAreaElement>)=>{
  
  const{value} = event.target
  setCommennt(value)

  //댓글 작성 사이즈 만큼   textarea크기 증가
  if(!commentRef.current) return
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;

  // 엔터키로 '댓글 작성' 클릭되게 만들어 보기
  // if(event.key !== 'Enter') return;

  // onSignInButtonClickHandler();
}

//        effect : 게시물 번호 path variable이 바뀔때 마다 좋아요, 댓글리스트 불러오기//

useEffect(() => {  
  
  if(!boardNumber) return;
  getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
  getCommentListRequest(boardNumber).then(getCommentListResponse);
  
}, [boardNumber]);  



//          render: 게시물 상세 하단 화면  렌더링                                           //

    return(
      <div id='board-detail-bottom'>
        <div className='board-detail-bottom-button-box'>

          <div className='board-detail-bottom-button-group'>

            {/* // 좋아요 아이콘 클릭 --> */}
            <div className='icon-button' onClick={onFavoriteClickHandler}>
              {isFavorite ?  
              <div className='icon favorite-fill-icon' ></div> : 
              <div className='icon favorite-light-icon' ></div>
              }
            </div>

            {/* 화살표 버튼 : showFavorite ==> 창을 열어주는 역할*/}
            <div className='board-detail-bottom-button-text' >{`좋아요 ${favoriteList.length}`}</div>
            <div className='icon-button' onClick={onShowFavoriteClickHandler}>
              {/* showFavorite 초기값 false --> 클릭 true*/}
              {showFavorite? <div className='icon up-light-icon'></div> : 
                             <div className='icon down-light-icon'></div>}
              
            </div>

          </div>
          <div className='board-detail-bottom-button-group'>

            <div className='icon-button'>
              <div className='icon comment-icon'></div>
            </div>

            <div className='board-detail-bottom-button-text'>{`댓글 ${totalcommnetCount}`}</div>
              {/* 댓글 열기 버튼 */}
            <div className='icon-button' onClick={onShowCommentClickHandler}>
              {/* showComment 초기값 false -> 클릭 true  */}
              {showComment? <div className='icon up-light-icon'></div> : 
                             <div className='icon down-light-icon'></div>}
            </div>

          </div>
        </div>
        {/* showFavorite (초기값:false) : true일때 좋아요 보여주기 : 화살표 아이콘과 연동 -> 좋아요 한사람들 보여주기 
            좋아요 클릭한 사람들 표시 */}
        {showFavorite &&
        <div className='board-detail-bottom-favorite-box'>
          <div className='board-detail-bottom-favorite-container'>
            <div className='board-detail-bottom-favorite-title'>{'좋아요'}
            <span className='emphasis'>{favoriteList.length}</span></div>
            <div className='board-detail-bottom-favorite-contents'>

              {/*favoriteList 요소를 순회하여 FavoriteItem 컴포넌트에 Prop전달 */}
              {favoriteList.map(item=><FavoriteItem favoriteItemList={item}/>)}
              
            </div>
          </div>
        </div> }

        {/* showComment (초기값:false) : true일때 댓글 보여주기 : 화살표 아이콘과 연동
            viewList는 CommentItem에 무조건 5개씩 보내기로 설정*/}
        {showComment &&
         <div className='board-detail-bottom-comment-box'>
          <div className='board-detail-bottom-comment-container'>
            <div className='board-detail-bottom-comment-title'>{'댓글'}<span className='emphasis'>{totalcommnetCount}</span></div>
            <div className='board-detail-bottom-comment-list-container'>
              {viewList.map(item=><CommentItem commentListItem={item} />)}
            </div>
          </div>
          
          <div className='divider'></div>

          {/* 페이징 처리 */}
          <div className='board-detail-bottom-comment-pagination-box'>
              <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
               />
          </div>

          {/* textarea  : 로그인이 되어있어야 댓글 달기 가능*/}
          {loginUser !== null && 
          <div className='board-detail-bottom-comment-input-box'>
            <div className='board-detail-bottom-comment-input-container'>
              <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해 주세요' 
              onChange={onCommentChangeHandler} value={comment} ></textarea>  
              <div className='board-detail-bottom-comment-button-box'>
                <div  className={comment === ''? 'disable-button': 'black-button'} onClick={onCommentsubmitButtonClickHandler}>{'댓글달기'}</div>
              </div>
            </div>  
          </div>}
          
        </div>}
      </div>
    );

  }

//          effect : 게시물 번호 path variable이 바뀔때 마다 게시물 조회수 증가 //

//API 반복 요청을 실행하지 않도록 하는 역할
//게시물 한번 요청시 한번만 뷰카운트 올리기
//어떻게 한번만 작동하지???
let effectFlag = true;

useEffect(() => {
  if (!boardNumber) return;

  // console.log("11111111", effectFlag);

  if (effectFlag) {  
    effectFlag = false;
    // console.log("22222222", effectFlag);
    return;
  }

  // console.log("33333333333", effectFlag);
  increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
}, [boardNumber]);



//          render: 게시물 상세 화면(전체)  렌더링                            //
  return (
    <div id='board-detail-wrapper'>
      <div className='board-detail-container'>
        <BoardDetailTop/>
        <BoardDetailBottom/>    
      </div>
    </div>
  )
}
function useEffeect(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}



