package issue

import "github.com/globalsign/mgo/bson"

// Issue model
type Issue struct {
	ID          bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string        `bson:"title" json:"title" binding:"required"`
	Description string        `bson:"description" json:"description" binding:"required"`
	Author      bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Resolved_By bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	City        bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
}
