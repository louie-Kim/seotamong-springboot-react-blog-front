import React, { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import './style.css';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';
import BoardDetail from 'views/Board/Detail/Index';
import { PostboardRequest, fileUploadRequest, patchBoardRequest } from 'apis';
import PostBoardRequestDto from 'apis/Request/board/post-board.requset.dto';
import PostBoardResponseDto from 'apis/Response/board/post-board.ResponseDto';
import { ResponseDto } from 'apis/Response';
import patchBoardRequestDto from 'apis/Request/board/patch-board.request.dtp';
import PatchBoardResponseDto from 'apis/Response/board/patch-board.Response.dto';





//        component: 헤더레이아웃                                                           //
export default function Header() {

//       state : 로그인 유저 상태                        //

const{loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

//      state:  path 상태                                        //

const {pathname} = useLocation();


//        state : cookie 상태 확인                                  //
//로그인 상태 확인
const [cookies, setCookies] = useCookies();

//       state : 로그인 상태                                        //
const[isLogin, setLogin] = useState<boolean>(false);

//       state : 인증 페이지  상태                                  //
const[isAuthPage, setAuthPage] = useState<boolean>(false);

//       state : 메인 페이지  상태                                  //
const[isMainPage, setMainPage] = useState<boolean>(false);

//       state : 검색 페이지  상태                                  //
const[isSearchPage, setSearchPage] = useState<boolean>(false);

//       state : 게시물 상세 페이지  상태                           //
const[isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);

//       state : 게시물 작성 페이지  상태                            //
const[isBoardWritePage, setBoardWritePage] = useState<boolean>(false);

//       state : 게시물 수정 페이지  상태                            //
const[isBoardUpdatePage, setBoardUpdatePag] = useState<boolean>(false);

//       state : 유저 페이지  상태                                   //

const[isUserPage, setUserPage] = useState<boolean>(false);


//각각의 경로 들고 오기



//        function : 네비게이트 함수                     //

const navigate = useNavigate();



//        event handler : 로고 클릭 이벤트 처리 함수     //

// 로고 클릭시 메인화면으로 
const onLogoClickHandler = () =>{

  navigate(MAIN_PATH());

}

//       component:     검색 버튼 컴포넌트                                   // 

const SearchButton = () =>{



//       state : 엔터를 치면 검색되게 설정                               //  

//useRef 의 타입 : HTMLDivElement,  null   : 초기값 null
const searchWordRef = useRef<HTMLDivElement | null>(null);

//       state : 검색 버튼 상태                                          //  

//boolean타입 초기값 false로 useState 사용
const[status, setStatus] = useState<boolean>(false);

//       state : 검색어 상태                                              //  
// 초기값 : ''
const [word, setWord] = useState<string>('');

//       state : 검색어 path variable 상태                                //  
//path variable 잡아오기
//useParams()  : url 의 path variable 를 가져옴
const{searchWord} = useParams();


//       event Handler : 검색어 변경 이벤트 처리 함수                        //
// ChangeEvent의 타입 : HTMLInputElement
// <input>의 값 변화를 모니터링, setWord 로 검색어를 업데이트 

const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

  const value = event.target.value; // == value={word}

  setWord(value);  // 검색어 업데이트

};
//       event Handler : 검색어 키 이벤트 처리 함수                        //
//  KeyboardEvent<HTMLInputElement> 컴파일 오류 -> any 로 대체
const onSearchWordKeyDownHandler = (event: any) => {

  //'Enter' 키가 아닌 다른 키가 눌렸을 때 함수의 실행을 중단
  if(event.key !== 'Enter') return; 
  //searchWordRef가 null이면(아직 DOM요소에 접근하지 못한 상태)  함수 실행을 중단
  if(!searchWordRef.current) return; 
  // div태그에 onClick()이벤트를 강제 발생시킴 -> 돋보기 아이콘 클릭
  searchWordRef.current.click(); 
  
};

//       event Handler : search icon 클릭 버튼 이벤트 처리 함수              //
const onSearchButtonClickHandler = () => {

   if(!status){
    setStatus(!status);           // status = true -->  입력창 보여짐
    return;
  }

  navigate(SEARCH_PATH(word)); //검색어 입력 --> /search/${word}로 이동

};
//       effect : 검색어 path variable이 변경 될때 마다 실행될 함수           //

//인풋창에 입력한 검색어가 잡혀있게 함.
//searchWord 이 바뀔때 마다 useEffect실행
//searchWord 값이 유지 --> 검색어 유지, 입력창 열어둠.
useEffect(()=>{
  
  //검색어가 있으면 
  if(searchWord) {
    // const [word, setWord] = useState<string>(''); 의 'word'의 값을 업데이트
    // 입력 상자에는 searchWord의 값이 표시 : <input  value={word}>
    setWord(searchWord);    
    setStatus(true);       // 입력창을 열어둠
  }
  
},[searchWord])

//       render : 검색 버튼 컴포넌트 렌더링 (클릭 false 상태)                                   //
if(!status)
return (
<div className='icon-button' onClick={onSearchButtonClickHandler}>
  <div className='icon search-light-icon'></div>
</div>
);
else
//       render : 검색 버튼 컴포넌트 렌더링  (클릭 true 상태)                                   //
return (
// icon search-light-icon' 클릭 --> 인풋 박스 보임
<div className='header-search-input-box'>

  <input className='header-search-input' type='text' placeholder='검색어를 입력하세요.' 
  value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
   
    <div ref={searchWordRef} className='icon-button' onClick={onSearchButtonClickHandler}>   
      <div className='icon search-light-icon' ></div>
    </div>

</div>

     );

  
} // 검색버튼 컴포넌트

//       component:     로그인, 로그아웃, 마이페이지 버튼 컴포넌트                          // 

const MyPageButton = () =>{ 

//     state : userEmail path variable 상태                                 //

//http://localhost:3000/user/test@gmail.com 

const {userEmail} = useParams(); // test@gmail.com 


//      event handler : 마이페이지 버튼 클릭 이벤트 처리 함수               //

const onMyPageButtonClickHandler =()=>{

  if(!loginUser) return;

  const{email} = loginUser; 
  
  //email = null : navigate 동작 안함
  navigate(USER_PATH(email)); //  --> url: http://localhost:3000/user/ test@gmail.com =(userEmail)
  
};
//      event handler : 로그아웃 버튼 클릭 이벤트 처리 함수               //

const onSignOutButtonClickHandler =() => {

  resetLoginUser();

  //로그 아웃시 토큰 날려버림 : '' ,  만료일 현재시간 
  setCookies('accessToken' ,'', {expires: new Date(), path: MAIN_PATH()})

  navigate(MAIN_PATH()); 
};


//      event handler : 로그인 버튼 클릭 이벤트 처리 함수                  //

const onSignInButtonClickHandler =()=>{
  navigate(AUTH_PATH())   //    '/auth' 인증페이지
};


//        render: 로그 아웃 버튼 컴포넌트 렌더링                                              //

//const {userEmail} = useParams(); : url 경로상 이메일 userEmail들고 옴
//loginUser?.email : 로그인한 유저의 email 
if(isLogin && userEmail === loginUser?.email)
return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>;

//        render: 마이페이지 버튼 컴포넌트 렌더링                                             //
if(isLogin) 
return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>;

//        render: 로그인 버튼 컴포넌트 렌더링                                                  //
else
return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>;
    
  
}//로그인, 로그아웃 ,마이페이지 버튼 컴포넌트 

//       component:      업로드 버튼 컴포넌트                                                 // 


const UpLoadButton = () =>{
//       state:  게시물 번호 상태 path variable 상태                         //

const {boardNumber} = useParams()

//       state:  게시물 상태                                                //

const {title, content, boardImageFileList, resetBoard} = useBoardStore();

//       function : post board response  처리 함수                          //
//에러메세시 처리
const postBoardResponse =(responseBody: PostBoardResponseDto | ResponseDto | null) => {

    if(!responseBody) return;
    const {code} = responseBody

    if(code ==='DBE') alert('데이터 베이스 오류 입니다.')
    if(code ==='AF' || code ==='NU') navigate(AUTH_PATH());
    if(code === 'VF') alert('제목과 내용은 필수 입니다.');
    if(code !== 'SU') return; // 성공이 아니면 종료
    resetBoard();
    
    if(!loginUser) return
    const {email} = loginUser

    navigate(USER_PATH(email)); //마이페이지로 이동
}

//      function : patch board response 처리 함수                            //

const patchBoardResponse =(responseBody: PatchBoardResponseDto|ResponseDto|null)=>{

  if(!responseBody) return;
    const {code} = responseBody

    if(code ==='DBE') alert('데이터 베이스 오류 입니다.')
    if(code ==='AF' || code ==='NU' || code==='NB'|| code==='NP') navigate(AUTH_PATH());
    if(code === 'VF') alert('제목과 내용은 필수 입니다.');
    if(code !== 'SU') return; // 성공이 아니면 종료

    if(!boardNumber)return

    // update후 board/detail/${boardNumber} 로 이동
    navigate(BOARD_PATH()+ '/' + BOARD_DETAIL_PATH(boardNumber)) 

} 
 
//        event handler : 업로드 버튼 클릭이벤트 처리 함수                  //

const onUpLoadButtonClickHnadler = async() =>{

    const accessToken = cookies.accessToken
    if(!accessToken) return;

    //빈배열 boardImageList
    const boardImageList: string[]  = [];

    //이미지 파일 업로드
    //FormData() : 주로 파일, 폼 데이터(html)를 AJAX를 통해 서버로 전송할 때 사용
    for(const file of boardImageFileList){
        const data = new FormData();  // 서버로 전송 가능한 data객체
        data.append('file',file);

        const url = await fileUploadRequest(data); //api에서 요청 받아옴
        if(url) boardImageList.push(url);  // 빈배열에 이미지url 넣기
    }


    // 업로드 버튼의 두가지 역할 : 1 새 게시물 등록 2. 게시물 업데이트 
    // board/write --> 게시물 등록
    const isWriterPage =  pathname ===  BOARD_PATH() + '/' + BOARD_WRITE_PATH() 
    if(isWriterPage){
      console.log('게시물 등록 요청!!!!!!!!!!!!!!!!!!')
      const requestBody : PostBoardRequestDto = {
        title, content, boardImageList
      }   
      //새 게시물 등록 요청
     PostboardRequest(requestBody, accessToken).then(postBoardResponse);

    }else{
      //게시물 업데이트 요청
      if(!boardNumber) return
      const requestBody : patchBoardRequestDto =  {
        title, content, boardImageList
      }
      console.log('게시물 수정 요청!!!!!!!!!!!!!!!!!!')
      patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse)
    }

    


}

//        render: 업로드 버튼 컴포넌트 렌더링                                                  //
//제목과 내용 둘다 있으면
if(title && content)
  return <div className='black-button' onClick={onUpLoadButtonClickHnadler}>{'업로드'}</div>;


//        render: 업로드 불가 버튼 컴포넌트 렌더링                                             //
else
return <div className='disable-button'>{'업로드'}</div>;


}//업로드 버튼 컴포넌트


//        effect:  pathname이 변경 될때 마다 실행될 함수                       //

//경로 변수설정
// '===' 정확한 일치 여부를 확인 , startsWith() : 문자열의 시작 부분을 확인
useEffect(()=>{

const isAuthPage = pathname.startsWith (AUTH_PATH());
setAuthPage(isAuthPage)

// MAIN_PATH() : '/' 과 pathname 이 정확히 일치하는지 확인
// 현재 경로(pathname)가 '/'루트 경로이면  -> isMainPage (true)
// const[isMainPage, setMainPage] = useState<boolean>(true);
const isMainPage = pathname === MAIN_PATH();
setMainPage(isMainPage)


// 현재 경로가 /search/ 로 시작하면 -> isSearchPage (true)
const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
setSearchPage(isSearchPage)

//현재경로가 /board/detail/ 로 시작되면 isBoardDetailPage = true
const isBoardDetailPage = pathname.startsWith(BOARD_PATH() +'/'+BOARD_DETAIL_PATH(''));
setBoardDetailPage(isBoardDetailPage)

const isBoardWritePage = pathname.startsWith(BOARD_PATH() +'/'+BOARD_WRITE_PATH());
setBoardWritePage(isBoardWritePage)

const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() +'/'+BOARD_UPDATE_PATH(''))
setBoardUpdatePag(isBoardUpdatePage)

const isUserPage = pathname.startsWith(USER_PATH(''));
setUserPage(isUserPage)

// console.log(BOARD_PATH +'/'+BOARD_WRITE_PATH())
console.log(isBoardDetailPage)
// console.log(isBoardWritePage)
// console.log(isSearchPage)


},[pathname])



