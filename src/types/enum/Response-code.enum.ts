// enum : 상수들의 집합을 사용되는 데이터 형식 열거형
//(Enumerations)열거 : 목록이나 집합을 대표하는 자료형
enum ResponseCode {

     SUCCESS = "SU",

    //검증실패 : 400 
     VALIDATION_FAILED = "VF",
    //중복된 이메일 : 400
     DUPLICATE_EMAIL = "DE",
     DUPLICATE_NICKNAME = "DN",
     DUPLICATE_TEL_NUMBER = "DT",
     //존재하지 않는 유저 : 400
     NOT_EXISTED_USER = "NU",
     NOT_EXISTED_BOARD = "NB",

     //http status : 401
     //로그인 실패
     SIGN_IN_FAIL = "SF",
    //인증 실패
     AUTORIZATION_FAIL = "AF",

    //http status : 403
    //권한 없음
     NO_PERMISSION = "NP",

     //http status : 500
     DATABASE_ERROR = "DBE",

}

//ResponseCode를 내보냄
export default ResponseCode;