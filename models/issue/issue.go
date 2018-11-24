package issue

import (
	"errors"

	"github.com/globalsign/mgo/bson"
)

// LocationObject model for issue marker
type LocationObject struct {
	Latitude  string `bson:"lat" json:"lat" binding:"required"`
	Longitude string `bson:"lng" json:"lng" binding:"required"`
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
