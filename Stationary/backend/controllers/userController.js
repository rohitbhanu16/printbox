const User = require("../models/User");

exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fcmToken },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "FCM Token updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating FCM Token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
