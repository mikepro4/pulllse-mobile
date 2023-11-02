import React from 'react';
import Mountains from "./mountains";
import X from "./x";
import Plus from "./plus";
import Search from "./search";
import User from "./user";
import Lll from "./lll";
import Notification from "./notification";
import Pulse from "./pulse";
import ArrowBack from "./arrowBack";
import ArrowForward from "./arrowForward";
import Map from "./map";
import More from "./more";
import Atom from "./atom";
import Duplicate from "./duplicate";
import Save from "./save";
import Controls from "./controls";
import Play from "./play";
import Loader from "./loader";
import Feed from "./feed";
import Cog from "./cog";
import ArrowRight from "./arrowRight";


const Icon = ({ name, style }) => {
    switch (name) {
        case 'mountains':
            return <Mountains style={style} />
        case 'x':
            return <X style={style} />
        case 'plus':
            return <Plus style={style} />
        case 'search':
            return <Search style={style} />
        case 'user':
            return <User style={style} />
        case 'lll':
            return <Lll style={style} />
        case 'notification':
            return <Notification style={style} />
        case 'pulse':
            return <Pulse style={style} />
        case 'arrow_back':
            return <ArrowBack style={style} />
        case 'arrow_forward':
            return <ArrowForward style={style} />
        case 'map':
            return <Map style={style} />
        case 'more':
            return <More style={style} />
        case 'atom':
            return <Atom style={style} />
        case 'duplicate':
            return <Duplicate style={style} />
        case 'save':
            return <Save style={style} />
        case 'controls':
            return <Controls style={style} />
        case 'play':
            return <Play style={style} />
        case 'loader':
            return <Loader style={style} />
        case 'feed':
            return <Feed style={style} />
        case 'cog':
            return <Cog style={style} />
        case 'arrow_right':
            return <ArrowRight style={style} />
        default:
            return
    }
}

export default Icon;