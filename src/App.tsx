

import React, { useEffect } from 'react';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from "constant";
import Container from "layouts/Container";
import './App.css' 

import { Route, Routes } from "react-router-dom";
import Authentication from "views/Authentication/Index";
import BoardDetail from "views/Board/Detail/Index";
import BoardUpdate from "views/Board/Update/Index";
import BoardWrite from "views/Board/Write/Index";
import Main from "views/Main/Index";
import Search from "views/Search/Index";
import UserP from "views/User/Index";
import { useCookies } from "react-cookie";
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { ResponseDto } from 'apis/Response';
import { User } from 'types/interface';
import { GetSignInUserResponseDto } from 'apis/Response/user';



//                component: Application 컴포넌트                              //
function App() {


//               state : 로그인 유저 전역 상태                               //

const { setLoginUser, resetLoginUser  } = useLoginUserStore();

//               state :   cookie 상태                                        //

const [cookies, setCookie] = useCookies();

//               function : get sign in response 처리함수                      //

//api 요청 결과 :  
//성공) GetSignInUserResponseDto  -> responseBody : User객체에 정보 넣어서 반환
//실패) ResponseDto -> responseBody : 검색 실패 에러 메세지
const getSignInUserResponse =(responseBody: GetSignInUserResponseDto| ResponseDto |null)=>{
  
  //api : .catch() : 로그인 실패시
  if(!responseBody) return;
  const {code} = responseBody; // <== ResponseDto
  if(code==='AF'||code==='NU'||code==='DBE'){
    resetLoginUser();
    return;
  }
  
  //로그인 성공시
  //api : .then()
  //전개연산자 사용해서 User타입으로 loginUser에 전달
  //유저 정보를 loginUser에 담아서 로그인 유저 업데이트
  const loginUser: User = {...responseBody as GetSignInUserResponseDto};
  setLoginUser(loginUser);

}

//               effect :  access token cookie 값이 변경 될때 마다 실행할 함수   //

//[cookies.accessToken] 변경 : 로그인 
useEffect(() => {
  
  console.log("[cookies.accessToken] JWT ======>", cookies.accessToken);
  
  if(!cookies.accessToken){
    // cookies.accessToken 이없으면 loginUser 값을 null로
    resetLoginUser(); 
    return;

  }
  //api요청
  //getSignInUserRequest(cookies.accessToken) -> (포스트맨 테스트처럼)
  /**
   * "code": "SU",
    "message": "Success.",
    "email": "test@gmail.com",
    "nickname": "jy",
    "profileImage": null
   */
  getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  //cookies.accessToken  : jwt
}, [cookies.accessToken]);

//                render: Application 컴포넌트 렌더링                              //



  return (
    //컴포넌트 들의 경로 지정
    // '/' 경로에는 <Main/>이라는 컴포넌트가 온다
    <Routes>
       {/*<Outlet/> 으로 views 출력 */}
      <Route element={<Container/>}> 

          {/*컴포넌트 들의 경로 지정, '/' 경로에는 <Main/>이라는 컴포넌트가 온다  */}
          <Route path= {MAIN_PATH()} element={<Main/>} />
          <Route path={AUTH_PATH()} element={<Authentication/>} />
          {/* SEARCH_PATH('abc')를 호출하면 반환되는 값은 '/search/abc'가 됩니다 */}
          {/* :searchWord : 경로변수(path variable) */}
          <Route path={SEARCH_PATH(':searchWord')} element={<Search/>} />
          <Route path={USER_PATH(':userEmail')} element={<UserP/>} />

          {/* /board : 공통 경로 묶어주기 
          중첩된 라우팅 들--> /board*/}
          <Route path={BOARD_PATH()}>
              {/* :boardNumber : 경로 변수(path variable)  : 숫자로 입력*/}
              {/* BOARD_DETAIL_PATH(123)을 호출하면 detail/123이라는 경로가 반환 */}
              <Route path={BOARD_WRITE_PATH()} element={<BoardWrite/>} />
              <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail/>} />
              <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate/>} />
          </Route>
          {/* 잘못된 경로일 경우 404메세지출력 */}
          <Route path='*' element={<h1>404 Not Found</h1>}/>

          {/* element = <컴포넌트이름/> : View폴더들 아래 있음*/}

      </Route>
    </Routes>
  );
}

export default App;


function userEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}

