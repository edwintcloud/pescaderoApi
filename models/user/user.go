package user

import "github.com/globalsign/mgo/bson"

//user model
type User struct {
	ID         bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Avatar     string        `bson:"avatar" json:"avatar" binding:"required"`
	First_Name string        `bson:"first_name" json:"first_name" binding:"required"`
	Last_Name  string        `bson:"last_name" json:"last_name" binding:"required"`
	Email      string        `bson:"email" json:"email" binding:"required"`
	Password   string        `bson:"password" json:"password" binding:"required"`
	City       bson.ObjectId `json:"city_id,omitempty" bson:"city_id,omitempty"`
}