//        effect:  loginUser 변경 될때 마다 실행될 함수                                 //

useEffect(()=>{
  /**
   * App.tsx
   * const loginUser: User = {...responseBody as GetSignInUserResponseDto};
   * setLoginUser(loginUser);
   */
  //로그인한 유저가 있음 : loginUser !== null : 참
  setLogin(loginUser !== null)  // isLogin => true ==> 마이페이지 버튼 보임 

},[loginUser])


//        render: 헤더 레이아웃 렌더링                                                                //



  return (
    <div id='header'>

      <div className='header-container'>

        <div className='header-left-box' onClick={onLogoClickHandler}>

          <div className='icon-box'>
            <div className='icon logo-dark-icon'> </div>
          </div>

          <div className='header-logo'>{'JY BLOG'}</div>

        </div>

        <div className='header-right-box'>
          {/* 경로 변수들은 boolean타입: 초기 설정 false, 
          useEffect()에서 true 값을 받아오면 거기에 맞는 컴포넌트 렌더링  */}

          {/* search버튼이나와야 하는  페이지 처리 */}
          {(isAuthPage||isMainPage||isSearchPage||isBoardDetailPage) && <SearchButton/>}
          {/* MyPageButton 버튼이 나와야 하는 페이지 처리 */}
          {(isMainPage||isSearchPage||isBoardDetailPage||isUserPage) && <MyPageButton/>}
          {/* upload 버튼이 나와야 하는 페이지 처리 */}
          {(isBoardWritePage||isBoardUpdatePage) && <UpLoadButton/>}
          
        </div>

      </div>
    </div>
  )
}
