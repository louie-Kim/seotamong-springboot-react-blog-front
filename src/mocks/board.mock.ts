import { Board } from "types/interface";

// 여러개의 데이터를 담을때 [  {},{},{}...] 사용
// const boardMock: Board [] = [

//     {
//         boardNumber: 1,
//         title: '오늘은 2024 첫날',
//         content: '오늘은 2024 첫날',
//         boardImageList: ['https://m.segye.com/content/image/2020/03/31/20200331507863.jpg','https://content.tomplay.com/preview/2019/03/Linkin-Park-What-I-ve-Done.jpg'], 
//         writeDatetime: '',
//         writerEmail: 'test@gmail.com',
//         writerNickname: '지롱쓰',
//         writerProfileImage: 'https://content.tomplay.com/preview/2019/03/Linkin-Park-What-I-ve-Done.jpg',
//     }

// ]

const boardMock: Board = {
    boardNumber: 1,
    title: '오늘은 2024 첫날',
    content: '오늘은 2024 첫날',
    boardImageList: ['https://m.segye.com/content/image/2020/03/31/20200331507863.jpg','https://content.tomplay.com/preview/2019/03/Linkin-Park-What-I-ve-Done.jpg'], 
    writeDatetime: '2024-1-1',
    writerEmail: 'test@gmail.com',
    writerNickname: '지롱쓰',
    writerProfileImage: 'https://content.tomplay.com/preview/2019/03/Linkin-Park-What-I-ve-Done.jpg',
};

export default boardMock;