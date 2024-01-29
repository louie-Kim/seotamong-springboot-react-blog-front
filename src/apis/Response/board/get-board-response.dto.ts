import { Board } from "types/interface";
import ResponseDto from "../response.dto";



export default interface GetBoardResponseDto extends ResponseDto,Board {

    //ResponseDto
    // code: ResponseCode;
    // message: string; 

    /**
    Board
    boardNumber : number;
    title : string
    content : string
    boardImageList : string[];
    writeDatetime : string;
    writerEmail : string;
    writerNickname : string;
    writerProfileImage : string | null;
     */


}