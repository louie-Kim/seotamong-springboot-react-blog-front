import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem} from 'types/interface';
import latestBoardListMock from 'mocks/latest-board-list.mock';
import BoardItem from 'components/BoardItem';
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { fileUploadRequest, getUserBoardListRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/Response/user';
import { ResponseCode } from 'types/enum';
import { ResponseDto } from 'apis/Response';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'apis/Request/User';
import { useCookies } from 'react-cookie';
import { usePagination } from 'hooks';
import GetUserBoardListResponseDto from 'apis/Response/board/get-user-board-list.response.dto';
import Pagination from 'components/Pagination';

//          component: 유저  컴포넌트                                                         //
export default function User() {

//         state:  user email pathvariable 상태                     //

const{userEmail} = useParams()

//         state:  로그인 유저 상태                                 //

const {loginUser} = useLoginUserStore()
//         state:  쿠키 상태                                        //

const [cookies , setCookie] = useCookies()

//         state:  마이페이지 여부 상태                             //
  
const [isMyPage, setMyPage] = useState<boolean>(true);

//         function : 네비게이트 함수                               //

const navigate = useNavigate()

//          component : 유저화면 상단 컴포넌트                                                      //

const UserTop =()=>{
  
//         state: 이미지 파일 인풋 참조 상태                        //
  
  const imageInputRef = useRef<HTMLInputElement|null>(null);

//         state:  닉네임 변경 여부 상태                             //

const [isNicknameChange, setNicknameChange] = useState<boolean>(false);

//         state:  닉네임 상태                                       //

const [nickname, setNickname] = useState<string>('');

//         state:  변경 닉네임 상태                                  //

const [changeNickname, setChangeNickname] = useState<string>('');

//         state:  프로필 이미지 상태                               //

const [profileImage, setProfileImage] = useState<string|null>(null);

//         function : get User Response 처리 함수                       //

// 최초 유저정보 불러오기
const getUserResponse = (body: GetUserResponseDto|ResponseDto|null)=>{

  console.log('유저정보 들어왔나?=========>', body)

  if(!body) return
  const{code} = body
  if(code === 'NU') alert('존재하지않는 유저?? 입니다.')
  if(code === 'DBE') alert('데이터베이스 오류입니다.')
  if(code !=='SU'){
    navigate(MAIN_PATH()) 
    return
  }
    
  //유저 정보 추출 : 닉네임 추출안됨
  const{email, nickname, profileImage} = body as  GetUserResponseDto
  console.log('유저이메일=========>', email)
  console.log('유저닉네임=========>', nickname) //undefined
  console.log('유저프로필=========>', profileImage)


  setNickname(nickname) // undefined --> 닉네임 설정안됨
  setProfileImage(profileImage)
  
  //           유저email = 로그인된 유저 email 
  //로그인 X : isMyPage -> false
  //로그인 O : isMyPage -> true   
  //email : 경로 변수에서 얻어온 이메일   
  const isMyPage = email === loginUser?.email
  console.log('loginUser?.email=========>', loginUser?.email)
  console.log('isMyPage=========>', isMyPage)
  setMyPage(isMyPage) 

}
//         function : file Upload Response 처리 함수                          //
//파일 업로드 변경처리
const fileUploadResponse=(profileImage:string|null)=>{

  console.log('파일 업도르 완료??????=============:', profileImage)

  if(!profileImage) return
  if(!cookies.accessToken) return
  //프로필 이미지 추출 -> requestBody에 담기
  /**
   * requestBody 변수는 PatchProfileImageRequestDto 인터페이스를 따르는 객체로 선언되었습니다. 
   * 이렇게 하면 requestBody 객체가 profileImage 필드를 가져야 하며, 해당 필드의 타입은 string | null이어야 합니다
   */
  const requestBody : PatchProfileImageRequestDto = {profileImage}
  //추출된 프로필 이미지 '수정요청' 
  patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse)

}
//         function : patch ProfileImage Response 처리 함수                       //

const patchProfileImageResponse =(responseBody: PatchProfileImageResponseDto|ResponseDto|null)=>{

  if(!responseBody) return
  const {code} = responseBody
  if(code === 'AF')alert('인증에 실패했습니다.')
  if(code === 'NU')alert('존재하지 않는 유저입니다.')
  if(code === 'DBE')alert('데이터베이스 오류입니다.')
  if(code !== 'SU') return

  if(!userEmail) return
  //수정된 프로필이미지 반영 :  setProfileImage(profileImage)
  getUserRequest(userEmail).then(getUserResponse)
}
//         function : patch Nickname Response 처리 함수                               //
// 수정된 닉네임처리
const patchNicknameResponse = (responseBody: PatchNicknameResponseDto|ResponseDto|null) =>{

  if(!responseBody) return
  const {code} = responseBody
  if(code === 'VF')alert('닉네임은 필수입니다.')
  if(code === 'AF')alert('인증에 실패했습니다.')
  if(code === 'DN')alert('중복되는 닉네임입니다.')
  if(code === 'NU')alert('존재하지 않는 유저입니다.')
  if(code === 'DBE')alert('데이터베이스 오류입니다.')
  if(code !== 'SU') return

  
  if(!userEmail) return
//수정된 닉네임 반영       
getUserRequest(userEmail).then(getUserResponse) // setNickname(nickname) 

//닉네임 인풋창 닫아줌
setNicknameChange(false)
}

//         event handler : 프로필 박스 클릭 이벤트 처리                       //

const onProfileBoxClickHandler =()=>{

  if(!isMyPage) return  //로그인이 안되있으면 프로필 변겨불가

  if(!imageInputRef.current) return
  imageInputRef.current.click() // 파일입력 창열어줌

}

//         event handler :   닉네임 수정 버튼 클릭 이벤트 처리                    //
//연필 아이콘 클릭시  --> 닉네임 수정 가능                                                   
const onNicknameButtonClickHandler =()=>{
  
  //초기값:false 
  //인풋창을 열어주고 , 입력된 이름을 인풋창에 남아 있게 함.
  if(!isNicknameChange){
    //         초기값:false   --> true  --> 닉네임 인풋창 열림
    setNicknameChange(!isNicknameChange)

    setChangeNickname(nickname) 
    //1번째 세팅, 유저정보 불러오기) setNickname(nickname)   
    //changeNickname = nickname 
    //nickname : undefined  --> size={changeNickname.length + 2} value={changeNickname} 에러나서 표시안됨
    //열린 인풋창에 , 원래유저의 닉네임 표시??(변경전)
    
    return
    
  }
  
  if(!cookies.accessToken) return
  //전송할 닉네임 준비
    const requestBody: PatchNicknameRequestDto = {
    nickname: changeNickname
  }
  // 닉네임 변경 api요청
  patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse)
  
  
}


//         event handler : 프로필 이미지 변경 이벤트 처리             //

const onProfileImageChangeHandler=(event: ChangeEvent<HTMLInputElement>)=>{

  //선택한 이미지가 없을 경우 종료
  if(!event.target.files || !event.target.files.length) return
  
  //
  const file = event.target.files[0]; //하나의 이미지만 선택가능
  //선택한 파일 데이터 객체에 담기
  const data = new FormData()
  data.append('file', file)

  //선택한 파일 업로드 요청
  fileUploadRequest(data).then(fileUploadResponse)
}

//         event handler : 닉네임 변경 이벤트 처리                    //

const onNicknameChangeHandler =(event: ChangeEvent<HTMLInputElement>)=>{

  const {value} = event.target
  console.log('닉네임 변경===========>' , value)
  //          value --> changeNickname : 인풋창에 글자 입력가능한 상태
  setChangeNickname(value)

}

//        Effect : email path variable 변경시 실행할 함수                //

useEffect(()=>{

  if(!userEmail)return
  // console.log('userEmail:', userEmail);
  // setNickname('나는 이강인')
  // setProfileImage('https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt0240bc25f7be1cac/648c2a730bdc1142166c2c7b/lki.jpg?auto=webp&format=pjpg&width=3840&quality=60')
  // setProfileImage(null)
  //userEmail 바뀔때 마다 유저 정보 불러오기
  getUserRequest(userEmail).then(getUserResponse)
  
},[userEmail])

//          render: 유저화면 상단  컴포넌트 렌더링                                               //

  return(
        <div id='user-top-wrapper'>
          <div className='user-top-container'>
            {/* 프로필 이미지 */}
            {isMyPage ? 
              <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                    {profileImage !== null ? 
                    <div className='user-top-profile-image' style={{backgroundImage: `url(${profileImage})`}}></div>
                    :
                    <div className='icon-box-large'>
                      <div className='icon image-box-white-icon'></div>
                    </div>
                    }
                <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onProfileImageChangeHandler}/>
              </div>
            :
            <div className='user-top-profile-image-box' style={{backgroundImage: `url(${profileImage? profileImage : defaultProfileImage})`}}></div>
             }
             <div className='user-top-info-box'>
              <div className='user-top-info-nickname-box'>
                {/* 닉네임 +  인풋창 + 연필 아이콘 
                 isMyPage : false -> 연필 아이콘 X

                 changeNickname = nickname

                 연필 클릭-> isNicknameChange: true -> 인풋창 열림   
                 연필 클릭 -> setChangeNickname(nickname) -> 열린인풋창 안에 원래 유저의 닉네임을 표시
                 
                 닉네임: undefiend -> 연필클릭 
                 -> changeNickname=nickname 이 undefined라서  size={changeNickname.length + 2} value={changeNickname}에러

                 */}
                {isMyPage ? 
                <> 
                {isNicknameChange ? 
                 <input className='user-top-info-nickname-input' type="text" size={changeNickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler}/>
                 :
                 //연필클릭 안했을때 원래 유저의 닉네임 
                 <div className='user-top-info-nickname'>{nickname}</div>
                 }
                
                <div className='icon-button' onClick={onNicknameButtonClickHandler}>
                  <div className='icon edit-icon'></div>  
                </div>
                </> 
                :
                <div className='user-top-info-nickname'>{nickname}</div>
                }
               
              </div>
              <div className='user-top-info-email'>{'test@gamil.com'}</div>
             </div>
          </div>
        </div>
  )

}

