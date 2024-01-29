import { CommentListItem } from "types/interface";
import ResponseDto from "../response.dto";
import { type } from "os";



export default interface GetCommentListResponseDto extends ResponseDto{

    commentList : CommentListItem[];

}

