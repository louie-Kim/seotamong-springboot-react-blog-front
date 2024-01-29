import React from 'react'
import './style.css'


//            component : 푸터 레이아웃                              //
export default function Footer() {


//             event handler: 인스타 아이콘 버튼 클릭 이벤트 처리    //

const onInstaIconButtonClickHandler = () =>{
    window.open('https://www.instagram.com/');
}



//             event handler: 인스타 아이콘 버튼 클릭 이벤트 처리    //

const onNaverBlogButtonClickHandler = () =>{
    window.open('https://www.google.com/');
}



//            render :  레이아웃 렌더링                              //
  return (
    <div id='footer'>

        <div className='footer-container'>

            <div className='footer-top'>

                <div className='footer-logo-box'>

                    <div className='icon-box'>
                        {/* App.css 클래스 에서 이미지 불러옴 */}
                        <div className='icon logo-light-icon'></div>
                    </div>

                    <div className='footer-logo-text'>{'JY BLOG'}</div>

                </div>

                <div className='footer-link-box'>

                    <div className='footer-email-link'>{'abc@gmail.com'}</div>

                    <div className='icon-button' onClick={onInstaIconButtonClickHandler}>
                         {/* App.css 클래스 에서 이미지 불러옴 */}
                        <div className='icon insta-icon'></div>
                    </div>

                    <div className='icon-button' onClick={onNaverBlogButtonClickHandler}>
                         {/* App.css 클래스 에서 이미지 불러옴 */}
                        <div className='icon naver-blog-icon'></div>
                    </div>

                </div>
            </div>

            <div className='footer-bottom'>
                <div className='footer-copyright'>{'2023 My Website. All Rights Reserved.'}</div>
            </div>

        </div>

    </div>
  )
}

