//PI와의 통신을 담당하는 함수들을 정의

import axios from "axios";
import { SignInRequestDto, SignUpRquestDto } from "./Request/auth";
import PostBoardRequestDto from "./Request/board/post-board.requset.dto";
import { ResponseDto } from "./Response";
import { SignInResponseDto, SignUpResponseDto } from "./Response/auth";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from "./Response/user";
import PostBoardResponseDto from "./Response/board/post-board.ResponseDto";
import { DeleteBoardResponseDto, GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto, GetLatestBoardListResponseDto, GetSearchBoardListResponseDto, GetTop3BoardListResponseDto, GetUserBoardListResponseDto, IncreaseViewCountResponseDto, PatchBoardResponseDto, PutFavoriteResponseDto } from "./Response/board/indexs";
import Authentication from "views/Authentication/Index";
import PostCommentRequestDto from "./Request/board/post-comment.RequestDto";
import patchBoardRequestDto from "./Request/board/patch-board.request.dtp";
import { GetPopularListResponseDto, GetRelationListResponseDto } from "./Response/search";
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from "./Request/User";



const DOMAIN = 'http://localhost:4000';


const API_DOMAIN = `${DOMAIN}/api/v1`;

/**
 * 요청헤더 를 Authorization로 세팅하고 Bearer 에 accessToken(jwt) 을 실어 보냄
 * accessToken 매개변수에 실제 JWT 값을 전달해야 함.
 * @param accessToken 
 * @returns 
 */
const authorization = (accessToken: string) =>{
    return {headers: {Authorization: `Bearer ${accessToken}` }}
}

//로그인 및 회원가입에 필요한 데이터를 받아 서버에 요청 : 백엔드와의 통신

//SignInRequestDto 객체를 받아 로그인 요청
/**
 * ignInRequestDto 타입의 객체를 받아들이며, 
 * 그 객체를 requestBody라는 이름으로 함수 내부에서 사용
 * 함수 내에서는 requestBody를 통해 객체의 속성들에 접근
 * 
 * 자바,타입스크립트는 : (동작을 기다리지 않는 )비동기방식
 * 
 * @param requestBody 
*/
const SIGN_IN_URL = () =>`${ API_DOMAIN}/auth/sign-in`;
export const signInRequest = async (requestBody: SignInRequestDto) =>{

 
     /**
     * axios.post : 서버에 POST 요청을 보내는 axios 함수
     * await : axios.post() 메서드가 서버에 POST 요청을 보내고, 
     * 해당 요청이 완료되어 응답이 올 때까지 기다리는 역할
     */
     const result = await axios.post(SIGN_IN_URL(),requestBody )
     

     //성공 응답 .then()
     /**
      * response : axios.post 요청의 응답에서  response를추출한것
      * response :  서버로부터 받은 데이터와 응답 상태, 헤더 등의 정보를 포함
      */
     .then(response=>{
          
          //SignInResponseDto 타입의 reponseBody
          /**
           * 서버측(SignInResponseDto)성공 응답을 response.data로받아와
           * SignInResponseDto로 형변환 --> token, expirationTime 받아옴
           * response.data: 실제 데이터, json형식
          */
         const reponseBody: SignInResponseDto = response.data;
         return reponseBody;
     })
     //로그인 실패응답 catch()
     /**
      * catch() :axios.post() 요청의 응답에서 발생한 오류를 처리
      * error : axios.post 요청의 응답에서 error를 추출한것
      * 
      * error.response.data : 서버로 부터 받은(실패) 데이터를 형변환
     */
    .catch(error=>{
         
         if(!error.response.data) return null;
         const reponseBody: ResponseDto = error.response.data;
         return reponseBody;
     });
     
     
     return result;

}

const SIGN_UP_URL = () =>`${ API_DOMAIN}/auth/sign-up`;
//SignUpRequestDto 객체를 받아 회원가입 요청
export const signUpRequest = async (requestBody: SignUpRquestDto) => {

     const result = await axios.post(SIGN_UP_URL(), requestBody)

          /**
           * response : 성공 테이터
           * 서버 응답 데이터(성공)를 특정한 형태로 '형변환'
           * response.data: 실제 데이터, json형식
           */
        .then(response => {
            
            const reponseBody: SignUpResponseDto = response.data;
            return reponseBody;
        })

        /**
         * error : axios.post 요청의 응답에서 error를 추출한것
         * error.response.data : 서버로 부터 받은(실패) 데이터를 형변환
         */
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

        console.log('회원 가입 결과=====>:', result); //{code: 'SU', message: 'Success.'}
    return result;
}


