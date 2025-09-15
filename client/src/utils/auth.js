export const getUserInfo = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error Getting user info from localStorage", error);
    return null;
  }
};

export const getUserId = () => {
  return getUserInfo()?.user?.id || null;
};

export const getUserToken = () => {
  return localStorage.getItem("token") || null;
};

export const isUserLoggedIn = () => {
  return !!getUserToken();
};
