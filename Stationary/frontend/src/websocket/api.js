import messaging from "@react-native-firebase/messaging";
import axios from "axios";

async function registerFCMToken(userId) {
  const token = await messaging().getToken();

  await axios.post("http://localhost:5000/api/save-fcm-token", {
    userId,
    fcmToken: token,
  });

  console.log("FCM Token saved:", token);
}
