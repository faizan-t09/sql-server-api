import * as http from "http";
import * as url from "url";
import userRouter from "./userRouter";
import roleRouter from "./roleRouter";

const serverRouter = (req: any, res: http.ServerResponse, body: string) => {
  const { pathname } = url.parse(req.url, true);
  if (pathname?.lastIndexOf("/user") != -1) {
    userRouter(req, res, body);
  } else if (pathname?.lastIndexOf("/role") != -1) {
    roleRouter(req, res, body);
  } else {
    console.log("No such path: " + pathname);
    res.writeHead(404);
    res.write("No such Path exists");
    res.end();
  }
};

export default serverRouter;
