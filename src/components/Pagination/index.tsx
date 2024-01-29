//rfc

import React, { Dispatch } from 'react'
import './style.css'


//         interface : 페이지네이션 컴포넌트 Properties         //
interface Props {

currentPage: number;
currentSection: number;
setCurrentSection: Dispatch<React.SetStateAction<number>>;
setCurrentPage: Dispatch<React.SetStateAction<number>>;

viewPageList: number[];
totalSection: number;

}

//          component: 페이지네이션 컴포넌트                        //

export default function pagination(props: Props) {

//          state : properties                                      //

const{currentPage, currentSection, viewPageList, totalSection} = props
const{setCurrentSection, setCurrentPage} = props
// console.log('currentPage===========>', currentPage)


//          event handler : 페이지번호 클릭 이벤트 처리              //

const onPageClickHandler =(page:number)=>{

  setCurrentPage(page); //클릭한 페이지번호 
  // console.log('page===========>', page) //페이지 번호
  console.log('page===========>', page)
}
//          event handler : 이전버튼 클릭 이벤트 처리                //

const onPreviousClickHandler =()=>{

  if(currentSection === 1) return
  // console.log('이전버튼 클릭currentSection===========>', currentSection)
  // console.log('이전 버튼 클릭currentPage===========>', currentPage)
  /**
   * Section 2 -> 10 page 
   * Section 3 -> 20 page
   * Section 4 -> 30 page
   *
   */
  setCurrentPage((currentSection-1)*10); // 무조건 이전페이지 10번 으로 이동
  setCurrentSection(currentSection-1); // 무조건 이전 섹션으로 이동
}

//          event handler : 다음버튼 클릭 이벤트 처리                //

const onNextClickHandler =()=>{

  // console.log('다음 버튼 클릭currentSection===========>', currentSection)
  // console.log('다음 버튼 클릭currentPage===========>', currentPage)
  /**
   * Section 1 -> 11 
   * Section 2 -> 21 
   * Section 3 -> 31 
   */ 
 //totalSection : hook에서 10개로 설정
  if(currentSection === totalSection)return;
  setCurrentPage(currentSection*10 + 1) //ex)무조건 11번으로 이동
  setCurrentSection(currentSection + 1) //무조건 2번 섹션으로 이동

}

//          render: 페이지네이션 컴포넌트  렌더링                   //

  return (
    <div id='pagination-wrapper'>
      <div className='pagination-change-link-box'>
          <div className='icon-box-small'>
            <div className='icon expand-left-icon'></div>
          </div>
          <div className='pagination-change-link-text' onClick={onPreviousClickHandler}>{'이전'}</div>
      </div>
      <div className='pagination-divider'>{'\|'}</div>
      
      {/* viewPageList  = 현재속한 섹션에 따라 가변적
       page === currentPage 현재페이지 클릭안됨
       다른 페이지만 클릭 가능*/}
      {viewPageList.map(page=> page === currentPage?
      <div className='pagination-text-active'>{page}</div>  :
      <div className='pagination-text' onClick={()=>onPageClickHandler(page)}>{page}</div>)}
      

      <div className='pagination-divider'>{'\|'}</div>
        <div className='pagination-change-link-box'>
        <div className='pagination-change-link-text' onClick={onNextClickHandler}>{'다음'}</div>
            <div className='icon-box-small'>
              <div className='icon expand-right-icon'></div>
            </div>
        </div>
    </div>
  )
}
