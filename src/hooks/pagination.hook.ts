import { useEffect, useState } from "react"

//커스텀 훅
//<T> : 제너릭타입: 페이지네이션이 필요한 곳에서 다르게 타입을 결정 
const usePagination =<T>(countPerPage:number)=>{

//     state : 전체 객체 리스트상태                         //
const [totalList, setTotalList] = useState<T[]>([]);
//     state : 보여줄 객체 리스트상태                       //
const[viewList, setViewList] = useState<T[]>([]);
//     state :현재페이지 번호상태                           //
const[currentPage, setCurrentPage] =useState<number>(1);
//     state : 전체페이지 번호 리스트상태                   //
const[totalPageList, setTotalPageList] =useState<number[]>([1]); 
//     state : 보여줄 페이지 번호 리스트상태                 //
const[viewPageList, setViewPageList] =useState<number[]>([1])
//     state : 현재 섹션 상태                                //
const[currentSection, setCurrentSection] =useState<number>(1);    
//     state : 전체 섹션 상태                                //
//섹션은 페이지의 더 큰 묶음을 나타냅니다
const[totalSection, setTotalSection] =useState<number>(1);    

//     function: 보여줄 객체 리스트 추출 함수                //

//현재 페이지에는 5명의 댓글만 볼수있다.
const setView = ()=>{
    //countPerPage: 한 페이지에 보여지는 항목의 수, currentPage 핸재 나의 페이지
    //FISRT_INDEX    =      5       *  (n            -1 )
    const FISRT_INDEX = countPerPage * (currentPage -1 ); 

    // console.log('setView::FISRT_INDEX========>', FISRT_INDEX) 
  
    const LAST_INDEX =  totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length 
    // console.log('setView::LAST_INDEX========>', LAST_INDEX) 
    
    
    //slice : 시작 인덱스부터 종료 인덱스 전까지의 요소를 포함
    // 0~3  ==> 0 ~ 2
    const viewList = totalList.slice(FISRT_INDEX, LAST_INDEX);
    // console.log('viewList========>', viewList)

    // {viewList.map(item=><CommentItem commentListItem={item} />)}
    // console.log('(코멘트아이템 컴포넌트로)viewList========>', viewList)
    setViewList(viewList); //화면에 보여지는 댓글 작성사람 무조건 5명
}

//     function: 보여줄 페이지 리스트 추출 함수                //

//viewPageList : 현재속한 섹션에 따라 가변적
const setViewPage = ()=>{
    /**
     * 초기값: currentSection = 1 
     * FISRT_INDEX = 0 , LAST_INDEX = 10
     * viewPageList 는 0~10  , 
     * 실제 인덱스 값 : 0~9 (slice)                
     */
    // console.log('currentSection========>', currentSection)
    const FISRT_INDEX = 10 * (currentSection -1); 
    // console.log('setViewPage::FISRT_INDEX========>', FISRT_INDEX) 


    const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
    // console.log('setViewPage::LAST_INDEX========>', LAST_INDEX) 

    //totalPageList(1,2,3,....): 해당번호 추출 
    //꼭 10개는 아니라도 짜투리 번호도 출력됨.
    const viewPageList = totalPageList.slice(FISRT_INDEX , LAST_INDEX)
    /**
     *viewPageList
       BoardDetail을 통해 pagination 컴포넌트로 전달
     */
    //  console.log('(페이지네이션 컴포넌트로)viewPageList========>', viewPageList)
    setViewPageList(viewPageList);

}

//    effect : totalList가 변경될때 마다 실행할 작업         //
useEffect(()=>{
  // console.log('totalList============>', totalList)// 총댓글수 , 총 게시물수


 // totalList = commentList / 5  ==> totalPage :
  const totalPage =  Math.ceil(totalList.length/countPerPage) // 올림처리
  // console.log('totalPage============>', totalPage)//
  // console.log('totalList.length============>', totalList.length)//


  // 댓글의 수만큼  1,2,3,....... 번호 증가
  /**
   * totalPage 의 길이 만큼 totalPageList 배열에 자동으로 번호가 매겨짐
   */
  const totalPageList : number[] = []
  for(let page = 1; page <= totalPage; page++) totalPageList.push(page);
  // console.log('totalPageList============>', totalPageList)//총페이지 수
  setTotalPageList(totalPageList)

  
  //전체섹션을 10으로 묶음
  //댓글이 1~10까지 : totalSection =1 , 댓글이 11 넘어가면 totalSection = 2
  const totalSection = Math.ceil(totalList.length / (currentPage*10))
  // console.log('totalSection============>', totalSection)//총페이지 수

  setTotalSection(totalSection);



  //새로운 데이터로 인해 페이징 처리를 다시 시작해야 할 때 : 초기화
  //ex)20번에서 댓글을 달면 다시 1page 1section으로 돌아옴

  setCurrentPage(1); 
  setCurrentSection(1);

  //초기화
 setView();      // {viewList.map(item=><CommentItem commentListItem={item} />)} 
 setViewPage();  //  <Pagination/>로 전달

},[totalList]) //  BoardDetial의 setTotalList(commentList);

//    effect : current page가 변경될때 마다 실행할 작업         //

useEffect( setView, [currentPage])
//    effect : current section이 변경될때 마다 실행할 작업         //

useEffect( setViewPage, [currentPage])


return {

    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,   
    setTotalList

};

}

export default usePagination;