import React, { FC, ReactNode } from 'react';
import { Image, Text, View } from 'react-native';

import _styles from './styles';

//import backIcon from '../../assets/images/icons/back.png';
//let backIcon = require('../../../assets/images/icons/back2.png');
let logoImg = require('@/assets/images/icon2.png');
let imgUser = require('@/assets/usericon.png');


interface PageHeaderProps {
    title: string;
    hashandleGoBack: boolean;        
    children?: ReactNode;
};


const PageHeader: FC<PageHeaderProps> = ({ title,   children }) => {

    return (
        <View style={_styles.container} >
            <View style={_styles.topBar}>
                <Image source={logoImg} resizeMode="contain" />
            </View>

            <View style={_styles.header}>                
                <Image style={_styles.imgUser} source={imgUser} resizeMode="contain" />
                <Text style={_styles.title}>{title}</Text>                
            </View>
            {children}
        </View>
    );
}



export default PageHeader;