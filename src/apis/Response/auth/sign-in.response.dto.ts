import ResponseDto from "../response.dto";

//로그인
export default interface SignInResponseDto extends ResponseDto{
    //추가적인 데이터 받음
    token: string;
    expirationTime: number;

    //code, message 를 부모클래스에서 상속(속성)받은 데이터

    // export default interface ResponseDto{

    //     code: ResponseCode;
    //     message: String;
    
    // }

    /**
     * api요청 성공시 
     * const reponseBody: SignInResponseDto = response.data
     * return reponseBody;
     * 
     * 서버측)SignInResponseDto 에서 token, expirationTime 받아와
     * reponseBody: SignInResponseDto 에 전달 
     * 
     */
   
    


}