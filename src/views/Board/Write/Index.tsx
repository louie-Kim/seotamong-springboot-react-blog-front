import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import './style.css'
import { useBoardStore, useLoginUserStore } from 'stores';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';

//          component: 게시물 작성 화면                             //
export default function BoardWrite() {

//          state : 제목 영역 요소 ref상태                          //

//제목 참조
const titleRef = useRef<HTMLTextAreaElement|null>(null);

//          state : 본문 영역 요소 ref상태                          //

//textarea 참조
const contentRef = useRef<HTMLTextAreaElement|null>(null);

//         state : 이미지 입력 요소 참조 상태                       //

const imageInputRef = useRef<HTMLInputElement|null>(null);

//         state : 게시물 상태                                      //

const {title, setTitle}  = useBoardStore();
const {content, setContent}  = useBoardStore();
const {boardImageFileList, setBoardImageFileList}  = useBoardStore();
const { resetBoard } = useBoardStore();

//        state : 쿠키 상태                                         //

const [cookies, setCookies] = useCookies()


//        state : 로그인 유저 상태                                  //

const {loginUser} = useLoginUserStore();

//        state : 게시물 이미지 미리보기 url상태                    //
// 타입 : string의 배열 상태,  초기상태 : 빈배열
const [imageUrls , setImageUrls] = useState<string[]>([]);

//      function  : 네비게잍트 함수                                 //

const navigate = useNavigate();

//       event handler : 제목 변경 이벤트 처리                         //

const onTitleChangeHandler = (event: ChangeEvent <HTMLTextAreaElement>) =>{

  const {value} = event.target; //

  console.log('value======>', value)
  setTitle(value);

  if(!titleRef.current) return;
  titleRef.current.style.height = 'auto'; 
  titleRef.current.style.height = `${titleRef.current.scrollHeight}px`; //스크롤바 없앰.

}

//       event handler : 내용 변경 이벤트 처리                          //

const onContentChangeHendler = (event: ChangeEvent<HTMLTextAreaElement>) =>{

  const {value} = event.target; // textarea박스의 value속성 content를 들고옴 

  setContent(value);

  //
  if(!contentRef.current) return;
  contentRef.current.style.height = 'auto';  //글자 길이에 맞게 textarea만  자동으로 늘림
  //${contentRef.current.scrollHeight}px 값만큼 contentRef.current.style.height를 늘려줘라 --> 스크롤바 없어짐
  contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;

}
//        event handler : 이미지 변경 이벤트 처리                       //
const onImageChangeHandler =(event: ChangeEvent<HTMLInputElement>)=>{

  // event.target.files :  사용자가 선택한 파일들의 정보가 담긴, FileList 타입의 객체
  //선택된 파일이 없으면 종료
  if(!event.target.files || !event.target.files.length) return;


  //파일 미리 보기---------------------------------------------------------------------
  //파일을 하나씩만 선택
  const file = event.target.files[0];

  // 선택된 파일에 대한 url생성
  const imageUrl = URL.createObjectURL(file);
  /**
   * imageUrls: 에 이미 배열이 있다고 전제함.
   * 새로운 배열에 이전 배열의 값들을 복사, 
   * (배열 복사)
   */
  const newImageUrls = imageUrls.map(item => item);

  newImageUrls.push(imageUrl);
  setImageUrls(newImageUrls); // imageUrls 상태 업데이트

  //서버에 업로드---------------------------------------------------------------------
  //(배열 복사 : 원래 있던 배열은 변하지 않음.)
  const newBoardImageFileList = boardImageFileList.map(item=>item);
  newBoardImageFileList.push(file);
  setBoardImageFileList(newBoardImageFileList);

  // <input type='file'> : value 가 적혀있지는 않지만 imageInputRef로 조작 가능
  // <input type='file'> DOM의 value속성을 직접 ''로 조작 -> 중복 게시 가능하게 초기화
  if(!imageInputRef.current) return;
     imageInputRef.current.value='';
   
  // /** 파일 여러개 올리기
  //  * event.target.files : 사용자가 선택한 파일들의 정보가 담긴 FileList 타입의 객체
  //  */
  // if (!event.target.files || event.target.files.length === 0) return;

  // const selectedFiles: File[] = Array.from(event.target.files); // 선택된 파일 목록을 배열로 변환

  // const newImageUrls: string[] = [...imageUrls]; // 기존 이미지 URL 배열 복사

  // const newBoardImageFileList: File[] = [...boardImageFileList]; // 기존 파일 리스트 배열 복사

  // selectedFiles.forEach((file: File) => {
  //   const imageUrl: string = URL.createObjectURL(file);
  //   newImageUrls.push(imageUrl); // 이미지 URL 배열에 추가
  //   newBoardImageFileList.push(file); // 파일 리스트 배열에 추가
  // });


  // setImageUrls(newImageUrls); // 변경된 이미지 URL 배열 설정
  // setBoardImageFileList(newBoardImageFileList); // 변경된 파일 리스트 배열

}


//        event handler : 이미지 업로드 버튼 클릭 이벤트 처리           //

const onImageUploadButtonClickHandler = () => {

  if(!imageInputRef.current) return;

  imageInputRef.current.click(); 
  //<input ref={imageInputRef}  type='file' accept='image/*' style={{display:'none'}}/> 강제클릭효과
}

//        event handler : 이미지 닫기 버튼 클릭 이벤트 처리              //

// 이미지 없애기
const onImageCloseButtonClickHandler =(deletIndex: number)=>{
  
  //deletIndex 값을 받아옴   index = deleteIndex
  

  if(!imageInputRef.current) return;

  //<input type='file'> DOM의 value속성을 직접 ''로 조작
  imageInputRef.current.value = '';  
  
  // index와 deleteIndex는 항상 같은 값.
  //  2 !== 2 : 거짓 --> newImageUrls 배열에서 제외
  
  const newImageUrls = imageUrls.filter((url, index) => index !== deletIndex);
  console.log('삭제 후 배열 ====>', newImageUrls);
  setImageUrls(newImageUrls); // 특정 사진이 제외된 imageUrls  --> 화면에 렌더링

  // 동일한 인덱스를 가진 파일을 '제외한' 나머지 파일들을 필터링하여 새 배열 newBoardImageFileList에 저장합니다.
  const newBoardImageFileList = boardImageFileList.filter((file,index)=> index !== deletIndex);
  setBoardImageFileList(newBoardImageFileList);

}

// 보이는 인덱스 확인
const logIndex = (index : any) => {
  console.log('index: ', index);
};

//        effect : 첫 마운트시 실행 할 함수                                                //
//쿠키가 있어야  board/write에 입장
useEffect(()=>{

  // console.log('loginUser===>', loginUser)

  const accessToken = cookies.accessToken;

  if(!accessToken) {

    navigate(MAIN_PATH())
    return;
  }

  resetBoard();


},[])

//          render: 게시물 작성 화면 렌더링                                                //
  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>

            {/*rows={1} : 한줄이 넘어가면 자동 줄바꿈  */}
            <div className='board-write-title-box'>
              <textarea ref={titleRef} className='board-write-title-textarea' rows={1} placeholder='제목을 작성해 주세요' 
              onChange={onTitleChangeHandler} value={title}/>
            </div>

            <div className='divider'></div>

            <div className='board-write-content-box'>

              <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해 주세요' 
              onChange={onContentChangeHendler}  value={content}/>

              {/* 이미지 입력 아이콘*/}
              <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                <div className='icon image-box-light-icon'></div>
              </div>

            </div>
            
            {/* 이미지 입력창 
            type='file': 이미지 선택창 열어줌,  accept='image' 이미지만 올릴수 있다, 숨겨져있음 */}
            <input ref={imageInputRef}  type='file' accept='image/*' style={{display:'none'}}
            onChange={onImageChangeHandler}/>

            <div className='board-write-images-box'>

              {/* imageUrls에서 반복적으로 출력 */}
              {imageUrls.map((imageUrl, index)=>(
              <div className='board-write-image-box'>

                <img className='board-write-image' src={imageUrl} alt='Board Image' />
                {/* 삭제 버튼 */}
                <div className='icon-button image-close' onClick={() => { onImageCloseButtonClickHandler(index)}} >
                  <div className='icon close-icon'> </div>
                </div>
                
              </div>

              ))}

              
            </div>

        </div>
      </div>
    </div>
  )
}
