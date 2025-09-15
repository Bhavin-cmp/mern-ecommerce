export const logUserActivity = async (userId, event, details = {}) => {
  try {
    await axios.post(
      "http://localhost:8000/api/logs",
      { userId, event, details },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Error logging user activity", error);
  }
};
