
import React, { useEffect, useState } from 'react'
import './style.css'
import Top3Item from 'components/Top3Item'
import { BoardListItem } from 'types/interface'
import top3BoardListMock from 'mocks/top-3-board-list.mock'
import BoardItem from 'components/BoardItem'
import latestBoardListMock from 'mocks/latest-board-list.mock'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PATH } from 'constant'
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis'
import { ResponseDto } from 'apis/Response'
import getTop3BoardListResponseDto from 'apis/Response/board/get-top3-boardList.ResponseDto'
import GetTop3BoardListResponseDto from 'apis/Response/board/get-top3-boardList.ResponseDto'
import { usePagination } from 'hooks'
import GetLatestBoardListDto from 'apis/Response/board/get-latest-board-list.ResponseDto'
import GetLatestBoardListResponseDto from 'apis/Response/board/get-latest-board-list.ResponseDto'
import { cpuUsage } from 'process'
import Pagination from 'components/Pagination'
import { GetPopularListResponseDto } from 'apis/Response/search'

//rfc : 최상단 컴포넌트 구조 자동 작성
//          component: 메인화면 컴포넌트                       //
export default function Main() {

//         function : 네비게이트 함수                          //

const navigate = useNavigate();

//          component: 메인화면 상단 컴포넌트                  //
 
const MainTop =()=>{

//          state : 주간 top3게시물 리스트 상태               //

//BoardListItem : 게시물에 들어갈 정보들
const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([])

//          function : getTop3BoardListResponse 처러함수       //

const getTop3BoardListResponse =(Body:GetTop3BoardListResponseDto|ResponseDto|null)=>{
  // 백엔드 최종출력 ) List<BoardListItem>top3List;
  if(!Body) return

  const{code} = Body
  if(code === 'DBE') alert('데이터 베이스 오류 입니다.')
  if(code !== 'SU') return

  //top3List -> BoardListItem[] 타입
  const {top3List} = Body as GetTop3BoardListResponseDto
  console.log('메인페이지',top3List) // 댓글수 안들어옴
  setTop3BoardList(top3List)

}

//         effect : 첫 마운트시 실행될 함수                  //
useEffect(()=>{
  //List<BoardListItem>top3List;
  getTop3BoardListRequest().then(getTop3BoardListResponse)

},[])

//          render: 메인화면 상단 컴포넌트 렌더링                      //

return(
  <div id='main-top-wrapper'>
    <div className='main-top-container'>
      <div className='main-top-title'>{'JY BOARD에서 \n 다양한 이야기를 나눠보세요'}</div>
      <div className='main-top-contents-box'>
        <div className='main-top-contents-title'>{'주간 TOP3 게시물'}</div>
        <div className='main-top-contents'>
          {/* Top3Item : 컴포넌트 */}
          {top3BoardList.map(ok => <Top3Item top3ListItem={ok}/> )}
         
        </div>
      </div>
    </div>
  </div>
)}

//          component: 메인화면 하단 컴포넌트                  //

const MainBottom =()=>{

//          state : 페이지네이션 관련 상태                     //

//pagination hook 함수의 모든 리턴 값들 받아오기
const{ currentPage, currentSection, viewList, viewPageList,totalSection,   
  setCurrentPage,setCurrentSection,setTotalList}
  = usePagination<BoardListItem>(5)


//          state : 인기 검색어 리스트 상태                    //

const[popularWordList, setPopularWordList] = useState<string[]>([])

//         function : getLatestBoardListResponse 처리 함수      //

const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto|ResponseDto|null) =>{
  //백엔드) List<BoardListItem>latestList 출력
  if(!responseBody) return
  const{code} = responseBody
  if(code === 'DBE')alert('데이터베이스 오류 입니다.')
  if(code !== 'SU') return

  //latestList : BoardListItem[]
  const {latestList}= responseBody as GetLatestBoardListResponseDto
  /**
   * setTotalList -> totalList(latestList) 
   * hooks-> pagination-> useEffect 실행 -> viewList 생성
   */
  // viewList (최신게시물: BoardListItem타입)
  setTotalList(latestList) 

}
//         function : getPopularListResponse 처리 함수      //

const getPopularListResponse =(responseBody:GetPopularListResponseDto|ResponseDto|null)=>{
  
  if(!responseBody) return
  const{code} = responseBody
  if(code === 'DBE')alert('데이터베이스 오류 입니다.')
  if(code !== 'SU') return

  const {popularWordList}= responseBody as GetPopularListResponseDto
  setPopularWordList(popularWordList)
}

//         event handler : 인기 검색어 클릭 이벤트 처리       //

const onPopularWordClickHandler =(word: string)=>{

  navigate(SEARCH_PATH(word))
}


//         effect : 첫 마운트시 실행될 함수                  //
useEffect(()=>{

  // getLatestBoardListRequest() ==>List<BoardListItem>latestList; 반환
  getLatestBoardListRequest().then(getLatestBoardListResponse)
  getPopularListRequest().then(getPopularListResponse)

},[])


//          render: 메인화면 하단 컴포넌트 렌더링                      //

return(
  <div id='main-bottom-wrapper'>
    <div className='main-bottom-container'>
      <div className='main-bottom-title'>{'최신 게시물'}</div>
      <div className='main-bottom-contents-box'>
         <div className='main-bottom-current-contents'>
            
            {/* 컴포넌트 : BoardItem */}
            {viewList.map(ok=> <BoardItem boardListItem={ok}/>)}
           
         </div>
         <div className='main-bottom-popular-box'>
            <div className='main-bottom-popular-card'>
              <div className='main-bottom-popular-card-container'>
                <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                <div className='main-bottom-popular-card-contents'>

                {popularWordList.map(word=><div className='word-badge' onClick={()=>onPopularWordClickHandler(word)}>{word}</div>)}  
                  
                </div>
              </div>
            </div>
         </div>
      </div>
      <div className='main-bottom-pagination-box'>
          {/* pagination 컴포넌트 Props에 전달 */}
          <Pagination
          currentPage ={currentPage}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          setCurrentPage={setCurrentPage}
          viewPageList={viewPageList}
          totalSection={totalSection}
          
            />
      </div>
    </div>
  </div>
)}

//          render: 메인화면 컴포넌트 렌더링                             //
  return (
    <>
      <MainTop />
      <MainBottom />
    </>
  )
}


