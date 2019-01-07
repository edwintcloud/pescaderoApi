# pescaderoApi
Project pescadero mono-repo. Frontend is located in `/client`. Backend is in root. This project also uses my avatarMate API which is live at [https://avatarmate.herokuapp.com/](https://avatarmate.herokuapp.com/).

## Environment
This project uses a .env file which is not uploaded to github, please see .env-example file for reference.

## Database
This project also uses MongoDB, make sure the latest version is installed and `mongod` is running.

## Client
Make sure you have latest version of Node and NPM.
```sh
cd client
npm i
```
To run the client for development:
```sh
npm run dev
```

## Server
Make sure you have govendor installed and `$GOPATH/bin` in your path. Go should be installed and your go path should be setup correctly.
```sh
git clone https://github.com/edwintcloud/pescaderoApi.git pescaderoApi
govendor sync
```
To run the server for development:
```sh
go run server.go
```