import * as http from "http";
import * as url from "url";
import connectionPool from "./db";
import getCurrentTimeStamp from "./timeStampHelper";
import {
  handleRolePost,
  handleRoleGetById,
  handleRoleGetAll,
  handleRoleDelete,
  handleRolePatch,
  handleRolePut,
} from "./roleController";

const roleRouter = (req: any, res: http.ServerResponse, body: string) => {
  const { pathname, query } = url.parse(req.url, true);
  let reqBody;
  try {
    reqBody = JSON.parse(body);
  } catch (e) {}

  if (req.method === "POST") {
    handleRolePost(reqBody, res);
  }

  if (req.method === "GET" && pathname?.lastIndexOf("/getById") != -1) {
    handleRoleGetById(query, res);
  } else if (req.method === "GET") {
    handleRoleGetAll(query, res);
  }

  if (req.method === "PATCH" && pathname?.lastIndexOf("/delete") != -1) {
    handleRoleDelete(query, res);
  } else if (req.method === "PATCH") {
    handleRolePatch(reqBody, query, res);
  }

  if (req.method === "PUT") {
    handleRolePut(reqBody, query, res);
  }
};

export default roleRouter;
