import { BoardListItem } from "types/interface";
import ResponseDto from "../response.dto";

//  /user/{email} 에서 유저의 게시물 응답
export default interface GetUserBoardListResponseDto extends ResponseDto{

    userBoardList : BoardListItem[]
}