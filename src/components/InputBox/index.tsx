

import {forwardRef,SetStateAction,Dispatch, ChangeEvent,KeyboardEvent} from 'react'
import './style.css'
import { keyboardState } from '@testing-library/user-event/dist/keyboard/types';

//props: Props로 들어갈 데이터들
//               interface : input box component   : properties                         //

interface Props{

    label : string;
    type : 'text' | 'password';  // 인풋박스 타입지정을 받아옴
    placeholder : string;
    value : string;
    // value 를 바꿔 줄수 있는 상태 변경함수, 문자열로 업데이트 
    onChange : (event: ChangeEvent<HTMLInputElement>) => void;
    error : boolean;

    //필수가 아닌 선택적임
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    onButtonClick? : ()=> void  

    message? : string;

    //키보드 처리 함수 , 이벤트 타입은 KeyboardEvent, input 태그에서
    //아무런동작을 하지않는 함수임을 나타냄
    onKeyDown? : (event:KeyboardEvent<HTMLInputElement>) => void;
    
  }

/**
 * const InputBox : 컴포넌트 이름
 * 
 * forwardRef < ref가 연결될 DOM의 타입 (HTMLInputElement: html input요소), input태그에 접근
 *              Props: 부모 컴포넌트로 부터 받을 속성 > 
 * 
 * (props: Props, ref) : 함수 컴포넌트 속성 정의
 *  - props: Props : InputBox 컴포넌트에 들어올 속성과 타입을 정의
 *  - ref          : Html 블록들을 ref 로 접근하겠다.
 */
//               component : inputbox 컴포넌트                                                //

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {


//               state : properties                                                           // 


const{label, type,placeholder, value, error,icon,message} = props;
const{onChange,onButtonClick, onKeyDown} = props;



//               event handler : 키 이벤트 처리 함수                                            // 

// 키보드 입력을 처리
const onKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
  
  //부모의 onKeyDwon : 핸들러 찍힘
  console.log('부모로 부터============>', onKeyDown )
  //전달받은 onEmailKeyDownHandler 가 있는지 확인
  if(!onKeyDown) return;  
  
  // event객체는:onEmailKeyDownHandler, onPasswordKeyDownHandler...에 전달
  //엔터키 이벤트 처리 가능
  onKeyDown(event);  //event : 키보드 입력에 대한 정보를 담음
  console.log('자식 event=========>', event )
}
//               render : inputbox 컴포넌트                                                    //    


    return (
      <div className='inputbox'>
        <div className='inputbox-label'>{label}</div>

        {/* error(true) : 박스밑에 빨간줄표시 */}
        <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>

            {/* ref={ref} :input작성-> 엔터-> 다른 인풋으로 이동:  input에 접근*/}
            <input ref={ref} type={type} className='input' 
            placeholder={placeholder}  
            value={value} onChange={onChange}
            onKeyDown={onKeyDownHandler}/>

            
            {/* 눈까리, 주소검색 아이콘 버튼 */}
            {/*onClick={onButtonClick}: 눈까리 버튼을 클릭 '가능한 상태'로 설정  
            onButtonClick !== undefined: 부모 컴포넌트에서 onButtonClick 를 정의하고 있으면 참*/}
            {onButtonClick !== undefined && (

            <div className='icon-button' onClick={onButtonClick}>
              {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
            </div>

            )}

        </div>
        {/* message 가 있으면 메세지 출력 */}
        {message !== undefined &&(<div className='inputbox-message'>{message}</div>)}       
        
      </div>
    );
  });

export default InputBox;




