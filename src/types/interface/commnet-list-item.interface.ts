
//백엔트: dto/CommentListItem 과 연결 --> 객체 타입 지정
export default interface CommentListItem{
     //공통 객체 타입 선언
     // API 엔드포인트
     nickname : String;
     profileImage: String | null;
     writeDatetime: String;
     content: String;
}

//'--isolatedModules' 에러 해결방법
// export type {CommentListItem}