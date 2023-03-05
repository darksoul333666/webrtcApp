import React, { useState, useEffect } from 'react';
import {
  Send,
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
} from 'react-native-gifted-chat';
import { Colors } from '../../utils/theme';
import { Container } from '../components';
import { Avatar } from '@rneui/themed';
import { Layout, useTheme } from '@ui-kitten/components';
// import { pushNotifications } from '../../services';
import { Fonts } from '../../utils/config/Constants';
import database from '@react-native-firebase/database';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const ChatScreen = ({ route, navigation, onClose }) => {
  const theme = useTheme();
  // const { _id, name, tokenFirebase } = route.params;

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // if (info._id < _id) {
    //   setChannel(info._id + _id);
    // } else {
    //   setChannel(_id + info._id);
    // }
       setChannel('123');

    let messageIsNull = database()
      .ref(`chat/${channel}`)
      .on('value', snapshot => {
        if (!snapshot.exists()) {
          setLoading(false);
        }
      });

    const messagesListener = database()
      .ref(`chat/${channel}`)
      .orderByChild('createdAt')
      .on('child_added', snapshot => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, snapshot.val()),
        );
        setLoading(false);
      });

    return () => {
      database().ref(`chat/${channel}`).off('child_added', messagesListener);
      database().ref(`chat/${channel}`).off('value', messageIsNull);
    };
  }, [channel]);

  const mapUser = user => {
    console.log(
      {
      _id: 123123123,
      name: "Jairo",
    }
    );
    return {
      _id: 123,
      name: "Jairo",
    };
  };

  // useEffect(()=>{
  //   (mode === 'single' && userInfo?.name) ? setInfo(userInfo) : setInfo(group);
  // },[])

  const handleSend = async messag => {
    const text = messag[0].text;
    //A channel entry
    database()
      .ref(`chat/${channel}`)
      .push({
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date().getTime(),
        status: false,
        user: {
          _id: 123,
        },
        userRecived: {
          _id: 456,
        },
      })
      .catch(e => {
        console.log('Sorry, this message could not be sent. ', e);
      });
    updateLastMessage(123, 456, text, true);
    updateLastMessage(456, 123, text, false);
  };

  async function updateLastMessage(a, b, msj, read) {
    try {
      await database()
        .ref(`lastMessages/${a}/${b}`)
        .set({
          message: msj,
          status: read,
          updatedAt: -1 * new Date().getTime(),
        });
    } catch (error) {
      message('Sorry, this message could not be sent.');
      console.log(error);
    }
  }

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: [
            styles.containerMsgRight,
            // { backgroundColor: theme['color-primary-default'] },
          ],
          left: [
            styles.containerMsgLeft,
            // { backgroundColor: 'blue' },
          ],
        }}
        textStyle={{
          // right: [{ color: theme['color-basic-100'] }, styles.textMsgRight],
          // left: [{ color: theme['text-basic-color'] }, styles.textMsgLeft],
        }}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ opacity: 1 }}
          color={theme['color-primary-default']}
        />
      </View>
    );
  };

  const renderInput = props => (
      <InputToolbar
      {...props}
    
      containerStyle={[
        // { backgroundColor: 'transparent' },
        styles.inputToolbarStyles,
      ]}
    />
  );

  const renderComposer = props => (
    <View style={{ flex: 1, backgroundColor: Colors.grayLight, marginTop: -1 }}>
      <Composer
        {...props}
        multiline={false}
        textInputStyle={[
          {
            color: theme['text-basic-color'],
            backgroundColor: theme['color-basic-100'],
          },
          styles.composerStyles,
        ]}
      />
    </View>
  );

  const renderSend = props => (
    <View style={{ backgroundColor: Colors.grayLight, marginTop: -1 }}>
      <Send {...props} containerStyle={styles.sendBtnStyles}>
       
      </Send>
    </View>
  );

  return (
    // <Container
    //   backgroundColor={Colors.grayLight}
    //   withBar={{ colorBar: theme['color-basic-100'] }}
    //   withHeader={{
    //     title: `${decodeURI(name)}`,
    //     userId: _id,
    //     mode,
    //     accessoryRight: {
    //       name: 'close',
    //       onPress: () => {
    //         if (onClose) onClose();
    //         else navigation.goBack();
    //       },
    //     },
    //   }}>
    <Layout style={{flex:1}} >
         {!loading && (
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          alwaysShowSend={true}
          renderSend={renderSend}
          user={mapUser(info)}
          renderBubble={renderBubble}
          renderLoading={renderLoading}
          placeholder="Enviar mensaje..."
          renderComposer={renderComposer}
          renderInputToolbar={renderInput}
          showAvatarForEveryMessage={!true}
          renderChatFooter={() => <View style={{ height: 10 }} />}
        />
      )}
    </Layout>
   
    // </Container>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  containerMsgRight: {
    paddingTop: 5,
    paddingLeft: 5,
    borderRadius: 15,
    borderBottomRightRadius: 0,
  },
  containerMsgLeft: {
    paddingTop: 5,
    paddingRight: 5,
    borderRadius: 15,
    marginLeft: -40,
    borderBottomLeftRadius: 0,
  },
  textMsgRight: {
    fontSize: 14,
    // marginRight: 50,
    // fontFamily: Fonts.medium,
  },
  textMsgLeft: {
    fontSize: 14,
    // fontFamily: Fonts.medium,
  },
  composerStyles: {
    fontSize: 16,
    // fontFamily: Fonts.medium,
    borderRadius: 25,
    minHeight: 48,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginLeft: 0,
    marginBottom: 0,
  },
  inputToolbarStyles: {
    borderRadius: 25,
    padding: 0,
    margin: 5,
  },
  sendBtnStyles: {
    minHeight: 48,
    marginLeft: 5,
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
