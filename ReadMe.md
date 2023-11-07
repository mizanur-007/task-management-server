##TaskSwift server

hosted link: https://task-management-server-peach.vercel.app/

Tools used: NodeJS, expressjs, cors, cookie-parser, json web token, dotenv, mongodb

**To run in localhost it will need to change user credentials which will not be provided on gitfile. one need to open a db as the name exist and create a user and password. also used a secret key. These 3 are variables used in this project which will be needed to create by the person who need to run in local. otherwise hosted link is already provided.

api s
api's created for fetching data using app.get method
                  post data using app.post() method
                  update data using app.put() method

* here app.post('/jwt) is used to create a cookie and send it to client side. 
 cookie parser is used to get the cookie from client and a verify function is created to see the request validate or not

 *On logout the cookie will be cleared