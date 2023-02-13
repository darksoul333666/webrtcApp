import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


const WebComponent = () => {
    return <WebView source={{ uri: 'http://192.168.1.64:3000' }} />;
}

export default WebComponent;