
export const mediaConstraints = {
  audio: true,
  isOnlyVoice: false,
  video: {
      frameRate: 30,
      facingMode: 'user'
  }
};
export const peerConstraints = {
  iceServers: [{
      urls: [ "stun:ws-turn4.xirsys.com" ]}, 
      {username: "OUKzyQ7dJ7RLp3oMYmHwPMkmDS8jIuojMzswbeCRfv_VyJpP26uc5VTCu0UuYUIzAAAAAGNkVIBKYWlyb0NhbWFyaWxsbw==",
      credential: "bbad8616-5bd2-11ed-96e5-0242ac140004",
      urls: [
      "turn:ws-turn4.xirsys.com:80?transport=udp",
      "turn:ws-turn4.xirsys.com:3478?transport=udp",
      "turn:ws-turn4.xirsys.com:80?transport=tcp",
      "turn:ws-turn4.xirsys.com:3478?transport=tcp",
      "turns:ws-turn4.xirsys.com:443?transport=tcp",
       "turns:ws-turn4.xirsys.com:5349?transport=tcp"
      ]}]
};
export const  sessionConstraints = {
  mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true
  }
};