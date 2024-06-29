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
    data: {
      url: "https://habtrackit.vercel.app/",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((windowClients) => {
        // If a window is already open, focus on it.
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one.
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
