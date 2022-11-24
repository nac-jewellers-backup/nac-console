import { API_URL } from "../config";
import Axios from "axios";

export const UploadImage = (file) => {
  var bodyFormData = new FormData();
  bodyFormData.set("web_img", file);

  return Axios.post(API_URL + "/banner_image_upload", bodyFormData, {
    headers: {
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "Content-Type": `multipart/form-data; boundary=${bodyFormData._boundary}`,
    },
  });
};
