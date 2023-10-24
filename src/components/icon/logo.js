import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

{/* <svg width="73" height="22" viewBox="0 0 73 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.1388 9.84876V0H38.3627V9.84876L37.3481 13.0433L36.1388 9.84876Z" fill="white"/>
<path d="M49.9193 12.7317C49.9674 13.3712 50.2638 13.8987 50.8086 14.3143C51.3694 14.714 52.0905 14.9138 52.9718 14.9138C53.757 14.9138 54.3899 14.7699 54.8706 14.4822C55.3674 14.1785 55.6157 13.7788 55.6157 13.2832C55.6157 12.8676 55.5036 12.5559 55.2792 12.3481C55.0549 12.1402 54.7504 11.9964 54.3659 11.9164C53.9973 11.8205 53.4205 11.7246 52.6353 11.6287C51.5617 11.5008 50.6724 11.333 49.9673 11.1251C49.2783 10.9013 48.7175 10.5576 48.2849 10.094C47.8682 9.61445 47.6599 8.97501 47.6599 8.17571C47.6599 7.42437 47.8682 6.76095 48.2849 6.18545C48.7175 5.59397 49.3024 5.13837 50.0395 4.81865C50.7926 4.49893 51.6418 4.33907 52.5872 4.33907C54.1415 4.33907 55.3994 4.68277 56.3608 5.37017C57.3383 6.05756 57.8671 7.02472 57.9472 8.27163H55.4234C55.3594 7.71212 55.0789 7.25652 54.5822 6.90482C54.0855 6.53714 53.4605 6.3533 52.7074 6.3533C51.9543 6.3533 51.3454 6.49718 50.8807 6.78493C50.416 7.07268 50.1837 7.46433 50.1837 7.9599C50.1837 8.32758 50.2958 8.60734 50.5202 8.79917C50.7605 8.97501 51.057 9.1029 51.4095 9.18283C51.762 9.24678 52.3309 9.32671 53.116 9.42262C54.1736 9.53452 55.0629 9.71037 55.784 9.95016C56.5051 10.174 57.0819 10.5416 57.5145 11.0532C57.9472 11.5488 58.1635 12.2282 58.1635 13.0914C58.1635 13.8587 57.9392 14.5382 57.4905 15.1296C57.0418 15.7051 56.4249 16.1527 55.6398 16.4725C54.8546 16.7762 53.9733 16.9281 52.9958 16.9281C51.3454 16.9281 50.0074 16.5604 48.9819 15.825C47.9724 15.0737 47.4516 14.0426 47.4196 12.7317H49.9193Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.59023 5.13037C8.70893 4.61882 7.70744 4.36305 6.58578 4.36305C4.90328 4.36305 3.56529 5.01847 2.57182 6.32933L2.25935 4.50692H0V21.58H2.59585V15.0577C2.99645 15.6332 3.53324 16.0888 4.20624 16.4245C4.87924 16.7602 5.67242 16.9281 6.58578 16.9281C7.70744 16.9281 8.70893 16.6723 9.59023 16.1607C10.4715 15.6332 11.1606 14.8978 11.6573 13.9547C12.154 12.9955 12.4024 11.8925 12.4024 10.6456C12.4024 9.36667 12.154 8.25564 11.6573 7.31247C11.1606 6.35331 10.4715 5.62594 9.59023 5.13037ZM8.74899 13.595C8.09201 14.3623 7.22673 14.746 6.15313 14.746C5.07954 14.746 4.21425 14.3623 3.55728 13.595C2.9003 12.8276 2.57182 11.8285 2.57182 10.5976C2.57182 9.39864 2.9003 8.43149 3.55728 7.69613C4.21425 6.94479 5.07954 6.56912 6.15313 6.56912C7.22673 6.56912 8.09201 6.94479 8.74899 7.69613C9.42198 8.44747 9.75848 9.43062 9.75848 10.6456C9.75848 11.8445 9.42198 12.8276 8.74899 13.595Z" fill="white"/>
<path d="M23.765 16.7842H26.0484V4.50692H23.4525V10.5976C23.4525 11.8605 23.1721 12.8596 22.6113 13.595C22.0505 14.3143 21.2733 14.674 20.2798 14.674C19.3344 14.674 18.6214 14.3623 18.1407 13.7388C17.6599 13.1154 17.4196 12.2042 17.4196 11.0052V4.50692H14.8237V11.269C14.8237 13.2513 15.2724 14.69 16.1697 15.5852C17.0671 16.4805 18.2368 16.9281 19.6789 16.9281C21.2813 16.9281 22.5472 16.3606 23.4766 15.2256L23.765 16.7842Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M61.0911 7.36043C60.5944 8.3036 60.346 9.40664 60.346 10.6695C60.346 11.9164 60.6024 13.0115 61.1151 13.9547C61.6439 14.8978 62.381 15.6332 63.3264 16.1607C64.2878 16.6723 65.4095 16.9281 66.6914 16.9281C68.1656 16.9281 69.3914 16.5284 70.3689 15.7291C71.3623 14.9298 71.9712 13.9067 72.1956 12.6598H69.5997C69.4235 13.3472 69.0629 13.8827 68.5181 14.2664C67.9733 14.6341 67.3003 14.8179 66.4991 14.8179C65.4896 14.8179 64.6804 14.5062 64.0715 13.8827C63.4626 13.2593 63.1261 12.412 63.062 11.3409V11.1971H72.3398C72.3879 10.8614 72.4119 10.5337 72.4119 10.2139C72.3959 9.03096 72.1235 7.99987 71.5947 7.12063C71.0819 6.2414 70.3689 5.562 69.4555 5.08242C68.5582 4.60284 67.5166 4.36305 66.3309 4.36305C65.1611 4.36305 64.1196 4.62681 63.2062 5.15435C62.3089 5.66591 61.6039 6.40126 61.0911 7.36043ZM68.6864 7.21655C69.2953 7.71212 69.6558 8.40751 69.768 9.30273H63.1582C63.2543 8.43948 63.6068 7.75208 64.2157 7.24053C64.8407 6.71299 65.5778 6.44922 66.427 6.44922C67.3404 6.44922 68.0935 6.705 68.6864 7.21655Z" fill="white"/>
<path d="M44.1465 1.07422L41.6168 12.1042L40.7415 10.8114L38.3013 21.3456L38.4453 21.379L40.9169 19.2221L41.687 15.8978L42.5702 17.2023L45.8731 2.80088L44.1465 1.07422Z" fill="white"/>
<path d="M30.7081 1.21875L28.9673 2.95958L32.0705 17.3358L32.902 16.031L33.5283 18.9035L36.0864 21.3838L36.182 21.363L33.8544 10.6868L33.0308 11.9792L30.7081 1.21875Z" fill="white"/>
</svg> */}