//          component : 유저화면 하단 컴포넌트                                                              //
const UserBottom =()=>{

//          state : 페이지네이션 관련 상태                       //

// pagination hook 함수의 모든 리턴 값들 받아오기
const{ currentPage, currentSection, viewList, viewPageList,totalSection,   
  setCurrentPage,setCurrentSection,setTotalList}
  = usePagination<BoardListItem>(5)

//          state : 게시물 갯수 상태                               //

const [count, setCount] = useState<number>();

const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([])

//        function : get User BoardList Response 처리 함수             //

const getUserBoardListResponse=(responseBody: GetUserBoardListResponseDto|ResponseDto|null)=>{

    if(!responseBody)return
    const{code} = responseBody
    if(code === 'NU'){
      alert('존재하지 않는 유저입니다.')
      navigate(MAIN_PATH())
      return
    }

    if(code === 'DBE')alert('데이터베이스 오류입니다')
    if(code !== 'SU') return

    const {userBoardList} = responseBody as GetUserBoardListResponseDto
    setTotalList(userBoardList)  // viewList반환   
    setCount(userBoardList.length)

}

//       event handler : 사이드 카드 클릭 이벤트 처리              //

const onSideCardClickHandler =()=>{

  console.log('isMyPage===========:', isMyPage)
  console.log('loginUser===========:', loginUser)
  /**
   사용자 로그인 여부에 따라서만 isMyPage 값이 결정됨
   */
  //내 페이지면 -> 글쓰러 가기.
  if(isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH())
  
  //로그인 -> 남의 페이지 -> 내게시물로 가기
  else if(loginUser) navigate(USER_PATH(loginUser.email))  // /user/${userEmail}
}

//          effect : user email path variavle 변경시 실행될 함수      //

useEffect(()=>{

  // setUserBoardList(latestBoardListMock)

  if(!userEmail)return
  //유저가 작성한 리스트 api요청
  getUserBoardListRequest(userEmail).then(getUserBoardListResponse)


},[userEmail])

//          render: 유저화면 하단  컴포넌트 렌더링                                                                               //
  
    return(
      
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-title'>{isMyPage ? '내 게시물' : '게시물'}<span className='emphasis'>{count}</span></div>
          <div className='user-bottom-contents-box'>
            {count === 0 ?   
            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div>:
            <div className='user-bottom-contents'>
              {viewList.map(item=><BoardItem boardListItem={item}/>)}
            </div>
            }
            {/* 로그인 --> isMyPage : true 
                로그인X -->isMyPage : false */}
            <div className='user-bottom-side-box'>
              <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                <div className='user-bottom-side-container'>
                  {isMyPage ? 
                   <>
                    <div className='icon-box'>
                      <div className='icon edit-icon'></div>
                    </div>
                    <div className='user-bottom-side-text'>{'글쓰기'}</div>
                   </>:
                   <>
                    <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                    <div className='icon-box'>
                      <div className='icon arrow-right-icon'></div>
                    </div>  
                   </>
                   }
                </div>
              </div>
            </div>
          </div>
          <div className='user-bottom-pagination-box'>
         
         
          {count !== 0 &&  
          <Pagination 
          currentPage={currentPage}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          setCurrentPage={setCurrentPage}
          viewPageList={viewPageList}
          totalSection={totalSection} 
          /> }
         
        
          </div>
        </div>
      </div>
    )
  
  }

//          render: 유저  컴포넌트 렌더링                                                   //
  return (
   <>
    <UserTop/>
    <UserBottom/>
   </>
  )
}
