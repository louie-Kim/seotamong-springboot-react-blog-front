//이 파일을 모듈로 선언하고 내보냄
export default interface Board{


    boardNumber : number;
    title : string
    content : string
    boardImageList : string[];
    writeDatetime : string;
    writerEmail : string;
    writerNickname : string;
    writerProfileImage : string | null;

}
//'--isolatedModules' 에러 해결방법
// export type {Board}