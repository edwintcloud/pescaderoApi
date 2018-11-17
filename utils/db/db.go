package db

import (
	"github.com/globalsign/mgo"
)

var DB *mgo.Database

func Connect(c string, d string) *mgo.Session {
	session, _ := mgo.Dial(c)
	DB = session.DB(d)
	return session
}
