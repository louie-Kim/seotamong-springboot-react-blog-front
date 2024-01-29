import User from "types/interface/user.interface";
import ResponseDto from "../response.dto";

export default interface GetSignInUserResponseDto extends ResponseDto,User{

     // ResponseDto 의 code,message 사용

     //User 인터페이스 사용 
     //  email : string;
     //  nickname : string;
     //  profileImage : string | null; 

}