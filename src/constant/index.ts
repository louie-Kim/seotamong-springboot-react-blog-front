// 경로(path)를 함수로 정의하여 오타를 방지하고, 경로를 효율적으로 관리
export const MAIN_PATH = ()=> '/';
export const AUTH_PATH = ()=> '/auth';
export const SEARCH_PATH = (searchWord: string)=> `/search/${searchWord}`;

// /user/${userEmail} : url 경로만 반환해주는 함수
export const USER_PATH = (userEmail: string)=> `/user/${userEmail}`;

export const BOARD_PATH =() => '/board' 
export const BOARD_WRITE_PATH  = () => 'write';
export const BOARD_DETAIL_PATH = (boardNumber: string|number) => `detail/${boardNumber}`;
export const BOARD_UPDATE_PATH = (boardNumber: string|number) => `update/${boardNumber}`;