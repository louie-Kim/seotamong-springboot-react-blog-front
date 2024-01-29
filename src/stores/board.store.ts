import { create } from "zustand";

///전역적으로 사용하는 상태 변수
interface BoardStore{

    title: string;
    content: string;
    //게시물 작성을 할때는 File -->  url로 바꿔서 업로드
    boardImageFileList: File[];
    setTitle: (title:string) => void
    setContent: (content: string ) => void
    setBoardImageFileList: (boardImageFileList: File[]) => void
    resetBoard: () => void
};

//전역적으로 사용하는 상태 함수(액션함수))
//zustand의 set함수로  (BoardStore 인터페이스 구현)
const useBoardStore = create<BoardStore>(set => ({

    title : '',
    content: '',
    boardImageFileList: [],
    //제목, 내용, 파일 정보를 변경, state는: 이전상태, ...state : 모든속성을 복사한 상태 
    // ...state + title,content, boardImageFileList : 업데이트
    //   이전의 값은 변경되지 않고 '덮어쓰기' 됨
    setTitle: (title)  => set( state=> ({...state, title})),
    setContent: (content)  => set( state => ({...state, content})),
    setBoardImageFileList:(boardImageFileList) => set(state=>({...state, boardImageFileList})),

    //이전의 상태의 값들을 초기화
    resetBoard: () => set(state=>({...state, title : '',  content: '', boardImageFileList: []}))

}));

export default useBoardStore;

