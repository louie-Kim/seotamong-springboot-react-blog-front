import ResponseDto from '../response.dto';

/**
 * ResponseDto  : board-back/dto/Response/auth/SignUpResponseDto
 * 벡엔드 <--> 프론트 연결
 */
 //회원가입
export default interface SignUpResponseDto extends ResponseDto{
    
    //code, message 를 부모클래스에서 상속(속성)받은 데이터

    // export default interface ResponseDto{

    //     code: ResponseCode;
    //     message: String;
    
    // }

}