package issue

import (
	"errors"

	"github.com/globalsign/mgo/bson"
)

// LocationObject model for issue marker
type LocationObject struct {
	Latitude  string `bson:"lat" json:"lat" binding:"required" structs:"lat"`
	Longitude string `bson:"lng" json:"lng" binding:"required" structs:"lng"`
}

// Issue model
type Issue struct {
	ID          bson.ObjectId  `json:"_id,omitempty" bson:"_id,omitempty" structs:"_id"`
	Title       string         `bson:"title" json:"title" binding:"required" structs:"title"`
	Description string         `bson:"description" json:"description" binding:"required" structs:"description"`
	Author      bson.ObjectId  `json:"author" bson:"author" binding:"required" structs:"author"`
	ResolvedBy  bson.ObjectId  `json:"resolvedBy,omitempty" bson:"resolvedBy,omitempty" structs:"resolvedBy"`
	City        bson.ObjectId  `json:"city" bson:"city" binding:"required" structs:"city"`
	Location    LocationObject `bson:"location" json:"location" binding:"required" structs:"location"`
}

// Result model
type Result struct {
	ID          bson.ObjectId  `json:"_id,omitempty" bson:"_id,omitempty" structs:"_id"`
	Title       string         `bson:"title" json:"title" binding:"required" structs:"title"`
	Description string         `bson:"description" json:"description" binding:"required" structs:"description"`
	Author      UserResult     `json:"author" bson:"author" binding:"required" structs:"author"`
	ResolvedBy  bson.ObjectId  `json:"resolvedBy,omitempty" bson:"resolvedBy,omitempty" structs:"resolvedBy"`
	City        CityResult     `json:"city" bson:"city" binding:"required" structs:"city"`
	Location    LocationObject `bson:"location" json:"location" binding:"required" structs:"location"`
}

// UserResult model
type UserResult struct {
	ID        bson.ObjectId `bson:"_id,omitempty" json:"_id,omitempty"`
	Avatar    string        `bson:"avatar" json:"avatar"`
	FirstName string        `bson:"firstName" json:"firstName" binding:"required"`
	LastName  string        `bson:"lastName" json:"lastName" binding:"required"`
	Email     string        `bson:"email" json:"email" binding:"required"`
	City      bson.ObjectId `bson:"city,omitempty" json:"city,omitempty"`
}

// CityResult model
type CityResult struct {
	ID      bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name    string        `bson:"name" json:"name" binding:"required"`
	State   string        `bson:"state" json:"state" binding:"required"`
	Country string        `bson:"country" json:"country" binding:"required"`
}

// CheckValid validates issue model.
func (Issue) CheckValid(m *Issue) error {

	if len(m.Title) < 5 {
		return errors.New("title must be at least 6 characters long")
	}

	if len(m.Description) < 49 {
		return errors.New("description must be at least 50 characters")
	}

	return nil

}
