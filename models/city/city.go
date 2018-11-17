package city

import "github.com/globalsign/mgo/bson"

// City model
type City struct {
	ID      bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name    string        `bson:"name" json:"name" binding:"required"`
	State   string        `bson:"state" json:"state" binding:"required"`
	Country string        `bson:"country" json:"country" binding:"required"`
}
