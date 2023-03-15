import React from 'react';
import { Text } from '@ui-kitten/components';

const TextFontsized = ({
    children, style, category
}) => {
    return(

        <Text category={category} style={style} maxFontSizeMultiplier={1}  >{children}</Text>
);}

export default TextFontsized;

