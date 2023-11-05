import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../../../components/text';
import Ethereal from "./ethereal"

const Algorithms = ({type}) => {
    const player = useSelector((state) => state.player);

    const renderEditor = () => {
        switch (type) {
            case "ethereal":
                return <Ethereal/>
            default:
                return
        }
    }

    return (
        <>
            {renderEditor()}
        </>
    );
};

export default Algorithms;
