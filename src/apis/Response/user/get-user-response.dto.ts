import { User } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetUserResponseDto extends ResponseDto,User{

    //유저 정보 들고 오기
    // email : string;
    // nickname : string;
    // profileImage : string | null;

}