const Icon = (props) => {
    return (
        <View style={{width: 73, height: 22}}>
            <Svg width="73" height="22" viewBox="0 0 73 22">
                <Path
                    style={{fill: 'white'}}
                    d="M36.1388 9.84876V0H38.3627V9.84876L37.3481 13.0433L36.1388 9.84876Z" 
                />
                <Path
                    style={{fill: 'white'}}
                    d="M49.9193 12.7317C49.9674 13.3712 50.2638 13.8987 50.8086 14.3143C51.3694 14.714 52.0905 14.9138 52.9718 14.9138C53.757 14.9138 54.3899 14.7699 54.8706 14.4822C55.3674 14.1785 55.6157 13.7788 55.6157 13.2832C55.6157 12.8676 55.5036 12.5559 55.2792 12.3481C55.0549 12.1402 54.7504 11.9964 54.3659 11.9164C53.9973 11.8205 53.4205 11.7246 52.6353 11.6287C51.5617 11.5008 50.6724 11.333 49.9673 11.1251C49.2783 10.9013 48.7175 10.5576 48.2849 10.094C47.8682 9.61445 47.6599 8.97501 47.6599 8.17571C47.6599 7.42437 47.8682 6.76095 48.2849 6.18545C48.7175 5.59397 49.3024 5.13837 50.0395 4.81865C50.7926 4.49893 51.6418 4.33907 52.5872 4.33907C54.1415 4.33907 55.3994 4.68277 56.3608 5.37017C57.3383 6.05756 57.8671 7.02472 57.9472 8.27163H55.4234C55.3594 7.71212 55.0789 7.25652 54.5822 6.90482C54.0855 6.53714 53.4605 6.3533 52.7074 6.3533C51.9543 6.3533 51.3454 6.49718 50.8807 6.78493C50.416 7.07268 50.1837 7.46433 50.1837 7.9599C50.1837 8.32758 50.2958 8.60734 50.5202 8.79917C50.7605 8.97501 51.057 9.1029 51.4095 9.18283C51.762 9.24678 52.3309 9.32671 53.116 9.42262C54.1736 9.53452 55.0629 9.71037 55.784 9.95016C56.5051 10.174 57.0819 10.5416 57.5145 11.0532C57.9472 11.5488 58.1635 12.2282 58.1635 13.0914C58.1635 13.8587 57.9392 14.5382 57.4905 15.1296C57.0418 15.7051 56.4249 16.1527 55.6398 16.4725C54.8546 16.7762 53.9733 16.9281 52.9958 16.9281C51.3454 16.9281 50.0074 16.5604 48.9819 15.825C47.9724 15.0737 47.4516 14.0426 47.4196 12.7317H49.9193Z"
                />
                <Path
                    style={{fill: 'white'}}
                    d="M9.59023 5.13037C8.70893 4.61882 7.70744 4.36305 6.58578 4.36305C4.90328 4.36305 3.56529 5.01847 2.57182 6.32933L2.25935 4.50692H0V21.58H2.59585V15.0577C2.99645 15.6332 3.53324 16.0888 4.20624 16.4245C4.87924 16.7602 5.67242 16.9281 6.58578 16.9281C7.70744 16.9281 8.70893 16.6723 9.59023 16.1607C10.4715 15.6332 11.1606 14.8978 11.6573 13.9547C12.154 12.9955 12.4024 11.8925 12.4024 10.6456C12.4024 9.36667 12.154 8.25564 11.6573 7.31247C11.1606 6.35331 10.4715 5.62594 9.59023 5.13037ZM8.74899 13.595C8.09201 14.3623 7.22673 14.746 6.15313 14.746C5.07954 14.746 4.21425 14.3623 3.55728 13.595C2.9003 12.8276 2.57182 11.8285 2.57182 10.5976C2.57182 9.39864 2.9003 8.43149 3.55728 7.69613C4.21425 6.94479 5.07954 6.56912 6.15313 6.56912C7.22673 6.56912 8.09201 6.94479 8.74899 7.69613C9.42198 8.44747 9.75848 9.43062 9.75848 10.6456C9.75848 11.8445 9.42198 12.8276 8.74899 13.595Z"
                />
                <Path
                    style={{fill: 'white'}}
                    d="M23.765 16.7842H26.0484V4.50692H23.4525V10.5976C23.4525 11.8605 23.1721 12.8596 22.6113 13.595C22.0505 14.3143 21.2733 14.674 20.2798 14.674C19.3344 14.674 18.6214 14.3623 18.1407 13.7388C17.6599 13.1154 17.4196 12.2042 17.4196 11.0052V4.50692H14.8237V11.269C14.8237 13.2513 15.2724 14.69 16.1697 15.5852C17.0671 16.4805 18.2368 16.9281 19.6789 16.9281C21.2813 16.9281 22.5472 16.3606 23.4766 15.2256L23.765 16.7842Z"
                />
                <Path
                    style={{fill: 'white'}}
                    d="M61.0911 7.36043C60.5944 8.3036 60.346 9.40664 60.346 10.6695C60.346 11.9164 60.6024 13.0115 61.1151 13.9547C61.6439 14.8978 62.381 15.6332 63.3264 16.1607C64.2878 16.6723 65.4095 16.9281 66.6914 16.9281C68.1656 16.9281 69.3914 16.5284 70.3689 15.7291C71.3623 14.9298 71.9712 13.9067 72.1956 12.6598H69.5997C69.4235 13.3472 69.0629 13.8827 68.5181 14.2664C67.9733 14.6341 67.3003 14.8179 66.4991 14.8179C65.4896 14.8179 64.6804 14.5062 64.0715 13.8827C63.4626 13.2593 63.1261 12.412 63.062 11.3409V11.1971H72.3398C72.3879 10.8614 72.4119 10.5337 72.4119 10.2139C72.3959 9.03096 72.1235 7.99987 71.5947 7.12063C71.0819 6.2414 70.3689 5.562 69.4555 5.08242C68.5582 4.60284 67.5166 4.36305 66.3309 4.36305C65.1611 4.36305 64.1196 4.62681 63.2062 5.15435C62.3089 5.66591 61.6039 6.40126 61.0911 7.36043ZM68.6864 7.21655C69.2953 7.71212 69.6558 8.40751 69.768 9.30273H63.1582C63.2543 8.43948 63.6068 7.75208 64.2157 7.24053C64.8407 6.71299 65.5778 6.44922 66.427 6.44922C67.3404 6.44922 68.0935 6.705 68.6864 7.21655Z"
                />
                <Path
                    style={{fill: 'white'}}
                    d="M44.1465 1.07422L41.6168 12.1042L40.7415 10.8114L38.3013 21.3456L38.4453 21.379L40.9169 19.2221L41.687 15.8978L42.5702 17.2023L45.8731 2.80088L44.1465 1.07422Z"
                />
                <Path
                    style={{fill: 'white'}}
                    d="M30.7081 1.21875L28.9673 2.95958L32.0705 17.3358L32.902 16.031L33.5283 18.9035L36.0864 21.3838L36.182 21.363L33.8544 10.6868L33.0308 11.9792L30.7081 1.21875Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;