const GET_SIGN_IN_USER = () => `${API_DOMAIN}/user`;
//accessToken을 매개변수로 받아와서 서버로부터 사용자 정보를 가져옴
//App.tsx : getSignInUserRequest(cookies.accessToken).에서 매개변수 전달
export const getSignInUserRequest = async(accessToken: string ) => {

    const result = await axios.get(GET_SIGN_IN_USER(), authorization(accessToken))

    //성공시
    .then(reponse=>{

        const responseBody : GetSignInUserResponseDto = reponse.data;
        return responseBody

    })
    //실패시
    .catch(error=>{

        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
         
    })
   
    /**
     * 요청이 성공 -> (GetSignInUserResponseDto)인 responseBody가 result에 담기게 됩니다.
     * 요청 실패   -> (ResponseDto) 인 responseBody가 가 result에 담기게 됩니다.
     */
    return result;

}
//게시물 상세보기
//http://localhost:4000//api/v1/board/게시물 번호
const GET_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`
export const getBoardRequest = async(boardNumber: number|string) =>{
    //벡)  controller로 요청
    const result = await axios.get(GET_BOARD_URL(boardNumber))
    .then(response=>{
        const oo: GetBoardResponseDto = response.data
        return oo;
    })
    .catch(error=>{
        if(!error.response) return null;
        const oo: ResponseDto = error.response.data
        return oo;
    })
    return result;
}

//http://localhost:4000/api/v1/board/게시물 번호/increase-view-count
const INCREASE_VIEW_COUNT_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`
export const increaseViewCountRequest = async(boardNumber: number|string) =>{

    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))

    .then(response=>{
        const responseBody : IncreaseViewCountResponseDto = response.data
        return responseBody;
    })
    .catch(error=>{
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data
        return responseBody
    })
    return result;
}



