// URL에서 이미지를 가져와서 File 객체로 변환
export const convertUrlToFile = async(url:string) =>{

    //ex} url: http://localhost:4000/file/99b3a38c-1d39-4095-b6f0-6f662c77d310.png
    const response = await fetch(url);

    /**
     * blob()
     * 텍스트, 이미지, 비디오 등과 같은 다양한 종류의 이진 데이터( 0 , 1 로된)를 
     * 캡슐화하고 저장하는 데 사용되는 객체
     * 캡슐화 = 해당 데이터를 하나의 객체에 담아서 저장하거나 다룸
     * 
     * blob()객체:
     * size 속성, type 속성, arrayBuffer(), slice(), stream(), text()
     */
    const data = await response.blob();
    console.log('data====================>' , data)
    /**
     * 
     * 
     */

    /**
     * pop(): ' , or / ' 단위로 잘라 마지막 요소를 추출
     */
    const extend = url.split('.').pop() // png
    
    const fileName = url.split('/').pop() // 99b3a38c-1d39-4095-b6f0-6f662c77d310.png

    /**
     * Blob,File 객체를 생성할 때 사용되는 메타데이터
     * {type: 'image/png'} : MIME타입 설정
     * 
     * MIME타입 ?? : 웹에서는 리소스의 종류를 지정
     *  text/plain: 일반 텍스트 파일
        image/jpeg: JPEG 형식의 이미지 파일
        application/json: JSON 데이터
        audio/mp3: MP3 오디오 파일
        video/mp4: MP4 비디오 파일
     */
    const meta = {type: `image/${extend}`}
    // console.log('meta====================>' , meta)

    /**
     * 
     */
    return new File([data], fileName as string, meta);// 특정한 url을 받아서 실제 파일로 변경 -> 파일 객체로 바꿈
}
//여러개의 이미지urls를 받아서 File객체를 생성하고 배열로 반환
//urls = boardImageList (string[])
export const convertUrlsToFile = async (urls:string[]) => {

    const files: File[] = [];
    
    for(const url of urls){

        const file = await convertUrlToFile(url) //File객체 받아오기
        files.push(file)
    }
    return files
    
}