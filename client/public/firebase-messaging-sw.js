importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD1dKlA8e1oQO6YcuAOUl_HL8ShYJn28MU",
  authDomain: "habtrackit.firebaseapp.com",
  projectId: "habtrackit",
  storageBucket: "habtrackit.appspot.com",
  messagingSenderId: "20295302252",
  appId: "1:20295302252:web:34e020609cf452a49cac49",
  measurementId: "G-N0GJNFEJNJ",
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