//http://localhost:4000//api/v1/board/${boardNumber}/favorite-list
const GET_FAVORITE_LIST_URL = (boardNumber: number|string) =>`${API_DOMAIN}/board/${boardNumber}/favorite-list`
//좋아요 리스트 받아오기
export const getFavoriteListRequest  = async (boardNumber: number|string) => {
    try {
        const response = await axios.get(GET_FAVORITE_LIST_URL(boardNumber));
        // console.log('axios.get() 결과:', response);
        const responseBody: GetFavoriteListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }
}
//백엔드)http://localhost:4000//api/v1/board/${boardNumber}
const DELETE_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`
//게시물 삭제
export const deleteBoardRequest = async(boardNumber: number|string, accessToken: string) =>{

    try {
        const response = await axios.delete(DELETE_BOARD_URL(boardNumber),  authorization(accessToken) );
        console.log('axios.delete() 결과:', response);
        const responseBody: DeleteBoardResponseDto = response.data; //성공데이터
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.delete() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
      }

}


//백엔드)http://localhost:4000//api/v1/board/${boardNumber}/comment
const POST_COMMENT_URL = (boardNumber: number|string) =>`${API_DOMAIN}/board/${boardNumber}/comment`
//댓글작성 요청
export const PostCommentRequest = async (boardNumber: number|string, requestBody: PostCommentRequestDto, accessToken: string) =>{

    /**
     *  axios.post 매개변수 
     *  1. url: 요청을 보낼 API 엔드포인트 주소를 나타내는 문자열.
        2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 :  data (선택사항)
        3. HTTP 요청 헤더 정보가 전달 : config (선택사항)
     */
    try {
        const response = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken) );
        console.log('댓글작성 상공:', response);
        const responseBody: PostCommentRequestDto = response.data; //성공데이터
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('댓글작성 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
      }


}

//백엔드)http://localhost:4000//api/v1/board/${boardNumber}/comment-list
const GET_COMMENT_LIST_URL = (boardNumber: number|string) =>`${API_DOMAIN}/board/${boardNumber}/comment-list`
//댓글 리스트 요청
export const getCommentListRequest = async (boardNumber: number|string) =>{

    /**
     *  axios.get 매개변수
     * 1. API 엔드포인트 주소를 나타내는 문자열.
     * 2. HTTP 요청 헤더 정보가 전달 : 선택사항
     */
    try {
        const response = await axios.get(GET_COMMENT_LIST_URL(boardNumber));
        console.log('코멘트 리스트 결과:', response);
        const responseBody: GetCommentListResponseDto = response.data; //성공데이터
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('코멘트 리스트 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
      }

}

//http://localhost:4000/api/v1/board/{boardNumber}/favorite
const PUT_FAVORITE_URL = (boardNumber : number|string ) =>`${API_DOMAIN}/board/${boardNumber}/favorite`
//좋아요 넣기
export const putFavoriteRequest = async (boardNumber : number|string, accessToken:string) =>{
    /**
     * axios.put 매개변수 
     * 1. API 엔드포인트 
     * 2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 : data (선택사항)
     * 이 부분은 DTO 객체나 요청에 필요한 데이터를 채워 넣어야 합니다. 
     * 3. HTTP 요청 헤더 정보가 전달: : config (선택사항)
     */
    try {                                             
        const response = await axios.put(PUT_FAVORITE_URL (boardNumber), {} ,  authorization(accessToken))
        // console.log('axios.get() 결과:', response);
        const responseBody: PutFavoriteResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}

//http://localhost:4000//api/v1/board
const POST_BOARD_URL = () => `${API_DOMAIN}/board`
//게시물 등록 요청(로그인된 사용자만 가능)
export const PostboardRequest  = async(requsetBody: PostBoardRequestDto, accessToken:string) =>{
    /**
     *  axios.post 매개변수 
     *  1. url: 요청을 보낼 API 엔드포인트 주소를 나타내는 문자열.
        2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 :  data (선택사항)
        3. HTTP 요청 헤더 정보가 전달 : config (선택사항)
     */
    const result = await axios.post(POST_BOARD_URL(), requsetBody, authorization(accessToken))

    .then(response=>{
        const responseBody: PostBoardResponseDto = response.data
        return responseBody
    })

    .catch(error=>{
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data
        return responseBody

    })

    return result;

}


// 파일 업로드 요청 : http://localhost:4000/file/upload
const FILE_DOMAIN = `${DOMAIN}/file`

//헤더값 설정
//multipart/form-data :   파일 업로드와 같이 바이너리 데이터를전송할 때
const multipartFormData =  {headers:{'Content-Type' : 'multipart/form-data'}}

//FormData : <input type="file"> 엘리먼트로 선택한 파일을 추가할 수 있습니다
//엔드포인트) http://localhost:4000/file/upload
const FILE_UPLOAD_URL = () =>`${FILE_DOMAIN}/upload`
export const fileUploadRequest = (data: FormData) => {
    /**
     *
     *  axios.post 매개변수 
     *  1. url: 요청을 보낼 API 엔드포인트 주소를 나타내는 문자열.
        2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 :  data (선택사항)
        3. HTTP 요청 헤더 정보가 전달
     */
    //data : 
    const result =  axios.post(FILE_UPLOAD_URL(), data, multipartFormData)

      .then((response) => {
        const responseBody: string = response.data;
        return responseBody;
      })


      .catch((error) => {
        console.error("Error in fileUploadRequest:", error);
        return null;
      });

      return result;
  };


function then(arg0: (response: any) => GetFavoriteListResponseDto) {
    throw new Error("Function not implemented.");
}
// http://localhost:4000/api/v1/board/${boardNumber}
// 게시물 업데이트 
const PATCH_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`
export const patchBoardRequest = async (boardNumber: number|string, requestBody: patchBoardRequestDto, accessToken:string)=>{

    try {                                             
        const response = await axios.patch(PATCH_BOARD_URL(boardNumber),requestBody,authorization(accessToken))
        // console.log('axios.get() 결과:', response);
        const responseBody: PatchBoardResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }
   
}
//최신게시물 받아오기
// http://localhost:4000/api/v1/board/latest-list
const GET_LATEST_BOARD_LIST_URL = () =>`${API_DOMAIN}/board/latest-list`
export const getLatestBoardListRequest = async()=>{
    try {                                             
        const response = await axios.get(GET_LATEST_BOARD_LIST_URL())
        console.log('axios.get() 결과:', response);
        const responseBody: GetLatestBoardListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}
//top3리스트 받아 오기
// http://localhost:4000/api/v1/board/top-3
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`
export const getTop3BoardListRequest = async()=>{
    try {                                             
        const response = await axios.get(GET_TOP_3_BOARD_LIST_URL())
        console.log('top3 리스트 요청 결과:', response);
        // GetTop3BoardListResponseDto -> top3List : BoardListItem[]
        const responseBody: GetTop3BoardListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}
//인기 검색어
//엔드포인트) http://localhost:4000/api/v1/search/popular-list
const GET_POPULAR_LIST_URL =() => `${API_DOMAIN}/search/popular-list`
export const getPopularListRequest = async()=>{

    try {                                             
        const response = await axios.get(GET_POPULAR_LIST_URL())
        console.log('axios.get() 결과:', response);
        const responseBody: GetPopularListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}

//검색 게시물 리스트 요청
//엔드포인트) http://localhost:4000/api/v1/board/search-list/{searchWord}
//엔드포인트) http://localhost:4000/api/v1/board/search-list/{searchWord}/{preSearchWord}
/**
 * preSearchWord 있으면 : /preSearchWord
 * preSearchWord 없으면  : /빈문자열
 *  
 */
const GET_SEARCH_BOARD_LIST_URL =(searchWord:string, preSearchWord:string|null)=>`${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`
export const getSearchBoardListRequest = async(searchWord:string, preSearchWord:string|null)=>{

    try {                                             
        const response = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        console.log('axios.get() 검색게시물 리스트 결과:', response);
        const responseBody: GetSearchBoardListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }
}

//연관 검색어 요청
//엔드포인트) http://localhost:4000/api/v1/search/{searchWord}/relation-list
const GET_RELATION_LIST_URL = (searchWord:string) => `${API_DOMAIN}/search/${searchWord}/relation-list`
export const getRelationListRequest = async(searchWord:string) =>{

    try {                                             
        const response = await axios.get(GET_RELATION_LIST_URL(searchWord))
        console.log('axios.get() 연관 검색어:', response);
        const responseBody:  GetRelationListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 연관 검색어 에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }
    
}

//유저의 게시물 리스트 불러오기 
//엔드포인트) http://localhost:4000/api/v1/board/user-board-list/${email}
const GET_USER_BOARD_LIST_URL = (email: string) =>  `${API_DOMAIN}/board/user-board-list/${email}`
export const getUserBoardListRequest = async(email:string) =>{

    try {                                             
        const response = await axios.get(GET_USER_BOARD_LIST_URL(email))
        console.log('axios.get() 유저의 게시물 리스트:', response);
        const responseBody:  GetUserBoardListResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 유저의 게시물 리스트:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }
}
//유저 정보 불러오기
//엔드포인트) http://localhost:4000/api/v1/user/${email}
const GET_USER_URL = (email:string)=>  `${API_DOMAIN}/user/${email}`
export const getUserRequest= async(email:string)=>{

    try {                                             
        const response = await axios.get(GET_USER_URL(email))
        console.log('axios.get() 유저 정보 불러오기성공:', response);
        const responseBody:  GetUserResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 유저 정보 불러오기에러:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}
//닉네임수정
//엔드 포인트) http://localhost:4000/api/v1/user/nickname
const PATCH_NICKNAME_URL = ()=> `${API_DOMAIN}/user/nickname`
export const patchNicknameRequest = async(requestBody: PatchNicknameRequestDto, accessToken:string)=>{
    /**
     * axios.patch 매개변수 
     * 1. API 엔드포인트 
     * 2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 : data (선택사항)
     * 이 부분은 DTO 객체나 요청에 필요한 데이터를 채워 넣어야 합니다. 
     * 3. HTTP 요청 헤더 정보가 전달: : config (선택사항)
     */
     
    try {                                             
        const response = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        console.log('axios.get() 닉네임수정:', response);
        const responseBody:  PatchNicknameResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 닉네임수정:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}


//유저 프로필이미지 수정
//엔드포인트) http://localhost:4000/api/v1/user/profile-image
const PATCH_PROFILE_IMAGE_URL = ()=> `${API_DOMAIN}/user/profile-image`
export const patchProfileImageRequest = async(requestBody: PatchProfileImageRequestDto, accessToken:string)=>{
    /**
     * axios.patch 매개변수 
     * 1. API 엔드포인트 
     * 2. HTTP 요청의 body에 해당하는 데이터(dto)를 전달 : data (선택사항)
     * 이 부분은 DTO 객체나 요청에 필요한 데이터를 채워 넣어야 합니다. 
     * 3. HTTP 요청 헤더 정보가 전달: : config (선택사항)
     */
     
    try {                                             
        const response = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        console.log('axios.get() 프로필이미지 수정:', response);
        const responseBody:  PatchProfileImageResponseDto = response.data;
        return responseBody;
    } catch (error:any) {
        if (!error.response) return null;
        console.log('axios.get() 프로필이미지 수정:', error);
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    }

}
