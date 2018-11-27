package image 

import (
	"github.com/globalsign/mgo/bson"
)


type Image struct{
 	ID        bson.ObjectId `bson:"_id,omitempty" json:"_id,omitempty"`
	User  bson.ObjectId `bson:"user,omitempty" json:"user,omitempty"`
	Base64   string        `bson:"base64" json:"base64"`
}