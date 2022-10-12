# [Auth using Node js](https://github.com/nik-55/auth-using-nodejs.git)

> ### `Hello , Myself Nikhil Mahajan studying at iit roorkee.`

Many time while developing we require to authorize users. Writing from scratch the whole auth can be trouble.  
This repo is just a simple template creating simple api end points :

```
/register
/login
/profile
```

## Setup

After downloading the repo code open your editor and in the terminal :

```
npm install
```

This will install all dependencies required.

### Database

Go to [Mongo Db Atlas]("https://www.mongodb.com/atlas") and setup your database and copy the URL required to connect your server to database.

### Environment Variable

Create a .env file in root folder and also add .env to .gitignore.  
In .env :

```
MONGO_DB=<url copied above>
PORT=<Any port number like 8000>
SECRET_KEY_JWT=<Secret key for generating and verifing jwt tokens>
```

### Starting the server

Open terminal in root folder and run the following command to start the server

```
node ./server.js
```

## Api End Points

```
/register
```

- This takes email and password from request and first validate that email and password requested are correct input or not.
- Then if correct it hashes the password.
- User information is then stored in your mongo db.
- Email need to be unique otherwise it will response with error.

```
/login
```

- This also takes email and password from request and validate them as correct input.
- Then if correct it query the database to check if user exist.
- If exist it validate that whether password is correct or not.
- If correct it response with a jwt token whose expiration time is 1 hour.
- Payload of token conatin email.

```
/profile
```

- Request body header should contain a valid jwt token in Authorization Field otherwise it will response with error.
- Then if jwt token is verified it decodes the payload and query on database using email to find more user information.

### Customization

- One can modify user schemma to create more fields or can use auth middleware to authorize the request.

- Create more api end points in routes.js
  and write the function in view folder.

### Message

```
It will be nice if you report bugs or contribute to improve the code and security.

Thanks !!
Happy Hacking...

- nikhil
```
