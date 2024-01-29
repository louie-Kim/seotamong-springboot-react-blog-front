import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardListItem } from 'types/interface';
import latestBoardListMock from 'mocks/latest-board-list.mock';
import BoardItem from 'components/BoardItem';
import { SEARCH_PATH } from 'constant';
import { getRelationListRequest, getSearchBoardListRequest } from 'apis';
import GetSearchBoardListResponseDto from 'apis/Response/board/get-search-board-list.responseDto';
import { ResponseDto } from 'apis/Response';
import { usePagination } from 'hooks';
import Pagination from 'components/Pagination';
import { GetRelationListResponseDto } from 'apis/Response/search';

//          component: 검색화면  컴포넌트                       //
export default function Search() {


//          state: searchWord path variable 상태                 //

const {searchWord} = useParams()

//          state : 페이지네이션 관련 상태                       //

//pagination hook 함수의 모든 리턴 값들 받아오기
const{ currentPage, currentSection, viewList, viewPageList,totalSection,   
  setCurrentPage,setCurrentSection,setTotalList}
  = usePagination<BoardListItem>(5)

//          state: 검색 게시물 갯수 상태                         //

const[count, setcount] = useState<number>();

//          state: 이전 검색어      상태                         //

const[preSearchWord, setPreSearchWord] = useState<string|null>(null);

//          state: 관련 검색어 리스트상태                        //

const[relationWordList, setRelationWordList] = useState<string[]>([]);

const navigate = useNavigate()

//          function : getSearchBoardListResponse 함수 처리       //

const getSearchBoardListResponse=(responseBody: GetSearchBoardListResponseDto|ResponseDto|null)=>{

  if(!responseBody)return
  const{code} = responseBody
  if(code === 'DBE')alert('데이터 베이스 오류 입니다.')
  if(code !== 'SU') return

  const{searchList} = responseBody as GetSearchBoardListResponseDto


  if(!searchWord) return
  /**
   * setTotalList -> totalList(searchList) 
   * hooks-> pagination-> useEffect 실행 -> viewList 생성
   */
  setTotalList(searchList) // viewList반환
  setcount(searchList.length)
  setPreSearchWord(searchWord) // 어따씀??????????????

}
//            function : get RelationList Response 함수 처리                                 //
const getRelationListResponse =(responseBody:GetRelationListResponseDto|ResponseDto|null)=>{

  if(!responseBody)return
  const{code} = responseBody
  if(code === 'DBE')alert('데이터 베이스 오류 입니다.')
  if(code !== 'SU') return

 const {relativeWordList} = responseBody as GetRelationListResponseDto
 setRelationWordList(relativeWordList)


}

//         event handler : 연관 검색어 클릭 이벤트 처리          //

const onRelationWordClickHandler=(word:string) =>{

  navigate(SEARCH_PATH(word))

}

//          effect : searchWord 상태변경시 실핼될 함수                          //
  
useEffect(()=>{
  if(!searchWord)return 
  //
  getSearchBoardListRequest(searchWord,preSearchWord).then(getSearchBoardListResponse)
  getRelationListRequest(searchWord).then(getRelationListResponse)

},[searchWord])

//          render:   검색화면  컴포넌트 렌더링                                  //
if(!searchWord) return
  return (
    <div id='search-wrapper'>
      <div className='search-container'>
        <div className='search-title-box'>
          <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{'에 대한 검색결과'}</div>
          <div className='search-count'>{count}</div>
        </div>
        <div className='search-contents-box'>
          
          {/* 검색페이지  */}
          {count === 0 ? 
          <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div> :
          <div className='search-contents'>
              {viewList.map(ok=><BoardItem boardListItem={ok} />)}
          </div>}

          <div className='search-relation-box'>
            <div className='search-relation-card'>
              <div className='search-relation-card-container'>
                <div className='search-relation-card-title'>{'관련 검색어'}</div>

                {/* 연관 검색어 리스트 */}
                {relationWordList.length === 0 ?
                <div className='search-realtion-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div> :
                
                <div className='search-relation-card-contents'>
                {relationWordList.map(word=><div className='word-badge' onClick={()=>onRelationWordClickHandler(word)}>{word}</div>)}
                </div>
                }

                
            </div>
          </div>
        </div>
        </div>
        <div className='search-pagination-box'>
          {count !== 0 &&  
          <Pagination 
          currentPage={currentPage}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          setCurrentPage={setCurrentPage}
          viewPageList={viewPageList}
          totalSection={totalSection} /> }
        
        </div>
      </div>
    </div>
  )
}
