# pescaderoApi
Api for Project Pescadero in go

## Environment
This project uses a .env file which is not uploaded to github, please see .env-example file for reference.

## Database
This project also uses MongoDB, make sure the latest version is installed and `mongod` is running.

## Client
The server will serve react app built at `./client/build`. 

## Setup
Make sure you have govendor installed and `$GOPATH/bin` in your path. Go should be installed and your go path should be setup correctly. Make sure to clone the repo in your go path.
```sh
git clone https://github.com/edwintcloud/pescaderoApi.git pescaderoApi
govendor sync
go run server.go
```