// export const IMAGE_PATHS = {
//   ERROR_OCCURRED: "/images/error-occured.png", // public 기준 경로
//   MAPIMAGE : "/images/map-icon.png",
//   SIGNUP_ICON : "/images/signup_image.png",
//   LOGIN_ICON : "/images/login_image.png",
//   SUCCESS_ICON: "/images/signup_success.png",
// };

export const IMAGE_PATHS = {
  ERROR_OCCURRED: `${process.env.PUBLIC_URL}/images/error-occured.png`,
  MAPIMAGE: `${process.env.PUBLIC_URL}/images/map-icon.png`,
  SIGNUP_ICON: `${process.env.PUBLIC_URL}/images/signup_image.png`,
  LOGIN_ICON: `${process.env.PUBLIC_URL}/images/login_image.png`,
  SUCCESS_ICON: `${process.env.PUBLIC_URL}/images/signup_success.png`,
};
