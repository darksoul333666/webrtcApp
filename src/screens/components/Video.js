import React from 'react';
import { Text, View } from 'react-native';
import Video from 'react-native-fast-video';
const VideoScreen = ({}) => (
    <View>
    <Video source={{uri: "https://res.cloudinary.com/hoppi-app/video/upload/q_auto:low/v1659915953/dev/hoppi/video/dcq3fnrmqwjvrsvb43hl.mov"}}   // Can be a URL or a local file.
       style={{width:250, height:250}}
       paused={false}
       resizeMode={'cover'}
       repeat
       />
    </View>
);

export default VideoScreen;
