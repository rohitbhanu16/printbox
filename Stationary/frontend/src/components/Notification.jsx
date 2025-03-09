import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

const Notification = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (token) {
          console.log("FCM Token:", token);
        }
      } catch (err) {
        console.error("Error getting token:", err);
      }
    };

    const handleForegroundNotification = (payload) => {
      const { title, body, icon } = payload.notification;

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-white shadow-md rounded-lg flex items-center p-4 border border-gray-200`}
        >
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={icon || "/default-avatar.png"}
            alt="Notification Icon"
          />
          <div className="ml-4 flex flex-col justify-start">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 mt-1">{body}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-gray-500 cursor-pointer hover:text-gray-700 transition"
          >
            ✖
          </button>
        </div>
      ));
    };

    const unsubscribe = onMessage(messaging, handleForegroundNotification);

    requestPermission();

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default Notification;
