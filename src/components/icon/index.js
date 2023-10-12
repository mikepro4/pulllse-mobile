import React from 'react';
import Mountains from "./mountains";
import X from "./x";
import Plus from "./plus";
import Search from "./search";
import User from "./user";

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
        default:
            return
    }
}

export default Icon;