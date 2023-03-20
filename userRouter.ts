import * as http from "http";
import * as url from "url";
import connectionPool from "./db";
import getCurrentTimeStamp from "./timeStampHelper";
import {
  handleUserPost,
  handleUserGetById,
  handleUserGetAll,
  handleUserDelete,
  handleUserPatch,
  handleUserPut,
} from "./userController";

const userRouter = (req: any, res: http.ServerResponse, body: string) => {
  const { pathname, query } = url.parse(req.url, true);
  let reqBody;
  try {
    reqBody = JSON.parse(body);
  } catch (e) {}

  if (req.method === "POST") {
    handleUserPost(reqBody, res);
  }

  if (req.method === "GET" && pathname?.lastIndexOf("/getById") != -1) {
    handleUserGetById(query, res);
  } else if (req.method === "GET") {
    handleUserGetAll(query, res);
  }

  if (req.method === "PATCH" && pathname?.lastIndexOf("/delete") != -1) {
    handleUserDelete(query, res);
  } else if (req.method === "PATCH") {
    handleUserPatch(reqBody, query, res);
  }

  if (req.method === "PUT") {
    handleUserPut(reqBody, query, res);
  }
};

export default userRouter;
