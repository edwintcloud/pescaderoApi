package db

import (
	"strings"

	"github.com/globalsign/mgo"
)

var DB *mgo.Database

func Connect(c string) *mgo.Session {
	session, _ := mgo.Dial(c)
	database := strings.Split(c, "/")
	DB = session.DB(database[len(database)-1])
	return session
}
