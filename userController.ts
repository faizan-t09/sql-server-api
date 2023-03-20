import { ServerResponse } from "http";
import connectionPool from "./db";
import getCurrentTimeStamp from "./timeStampHelper";

export const handleUserPost = (reqBody: any, res: ServerResponse) => {
  if (
    reqBody instanceof Array &&
    Object.keys(reqBody[0]).toString() ==
      ["username", "password", "roleId", "createdBy", "updatedBy"].toString()
  ) {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    let insertQuery = `insert into user (username, password, roleId, createdAt, createdBy, updatedAt, updatedBy) values `;

    insertQuery += `("${reqBody[0].username}","${reqBody[0].password}",${reqBody[0].roleId},${timeStamp},${reqBody[0].createdBy},${timeStamp},${reqBody[0].updatedBy})`;

    for (let i = 1; i < reqBody.length; i++) {
      insertQuery += `,("${reqBody[i].username}","${reqBody[i].password}",${reqBody[i].roleId},${timeStamp},${reqBody[i].createdBy},${timeStamp},${reqBody[i].updatedBy})`;
    }

    insertQuery += ";";

    connectionPool.query(insertQuery, (error, results, fields) => {
      if (error) {
        res.writeHead(422);
        res.write("Error in inserting : " + error.sqlMessage);
        res.end();
      } else {
        res.writeHead(200);
        res.write("Users successfully inserted");
        res.end();
      }
    });
  } else {
    res.writeHead(400);
    res.write("Body format not correct");
    res.end();
  }
};

export const handleUserGetById = (query: any, res: ServerResponse) => {
  if (query.id) {
    connectionPool.query(
      `select u.id ,u.username,r.name as role,u1.username as createdBy,u.createdAt,u2.username as updatedBy,u.updatedAt from user as u inner join  role as r on u.roleid = r.id inner join user as u1 on u.createdBy =u1.id inner join user as u2 on u.updatedBy = u2.id where u.id = ${query.id} AND u.deletedBy IS NULL;`,
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.writeHead(422);
          res.write(
            "Error in getting user for id = " +
              query.id +
              " : " +
              error.sqlMessage
          );
          res.end();
        } else if (results?.length > 0) {
          res.writeHead(200);
          res.write(JSON.stringify(results[0]));
          res.end();
        } else {
          res.writeHead(404);
          res.write("No user for id : " + query.id);
          res.end();
        }
      }
    );
  } else {
    res.writeHead(400);
    res.write("No id provided");
    res.end();
  }
};

export const handleUserGetAll = (query: any, res: ServerResponse) => {
  let getAllQuery = `select u.id ,u.username,r.name as role,u1.username as createdBy,u.createdAt,u2.username as updatedBy,u.updatedAt from user as u inner join  role as r on u.roleid = r.id inner join user as u1 on u.createdBy =u1.id inner join user as u2 on u.updatedBy = u2.id where u.deletedBy IS NULL`;

  if (query.sort) {
    getAllQuery += ` order by u.${query.sort}`;
    if (query.isDescending === "true") {
      getAllQuery += ` DESC`;
    }
  }

  if (query.limit) {
    getAllQuery += ` limit ${query.limit}`;
    if (query.page) {
      getAllQuery += ` offset ${Number(query.limit) * Number(query.page)} `;
    }
  }

  getAllQuery += `;`;

  connectionPool.query(getAllQuery, (error, results, fields) => {
    if (error) {
      res.writeHead(422);
      res.write("Error in getting users : " + error.sqlMessage);
      res.end();
    } else if (results?.length > 0) {
      res.writeHead(200);
      res.write(JSON.stringify(results));
      res.end();
    } else {
      res.writeHead(404);
      res.write("No users to fetch");
      res.end();
    }
  });
};

export const handleUserDelete = (query: any, res: ServerResponse) => {
  if (query.id && query.id != "1") {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    connectionPool.query(
      `update user set deletedAt = ${timeStamp},deletedBy = 1 where id = ${query.id}`,
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.writeHead(422);
          res.write(
            "Error in deleting user for id = " +
              query.id +
              " : " +
              error.sqlMessage
          );
          res.end();
        } else if (results.affectedRows > 0) {
          res.writeHead(200);
          res.write("Deleted user successfully");
          res.end();
        } else {
          res.writeHead(404);
          res.write("No user for id : " + query.id);
          res.end();
        }
      }
    );
  } else {
    res.writeHead(400);
    res.write("No id provided");
    res.end();
  }
};

export const handleUserPatch = (
  reqBody: any,
  query: any,
  res: ServerResponse
) => {
  if (query.id && query.id != "1") {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    let updateQuery = `update user set `;

    for (const key in reqBody.updates) {
      if (isNaN(reqBody.updates[key]))
        updateQuery += `${key} = "${reqBody.updates[key]}", `;
      else updateQuery += `${key} = ${reqBody.updates[key]}, `;
    }

    updateQuery += `updatedAt = ${timeStamp}, `;
    updateQuery += `updatedBy = 1 `;
    updateQuery += `where id = ${query.id} AND deletedBy IS NULL;`;

    connectionPool.query(updateQuery, (error, results, fields) => {
      if (error) {
        res.writeHead(422);
        res.write("Error in updating : " + error.sqlMessage);
        res.end();
      } else {
        res.writeHead(200);
        res.write("Record successfully updated");
        res.end();
      }
    });
  } else {
    res.writeHead(400);
    res.write("No id provided");
    res.end();
  }
};
export const handleUserPut = (
  reqBody: any,
  query: any,
  res: ServerResponse
) => {
  if (query.id && query.id != "1") {
    if (
      Object.keys(reqBody).toString() ==
      ["username", "password", "roleId", "createdBy", "updatedBy"].toString()
    ) {
      let timeStamp = '"' + getCurrentTimeStamp() + '"';

      let putQuery = `update user set `;

      for (const key in reqBody) {
        if (isNaN(reqBody[key])) putQuery += `${key} = "${reqBody[key]}", `;
        else putQuery += `${key} = ${reqBody[key]}, `;
      }

      putQuery += `updatedAt = ${timeStamp}, `;
      putQuery += `updatedBy = ${reqBody["updatedBy"]} `;
      putQuery += `where id = ${query.id} AND deletedBy IS NULL;`;

      connectionPool.query(putQuery, (error, results, fields) => {
        if (error) {
          res.writeHead(422);
          res.write("Error in updating : " + error.sqlMessage);
          res.end();
        } else {
          res.writeHead(200);
          res.write("User successfully updated");
          res.end();
        }
      });
    } else {
      res.writeHead(400);
      res.write("Body format not correct");
      res.end();
    }
  } else {
    res.writeHead(400);
    res.write("No id provided");
    res.end();
  }
};
