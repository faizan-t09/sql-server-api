import * as http from "http";
import serverRouter from "./serverRouter";
import * as dotenv from 'dotenv';
dotenv.config()

const getBodyFromRequest = async (req: http.IncomingMessage) => {
  let buffer: any = [];
  for await (const chunk of req) {
    buffer.push(chunk);
  }
  return Buffer.concat(buffer).toString();
};

const server = http.createServer(async (req, res) => {
  const body = await getBodyFromRequest(req);
  serverRouter(req,res,body)
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening to port ${process.env.PORT}`);
});
