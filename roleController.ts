import { ServerResponse } from "http";
import connectionPool from "./db";
import getCurrentTimeStamp from "./timeStampHelper";

export const handleRolePost = (reqBody: any, res: ServerResponse) => {
  if (
    reqBody instanceof Array &&
    Object.keys(reqBody[0]).toString() ==
      ["name", "createdBy", "updatedBy"].toString()
  ) {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    let insertQuery = `insert into role (name, createdAt, createdBy, updatedAt, updatedBy) values `;

    insertQuery += `("${reqBody[0].name}",${timeStamp},${reqBody[0].createdBy},${timeStamp},${reqBody[0].updatedBy})`;

    for (let i = 1; i < reqBody.length; i++) {
      insertQuery += `,("${reqBody[i].name}",${timeStamp},${reqBody[i].createdBy},${timeStamp},${reqBody[i].updatedBy})`;
    }

    insertQuery += ";";

    connectionPool.query(insertQuery, (error, results, fields) => {
      if (error) {
        res.writeHead(422);
        res.write("Error in inserting : " + error.sqlMessage);
        res.end();
      } else {
        res.writeHead(200);
        res.write("Roles successfully inserted");
        res.end();
      }
    });
  } else {
    res.writeHead(400);
    res.write("Body format not correct");
    res.end();
  }
};

export const handleRoleGetById = (query: any, res: ServerResponse) => {
  if (query.id) {
    connectionPool.query(
      `select r.id,name,u.username as createdBy,r.createdAt,k.username as updatedBy,r.updatedAt from role as r inner join user as u on r.createdBy = u.id inner join user as k on r.updatedBy = k.id where r.id = ${query.id} AND r.deletedBy IS NULL;`,
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.writeHead(422);
          res.write(
            "Error in getting role for id = " +
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
          res.write("No role for id : " + query.id);
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

export const handleRoleGetAll = (query: any, res: ServerResponse) => {
  let getAllQuery = `select r.id,name,u.username as createdBy,r.createdAt,k.username as updatedBy,r.updatedAt from role as r inner join user as u on r.createdBy = u.id inner join user as k on r.updatedBy = k.id where r.deletedBy IS NULL`;

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
      res.write("Error in getting roles : " + error.sqlMessage);
      res.end();
    } else if (results?.length > 0) {
      res.writeHead(200);
      res.write(JSON.stringify(results));
      res.end();
    } else {
      res.writeHead(404);
      res.write("No roles to fetch");
      res.end();
    }
  });
};

export const handleRoleDelete = (query: any, res: ServerResponse) => {
  if (query.id && query.id != "1") {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    connectionPool.query(
      `update role set deletedAt = ${timeStamp},deletedBy = 1 where id = ${query.id}`,
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.writeHead(422);
          res.write(
            "Error in deleting role for id = " +
              query.id +
              " : " +
              error.sqlMessage
          );
          res.end();
        } else if (results.affectedRows > 0) {
          res.writeHead(200);
          res.write("Deleted role successfully");
          res.end();
        } else {
          res.writeHead(404);
          res.write("No role for id : " + query.id);
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

export const handleRolePatch = (
  reqBody: any,
  query: any,
  res: ServerResponse
) => {
  if (query.id && query.id != "1") {
    let timeStamp = '"' + getCurrentTimeStamp() + '"';

    let updateQuery = `update role set `;

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
export const handleRolePut = (
  reqBody: any,
  query: any,
  res: ServerResponse
) => {
  if (query.id && query.id != "1") {
    if (
      Object.keys(reqBody).toString() ==
      ["name", "createdBy", "updatedBy"].toString()
    ) {
      let timeStamp = '"' + getCurrentTimeStamp() + '"';

      let putQuery = `update role set `;

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
          res.write("Role successfully updated");
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
