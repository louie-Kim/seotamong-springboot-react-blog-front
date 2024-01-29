import { User } from "types/interface";
import { create } from "zustand";


//전역적으로 사용하는 상태 변수
interface LoginUserStore{

    loginUser : User | null ; 
    setLoginUser : (loginUser:User) => void;
    resetLoginUser : () => void;

};

//전역적으로 사용하는 상태 함수, (LoginUserStore 인터페이스 구현) 
// zustand 스토어를 생성
// setLoginUser, resetLoginUse : 상태 변경 함수 , 전역적으로 상태를 관리
const useLoginUserStore = create<LoginUserStore>(set =>({

    loginUser : null,

    //(state는: 이전상태, ...state : 모든속성을 복사한 상태 
    //...state  +  loginUser :  업데이트
    setLoginUser : (loginUser) => set(state => ({...state, loginUser})),
    //...state + loginUser:null : 초기화
    resetLoginUser : () => set(state => ({...state, loginUser:null}))

    
}));

export default useLoginUserStore;