import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken } from 'firebase/messaging'
import { onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDbucpmxCPaJovleCCQqef55lGm-AgX0a4",
  authDomain: "mpsystem-dd08b.firebaseapp.com",
  databaseURL: "https://mpsystem-dd08b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mpsystem-dd08b",
  storageBucket: "mpsystem-dd08b.appspot.com",
  messagingSenderId: "237577768182",
  appId: "1:237577768182:web:bc3461d15f43b21ef030d7",
  measurementId: "G-XZXV74BNW6"
};

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const messaging = getMessaging(firebaseApp)

const requestPermission = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_MESSAGING_PUBLIC_KEY,
    })
    if (currentToken) {
      console.log('Current token for client: ', currentToken)
      return currentToken
    } else {
      console.log(
        'No registration token available. Request permission to generate one.',
      )
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err)
  }
}

const initFirebaseMessaging = () => {
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      return requestPermission()
    } else {
      console.log('Unable to get permission to notify.')
    }
  })
}

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Show a notification or update the UI with the message payload
});

export { firebaseApp, messaging, initFirebaseMessaging }
