import axios from "axios";
import { cookies } from "next/headers";

export const serverAxios = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return axios.create({
    baseURL: process.env.APIurl,
    headers: {
      Cookie: cookieHeader,
    },
  });
};
