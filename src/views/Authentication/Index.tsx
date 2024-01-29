  import { signInRequest, signUpRequest } from 'apis';
import { SignInRequestDto, SignUpRquestDto } from 'apis/Request/auth';
import { ResponseDto } from 'apis/Response';
import { SignInResponseDto, SignUpResponseDto } from 'apis/Response/auth';
import InputBox from 'components/InputBox';
import { MAIN_PATH } from 'constant';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useNavigate } from 'react-router-dom';
import './style.css';



//          component: 인증화면 컴포넌트                            //
  export default function Authentication() {

//         state :  쿠키 상태                                        //

  const[cookies, setCookie] = useCookies();

//        function: 네비게이트 함수                                  //

    const navigate = useNavigate();

//          state : 화면 상태                                        //
  //타입 : 유니온 타입을 이욯한 리터럴 타입<'sign-in'|'sign-up'> 초기 설정값: ('sign-in')
  const [view , setView] = useState<'sign-in'|'sign-up'>('sign-in');


 //          component: sign in card 컴포넌트                         //

  //로그인
  const SignInCard = () => {

  //         state: 이메일 요소 참조 상태                                     //

  //  TMLInputElement  : input 요소에 접근한다 
  //  | null  : ref가 input DOM요소에 접근하지 못한 상태
  const emailRef = useRef<HTMLInputElement|null>(null);

  //         state: 패스워드 요소 참조 상태                                     //

  const passwordRef = useRef<HTMLInputElement|null>(null);

  //         state: 이메일 상태                                               //

  const[email, setEmail] = useState<string>('');

  //         state: 패스워드 상태                                              //

  const[password, setPassword] = useState<string>('');

  //         state: 패스워드 인풋타입 상태                                     //
  // 첫렌더링시 passwordType -> text 
  const[passwordType, setPasswrodType]  = useState<'text'|'password'>('password');
  // console.log(passwordType)

  //         state: 패스워드 버튼 아이콘 상태                                  //
  
  //icon 은 초기값 eye-light-on-icon을 가지고 있고 자식 컴포넌트로 전달이 되는상태
  // icon !== undefined는 항상 참이 됩니다
  // 첫렌더링 시 passwordButtonIcon -> eye-light-on-icon
  const [passwordButtonIcon, setPasswordButtonIcon] = 
  useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');
  // console.log(passwordButtonIcon)

  //         state: 에러 상태                                                  //
  // 이메일 비번중 어느게 틀리게 입력했는지 알려주지 않음 -> 동일한 에러 상태 만듬
  // 둘중 하나만 틀려도 둘다 에러 상태로 만듬
  const [error, setError] = useState<boolean>(false);

  //         function :  sign in response 처리 함수                           //

  const signInReponse = (responseBody: SignInResponseDto| ResponseDto | null) => {
    
    // console.log("responseBody????============>", responseBody)

    //요청 실패시 에러 메세지
    if(!responseBody){
      alert('네트워트 이상입니다.'); 
      return;
    }
     
    const{code} = responseBody;
    if(code === 'DBE') alert('데이터 베이스 오류 입니다.');
    if(code === 'SF' || code === 'VF') setError(true);  
    if(code !== 'SU') return;


    //token, expirationTime 추출
    const {token, expirationTime} = responseBody as SignInResponseDto
    
    //현재 시간 ->  밀리초로 변화 : 
    const now = new Date().getTime(); 
    //만료시간 expires 지금으로 부터 1시간
    const expires = new Date(now + expirationTime * 1000);


    // 쿠키이름 accessToken
    // path: MAIN_PATH() : 쿠키의 유효경로 '/' 하위 전체 경로에서 쿠키 사용가능
    
    setCookie('accessToken', token, {expires, path: MAIN_PATH()})

    navigate(MAIN_PATH())

  }

  //        event handler : 로그인 버튼 클릭 이벤트 처리                      //
  
  //로그인 버튼 클릭시 
  const onSignInButtonClickHandler = () =>{

    const requestBody: SignInRequestDto = {email, password};
    
    // apis/index.ts : 서버로 로그인 post 요청 --> 성공 --> signInReponse호출
    signInRequest(requestBody).then(signInReponse);

  }
  //        event handler : 인풋 이메일 변경 이벤트 처리                         //
      
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{

    setError(false);
    const {value} = event.target  // 입력창에서 value 추출
    setEmail(value);

  }

   //        event handler : 인풋 비밀번호 변경 이벤트 처리                         //
      
   const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{

    setError(false);
    const {value} = event.target  // 입력창에서 value 추출
    setPassword(value);

  }


  //        event handler : 회원가입 링크 클릭 이벤트 처리                    //

  const onSignUpLinkClick =()=>{
    setView('sign-up');
  };


//        event handler : 패스 워드 버튼 클릭 이벤트 처리                     //

  // 자식 컴포넌트의 속성 onButtonClick 를 정의 하는 핸들러
  // onButtonClick !== undefined은 항상 참(true)이 됩니다
    
    const onPasswordButtonClickHabdler = () =>{

      
      if(passwordType === 'text'){
        setPasswrodType('password')
        setPasswordButtonIcon('eye-light-off-icon');
      }
      else{ //passwordType === password
        setPasswrodType('text')
        setPasswordButtonIcon('eye-light-on-icon');
      }
      
      
    }

  //        event handler : 이메일 인풋 키다운 이벤트 처리                     //

  // 이메일 입력후 엔터 -> 비번으로 포커스 잡히게설계
  const onEmailKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) =>{

    if(event.key !== 'Enter') return; //엔터 키만 허용

    //passwordRef.current는 비밀번호 입력란의 DOM 요소를 참조 하지 않으면 함수 중단.
    if(!passwordRef.current) return; 
    
   /**
    *  passwordRef.current는 비밀번호 입력란의 DOM 요소를 참조
    *  focus() 메서드는 '해당 요소(비번창)'로 포커스를 이동시키는 역할
    */
    passwordRef.current.focus();  //

  }
  //        event handler : 비밀번호 인풋 키다운 이벤트 처리                     //

  // 비번 입력후 엔터 -> 로그인 버튼 동작하게 설계
  const onPasswordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) =>{

    if(event.key !== 'Enter') return;

    onSignInButtonClickHandler();  // 로그인 버튼 동작

  }

   

  //          render: sign in card 컴포넌트 렌더링                              // 


    return ( 
      /**
       * <InputBox/>   -> component/InputBox
       * <InputBox/> , Props의 필수 값을 넣어줘야 함
       *  */  

      //로그인 카드 렌더링
      <div className='auth-card'>
        <div className='auth-card-box'>

            <div className='auth-card-top'>
                <div className='auth-card-title-box'>
                  <div className='auth-card-title'>{'로그인'}</div>
                </div>

              {/* SignInCard 컴포넌트 내부의 InputBox 호출 부분 */}
              <InputBox ref={emailRef}  label='이메일 주소' type = 'text' placeholder='이메일 주소를 입력해 주세요' 
              error={error} value={email} onChange={onEmailChangeHandler} 
              onKeyDown={onEmailKeyDownHandler}/>  
              
              
              {/*onButtonClick 은 함수형태로된 input컴포넌트의 속성 */}
              <InputBox ref={passwordRef} label='패스워드' type = {passwordType} placeholder='비밀전호를 입력해 주세요' 
              error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} 
              onButtonClick={onPasswordButtonClickHabdler} 
              onKeyDown={onPasswordKeyDownHandler}/>

            </div>

            <div className='auth-card-bottom'>
                  {/*로그인 에러시: if(code === 'SF' || code === 'VF') setError(true);*/}
                  {/* 이메일,비번변경시 onEmailChangeHandler, onPasswordChangeHandler : setError(false) */}
                  {error && <div className='auth-sign-in-error-box'>
                    <div className='auth-sign-in-error-message'>
                      {'이메일 주소 또는 비밀번호를 잘못 입력 하셨습니다.\n입력하신 내용을 다시 확인해 주세요.'}
                    </div>
                  </div>
                  }
                  
                  <div className='balck-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
                  <div className='auth-description-box'>
                    <div className='auth-description'>{'신규 사용자 이신가요?'}
                    <span className='auth-description-link' onClick={onSignUpLinkClick}>{'회원가입'}</span>
                    </div>  
                  </div>

            </div>

        </div>
      </div>
    );
  };

