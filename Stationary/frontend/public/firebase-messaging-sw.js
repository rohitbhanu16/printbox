importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  projectId: "printbox-fc776",
  messagingSenderId: "743934182673",
  authDomain: "printbox-fc776.firebaseapp.com",
  apiKey: "AIzaSyDHvLqH220-tHjIplbrWXOP4IrVT05Y1fs",
  appId: "1:743934182673:web:a21ac534fb402715fc38b0",
  storageBucket: "printbox-fc776.firebasestorage.app",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (!payload.notification) return;
});
