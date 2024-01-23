import axios from "axios";

export const axiosClient = axios.create({
  baseURL:
    typeof window === "undefined"
      ? "http://ingress-nginx-controller.ingress-nginx"
      : "",
});