//          component: sign up card 컴포넌트                                                    //

  //회원 가입
  const SignUpCard = () => {

  

  //           state: 이메일 요소 참조 상태                                              //

    const emailRef = useRef<HTMLInputElement | null>(null);

  //           state: 패스워드 요소 참조 상태                                              //

    const passwordRef = useRef<HTMLInputElement | null>(null);

  //           state: 패스워드 체크 요소 참조 상태                                         //

    const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  //           state: 닉네임 요소 참조 상태                                      //

   const nicknameRef = useRef<HTMLInputElement | null>(null);
  
  //           state: 주소 요소 참조 상태                                        //

   const addressRef = useRef<HTMLInputElement | null>(null);

  //           state: 상세주소 요소 참조 상태                                    //

  const addressDetialRef = useRef<HTMLInputElement | null>(null);

  //           state: 주소 요소 참조 상태                                        //

   const telNumberRef = useRef<HTMLInputElement | null>(null);

  //           state: 페이지 번호 상태                                           //

    const [page, setPage] = useState< 1 | 2 >(1);

  //           state: 이메일 상태                                                //
                 
  
    const[email, setEmail]  = useState<string>('');

  //           state: 패스워드 상태                                               //

  const [password, setPassword] = useState<string>('');

  //           state: 패스워드 확인 상태                                          //

  const [passwordCheck, setPasswordCheck] = useState<string>('');
  //           state: 닉네임  상태                                                 //
  
  const[nickname, setNickname] = useState<string>('');

  //           state: 핸드폰 번호 상태                                             //

  const[telNumber, setTelNumber] = useState<string>('');

  //           state: 주소 상태                                                    //

  const[address, setAddress] = useState<string>('');

  //           state: 상세주소 상태                                                   //

  const[addressDetail, setAddressDetail] = useState<string>('');
  
  //           state: 개인정보 동의  상태                                                   //

  const [agreedPersonal , setAgreedPersonal]   = useState<boolean>(false);


  //           state: 패스워드 타입 상태                                                   //

  const[ passwordType, setPasswordType ]  = useState<'text' | 'password'>('password');

  //           state: 패스워드 확인 타입 상태                                              //

  const[ passwordCheckType, setPasswordCheckType ]  = useState<'text' | 'password'>('password');


  //           state: 이메일 에러  상태                                                    //

  const[isEmailError, setEmailError] = useState<boolean>(false);

  //           state: 패스워드 에러  상태                                                  //

  const[isPasswordError, setPasswordError] = useState<boolean>(false);

  //           state: 패스워드 확인   상태                                                  //

  const[isPasswrodCheckError, setPasswrodCheckError] = useState<boolean>(false);

  //           state:  이메일 에러 메세지 상태                                               //

  const[emailErrorMessage, setEmailErrorMessage ] = useState<string>('');

   //           state:  패스워드 에러 메세지 상태                                            //

  const[passwordErrorMessage, setPasswordErrorMessage ] = useState<string>('');

  //           state:  패스워드 확인 에러 메세지 상태                                        //

  const[passwordCheckErrorMessage,setPasswordCheckErrorMessage ] = useState<string>('');

  //           state:  닉네임 에러 메세지 상태                                               //

  const[nicknameErrorMessage , setNickNameErrorMessage] = useState<string>('')

  //           state:  핸드폰 번호  에러 메세지 상태                                         //

  const[telNumberErrorMessage , setTelNumberErrorMessage] = useState<string>('')


  //           state:  주소 에러 메세지 상태                                                 //

  const[addressErrorMessage , setAddressErrorMessage] = useState<string>('')

  //           state: 닉네임 에러 상태                                                  //

  const[isNicknameError, setNicknameError] = useState<boolean>(false);

  //           state: 핸드폰  에러 상태                                                  //

  const[isTelNumberkError, setTelNumberError] = useState<boolean>(false);

  //           state: 주소에러 상태 확인 상태                                                  //

  const[isAddressError, setAddressError] = useState<boolean>(false);

  //           state: 개인 정보 동의 에러 상태                                                         //

  const[isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

  //           state:  패스워드 버튼 아이콘 상태                                               //

  const [passwordButtonIcon, setPasswordButtonIcon] = 
  useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');

  //         function : 다음 주소 검색 팝업 오픈 함수                                          //

  const open = useDaumPostcodePopup();

  //         function : sign up response 처리 함수                                              //

  //회원 가입후 에러 메세지 처리
    const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {

      if(!responseBody){
        alert('네트워크 이상입니다.');
        return;
      }

      const {code} = responseBody;
      if(code === 'DE'){
        setEmailError(true);
        setEmailErrorMessage('중복된 이메일 주소입니다.')
      }
      if(code === 'DN'){
        setNicknameError(true);
        setNickNameErrorMessage('중복된 닉네임 입니다.')
      }
      if(code === 'DT'){
        setTelNumberError(true);
        setTelNumberErrorMessage('중복된 핸드폰 번호입니다.')
      }

      if(code === 'VF') alert('모든값을 입력하세요.')
      if(code === 'DBE')alert('데이터 베이스 오류입니다.') 

      if(code !== 'SU') return;

      setView('sign-in');
    }
  

  //           state:  패스워드 확인 버튼 아이콘 상태                                               //

    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = 
    useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');
 
  //            event handler : 이메일 변경 이벤트 처리                                      //

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 1
    const {value} = event.target;
    setEmail(value);
    setEmailError(false);
    setEmailErrorMessage('');
    

  }

  //            event handler : 패스워드 변경 이벤트 처리                                        //

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
      //page 1
      const {value} = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

   //            event handler : 패스워드 확인 변경 이벤트 처리                                  //

   const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 1
    const {value} = event.target;
    setPasswordCheck(value);
    setPasswrodCheckError(false);
    setPasswordCheckErrorMessage('');
  }  

  //            event handler : 닉네임    변경 이벤트 처리                                  //

  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 2
    const {value} = event.target;
    setNickname(value);
    setNicknameError(false);
    setNickNameErrorMessage('');
  }

  //            event handler : 휴대폰 확인 변경 이벤트 처리                                  //

  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 2
    const {value} = event.target;
    setTelNumber(value);
    setTelNumberError(false);
    setTelNumberErrorMessage('');
  }

  //            event handler : 주소 변경 이벤트 처리                                      //

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 2
    const {value} = event.target;
    setAddress(value);
    setAddressError(false);
    setAddressErrorMessage('');
  }

  //            event handler : 상세주소 변경 이벤트 처리                                  //

  const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
    //page 2
    const {value} = event.target;
    setAddressDetail(value);
  }

  //            event handler : 개인정보 동의 체크 박스 클릭 이벤트 처리                                  //

  const onAgreedPersonalClickHandler = () =>{

    // 초기값) agreedPersonal : false(흰색체크) ==> true ==> check-round-fill-icon(검은색체크)
    setAgreedPersonal(!agreedPersonal)  
    // 초기값)isAgreedPersonalError : false ==> isAgreedPersonalError : true ==> auth-consent-title (검은색 개인정보 동의)
    setAgreedPersonalError(true);      

  }

  //        event handler : 패스워드 버튼 클릭 이벤트 처리                                      //

  // 자식 컴포넌트의 속성 onButtonClick 를 정의 하는 핸들러
  // onButtonClick !== undefined 은 항상 참(true)이 됩니다
  // 초기 설정 : passwordType : password , passwordButtonIcon : eye-light-off-icon
  const onPasswordButtonClickHabdler = () =>{
      
    if(passwordButtonIcon === 'eye-light-off-icon'){
      
      setPasswordButtonIcon('eye-light-on-icon');
      setPasswordType('text')
    }
    else{
      setPasswordButtonIcon('eye-light-off-icon');
      setPasswordType('password')
    }
  }

  //        event handler : 패스워드 확인 버튼 클릭 이벤트 처리                                 //

  // 자식 컴포넌트의 속성 onButtonClick 를 정의 하는 핸들러
  // onButtonClick !== undefined은 항상 참(true)이 됩니다
  //초기 설정 : passwordCheckType:  password , passwordCheckButtonIcon : eye-light-off-icon
  const onPasswordButtonCheckClickHabdler = () =>{
      
    if(passwordCheckButtonIcon === 'eye-light-off-icon'){
      
      setPasswordCheckButtonIcon('eye-light-on-icon');
      setPasswordCheckType('text')
    }
    else{ //passwordCheckButtonIcon === 'eye-light-on-icon'
      setPasswordCheckButtonIcon('eye-light-off-icon');
      setPasswordCheckType('password')
    }
  }
  //        event handler : 주소 버튼 클릭 이벤트 처리                                     //

  const onAddressButtonClickHandler = () =>{

    open({onComplete});

  }

  //        event handler : 다음버튼 클릭 이벤트 처리                                           //

  //다음 버튼 클릭 -> 회원 가입 1페이지 데이터 확인 후  -> 2 page로 
  const onNextButtonClickHandler =()=>{

    //email 정규식 패턴 검사
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    // 패턴 확인
    const isEmailPattern = emailPattern.test(email);

    if(!isEmailPattern){
      setEmailError(true)   // isEmailError 초기 :false->  true: 박스밑에 빨간줄표시
      setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.') // 오류 메세지
    }
    
    //trim() : 문자열 양쪽 공백 제거
    const isCheckedPassword = password.trim().length >= 8;
    if(!isCheckedPassword){
      setPasswordError(true); // isPasswordError 초기 : false -> true: 박스밑에 빨간줄표시
      setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요') //오류 메세지
    }
    
    // 비번, 비번확인이 같은지 확인
    const isEqualPassword = password === passwordCheck;
    if(!isEqualPassword){
      setPasswrodCheckError(true)  // isPasswrodCheckError 초기 :false -> true : 박스밑에 빨간줄표시
      setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.') // 오류 메세지
      
    }
    //엄격하게 통제
    if (isEmailPattern && isCheckedPassword && isEqualPassword)

    //엉터리로 적어도 => 일단은 다통과 (다음단계버튼 가능) 
    //진짜 회원 가입시 정확한 조건에 맞게 적어야 함
    // if(!isEmailPattern || !isCheckedPassword || !isEqualPassword )

      setPage(2);
  }

  //          event handler : 회원가입 버튼 클릭 이벤트 처리                                   //

  //회원 가입 2페이지 :
  const onSignUpButtonClickHandler = () =>{

    // // 회원가입 검증
    // //  email 정규식 패턴 검사
    //  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    //  // 패턴 확인
    //  const isEmailPattern = emailPattern.test(email);
 
    //  if(!isEmailPattern){
    //    setEmailError(true) //빨간줄에러 메세지
    //    setEmailErrorMessage('이메일 주소 포멧이 맞이 않습니다.')
    //  }
     
    //  //비밀번호 길이 확인
    //  //trim() : 문자열 양쪽 공백 제거
    //  const isCheckedPassword = password.trim().length >= 8;
    //  if(!isCheckedPassword){
    //    setPasswordError(true);//빨간줄에러 메세지
    //    setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요')
    //  }
 
    //  // 비번, 비번확인이 같은지 확인
    //  const isEqualPassword = password === passwordCheck;
    //  if(!isEqualPassword){
    //    setPasswrodCheckError(true)//빨간줄에러 메세지
    //    setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.')
    //  }
    //  //위의 조건이 맞지 않을 경우 1페이지로 돌려 보냄
    //  if(!isEmailPattern || !isCheckedPassword || isEqualPassword ) {
    //   setPage(1);
    //   return;
    //  }

    // 2페이지 단계 
     const hasNickName = nickname.trim().length > 0 ; // 닉네임이 있음
     if(!hasNickName){
      setNicknameError(true);//input컴포넌트 입력창에 빨간줄
      setNickNameErrorMessage('닉네임을 입력해 주세요')
     }

     const telNumberPattern = /^[0-9]{11,13}$/;
     const isTelNumberPattern = telNumberPattern.test(telNumber);
     if(!isTelNumberPattern){
      setTelNumberError(true) //input컴포넌트 입력창에 빨간줄
      setTelNumberErrorMessage('숫자만 입력해 주세요') // input 컴포넌트 빨간줄 아래 메세지
     }

     const hasAddress = address.trim().length > 0 ; //주소 있음
     if(!hasAddress){
        setAddressError(true);//input컴포넌트 입력창에 빨간줄
        setAddressErrorMessage('주소를 입력해 주세요');// input 컴포넌트 빨간줄 아래 메세지
     }

      /**
      * 개인 정보 동의 핸들러)
      *(초기값) agreedPersonal : false (흰색체크 박스) 
      *(클릭) true ==> check-round-fill-icon(검은색체크 박스)
      *
      *(초기값)isAgreedPersonalError : false (빨간색 개인정보 동의) ==> 
      *(클릭)isAgreedPersonalError : true ==> auth-consent-title (검은색 개인정보 동의)
       */
    
    // 회원가입시 아이콘 클릭을 해야됨.
    //검은색 체크박스이면 -->  검은색 개인정보 동의
     if(!agreedPersonal) setAgreedPersonalError(true)

     //모든 데이터가있음
     if(!hasNickName || !isTelNumberPattern || !agreedPersonal) return;

     //회원 가입정보 api로 전송
     const requestBody: SignUpRquestDto ={
      email, password, nickname, telNumber, address, addressDetail,agreedPersonal 
     };

    // api 요청
     signUpRequest(requestBody).then(signUpResponse);

  }

  //          event handler  이메일 키 다운이벤트처리                                          //

  //onKeyDown
  const onEmailKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{
    //이메일 키 다운처리
    if(event.key !== 'Enter') return;
    if(!passwordRef.current) return;

    passwordRef.current.focus()

  }

   //          event handler  패스워드 키 다운이벤트처리                                          //

   const onPasswordKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{
    // 패스워드 키 다운처리
    console.log('부모 event=========>', event )
    if(event.key !== 'Enter') return;
    if(!passwordCheckRef.current) return;

    passwordCheckRef.current.focus()

  }

   //          event handler  패스워드 확인 키다운 이벤트처리                                     //

   const onPasswordCheckKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{
    // 패스워드 확인 키 다운처리
    if(event.key !== 'Enter') return;
   

    onNextButtonClickHandler();

  }  
  //        event handler : 로그인으로 돌아가기 클릭 이벤트 처리                                  //

  const onSignInLinkClick =()=>{
    setView('sign-in');
  };
   //          event handler  닉네임 키 다운  이벤트처리                                          //

   const onNicknameKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{

    if(event.key !== 'Enter') return;
    if(!telNumberRef.current) return;

    telNumberRef.current.focus()

  }  

   //          event handler  핸드폰 키다운  이벤트처리                                          //

   const onTelNumberKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{

    if(event.key !== 'Enter') return;
    
    //엔터 -> 주소 검색창 뜸.
    onAddressButtonClickHandler()

  }  

   //          event handler  주소 키다운  이벤트처리                                          //

   const onAddressKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{

    if(event.key !== 'Enter') return;

    if(!addressDetialRef.current) return;

    addressDetialRef.current.focus();

  }  

   //          event handler  상세주소 키다운  이벤트처리                                          //
   const onAddressDetailKeyDownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{

    if(event.key !== 'Enter') return;

    //개인정보 동의 클릭 -> 엔터 ->onSignUpButtonClickHandler(); 호출
      onSignUpButtonClickHandler();

  } 

  //           event handler : 다음 주소 검색 완료 이벤트 처리                                     //

  //매개견수 이름:data , 타입: Address
  const onComplete = (data:Address) =>{

      //검색 완료가 되면 data로 부터 address를 받아올수 있다.
      const {address} = data
      setAddress(address);  // 주소창에 주소 표시
      setAddressError(false) // 주소창에 inputbox-container (검은줄) 표시
      setAddressErrorMessage(''); // 주소창 아래 에러 메세지에 빈문자열

      if(!addressDetialRef.current) return
      addressDetialRef.current.focus();  // 자동으로 이동

  }

  //            effect :    페이지가 변경될때 마다 실행될 함수                                                                  //

  // 페이지가 바뀔때마다 2페이지 일때 닉네임 인풋 돔요소 참조
  useEffect(()=>{

    if(page===2){
      if(!nicknameRef.current) return;
         nicknameRef.current.focus();
    }

  },[page])

  //          render: sign up card 컴포넌트 렌더링                                                                                                            //  

    return (
      <div className='auth-card'>
        <div className='auth-card-box'>

            <div className='auth-card-top'>
              <div className='auth-card-title-box'> 
                <div className='auth-card-title'>{'회원가입'}</div>
                <div className='auth-card-page'>{`${page}/2`}</div>
              </div>
              {page === 1 && (
                <>
                <InputBox ref={emailRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요.' 
                value={email} onChange={onEmailChangeHandler}
                error={isEmailError} message={emailErrorMessage} 
                onKeyDown={onEmailKeyDownHandler}/>
  
                <InputBox ref={passwordRef}  label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해 주세요.' 
                value={password} onChange={onPasswordChangeHandler}
                error={isPasswordError} message={passwordErrorMessage} 
                icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHabdler} 
                onKeyDown={onPasswordKeyDownHandler}/>
  
                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해주세요.' 
                value={passwordCheck} onChange={onPasswordCheckChangeHandler}
                error={isPasswrodCheckError} message={passwordCheckErrorMessage} 
                icon={passwordCheckButtonIcon} onButtonClick={onPasswordButtonCheckClickHabdler} 
                onKeyDown={onPasswordCheckKeyDownHandler}/>
                
                </>

              )}

              {page===2 && ( 
                <>
                <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해 주세요'
                value={nickname} onChange={onNicknameChangeHandler} 
                error={isNicknameError} message={nicknameErrorMessage}
                onKeyDown={onNicknameKeyDownHandler}/>

                <InputBox ref={telNumberRef} label='핸드폰 번호*' type='text'placeholder='핸드폰 번호를 입력해주세요'
                 value={telNumber} onChange={onTelNumberChangeHandler} 
                 error={isTelNumberkError} message={telNumberErrorMessage}
                 onKeyDown={onTelNumberKeyDownHandler}/>

                <InputBox ref={addressRef} label='주소*' type='text'placeholder='주소 찾기'
                 value={address} onChange={onAddressChangeHandler} 
                 error={isAddressError} message={addressErrorMessage} 
                 icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}
                 onKeyDown={onAddressKeyDownHandler}/>

                <InputBox ref={addressDetialRef} label='상세 주소*' type='text'placeholder='상세 주소를 입력해 주세요'
                 value={addressDetail} onChange={onAddressDetailChangeHandler} 
                 error={false} onKeyDown={onAddressDetailKeyDownHandler}/>
                </>
              )}

            </div>

            <div className='auth-card-bottom'>
                { page === 1 &&( 
                  <>
                  <div className='balck-large-full-button'  onClick={onNextButtonClickHandler}> {`다음 단계`} </div>
                  </>
                )}

                {page===2 && ( 
                <>
                  <div className='auth-consent-box'>
                        <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                          {/* 체크 아이콘 보여주기 */}
                            <div className={`icon ${agreedPersonal ? 'check-round-fill-icon':'check-ring-light-icon'}`}></div> 
                        </div>
                        <div className={isAgreedPersonalError?'auth-consent-title':'auth-consent-title-error'}>{'개인정보 동의'}</div>
                        
                        <div className='auth-consent-link'>{'더보기 >'}</div>
                  </div>

                  <div className='balck-large-full-button' onClick={onSignUpButtonClickHandler}> {`회원가입`} </div>
                </>
                )}

                <div className='auth-description-box'>
                  <div className='auth-description'>{`이미 계정이 있으신가요`}
                  <span className='auth-description-link' onClick={onSignInLinkClick}>{'로그인'}</span>
                  </div>
                </div>
            </div>

        </div>
      </div>
    );
  };

  //          render: 인증화면 컴포넌트 렌더링                                                                                                             //  
    return (
      // /auth 전체 페이지 렌더링 설정
      <div id='auth-wrapper'>

        <div className='auth-container'>
          <div className='auth-jumbotron-box'>

              <div className='auth-jumbotron-contents'>
                  <div className='auth-logo-icon'></div>
                  <div className='auth-jumbotron-text-box'>
                      <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
                      <div className='auth-jumbotron-text'>{'JY BOARD입니다'}</div>
                  </div>
              </div>

          </div>

          {view === 'sign-in' && <SignInCard/>} 
          {view === 'sign-up' && <SignUpCard/>}

        </div>
      </div>
    )
  }
