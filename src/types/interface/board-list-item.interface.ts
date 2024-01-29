

export default interface BoardListItem{
    //공통 객체 타입 선언
    
     boardNumber: number;
     title: String;
     content: String;
     boardTitleImage: String | null; //백엔드에서 titleImage --> boardTitleImage로 변경
     favoriteCount: number;
     commentCount: number;
     viewCount: number;
     writeDatetime: String;
     writerNickname: String;
     writerProfileImage: String | null;
}

//'--isolatedModules' 에러 해결방법
// export type {BoardListItem}