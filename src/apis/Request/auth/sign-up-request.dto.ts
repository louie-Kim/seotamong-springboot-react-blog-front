export default interface SignUpRquestDto{
    //회원 가입
    email: string,
    password : string;
    nickname: string;
    telNumber :string;
    address : string
    addressDetail : string |null;
    agreedPersonal: boolean;

}