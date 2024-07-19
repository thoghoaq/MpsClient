importScripts('https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js',
)

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

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  )
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
