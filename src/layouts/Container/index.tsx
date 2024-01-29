
import { Outlet, useLocation } from "react-router-dom";
import Footer from "layouts/Footer";
import Header from "layouts/Header";
import { AUTH_PATH } from "constant";






//       component: 레이아웃                              //
export default function Container() {

// 인증화면은 Footer가 없어야 됨
//       state :  현재페이지의 path name 상태             //

//현재 경로 상태를 보여주는 함수  useLocation()
const {pathname} = useLocation();



//       render: 레이아웃 렌더링                          //
  return (
    <>
        
        <Header/>

        {/* 
        App.tsx에서 라우팅 된 컴포넌트들(views)이 Outlet을 통해서 나감.*/}
          <Outlet/>

        {/*
         인증화면은 Footer가 없어야 됨
         AUTH_PATH() -> /auth 가 아닌 다른 경로에 있을 때에만 <Footer/>가 출력
         /board !== /auth (참) --> Footer 렌더링  O
         /auth !== /auth (거짓) --> Footer 렌더링 X
         */}
        {pathname !== AUTH_PATH() && <Footer/>}
         
        
    </>
  )
}
