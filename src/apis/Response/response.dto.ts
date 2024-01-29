

/**
 * 설정 "baseUrl" : "./src"  -->  ./srctypes/enum,
 */

import { ResponseCode } from "types/enum";

// ResponseDto  : board-back/dto/Response/ResponseDto
// 벡엔드 <--> 프론트 연결
export default interface ResponseDto{

    //code에 대해 구체적인 형식을 ResponseCode 열거형으로 지정
    code: ResponseCode;
    message: string; //아직 구체적인 내용 없음

}