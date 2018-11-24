package issue

import (
	"errors"

	"github.com/globalsign/mgo/bson"
)

// LocationObject model for issue marker
type LocationObject struct {
	Longitude string `bson:"lng" json:"lng" binding:"required"`
	Latitude  string `bson:"lat" json:"lat" binding:"required"`
}

// Issue model
type Issue struct {
	ID          bson.ObjectId  `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string         `bson:"title" json:"title" binding:"required"`
	Description string         `bson:"description" json:"description" binding:"required"`
	Resolved    bool           `json:"resolved" bson:"resolved" binding:"required"`
	Author      bson.ObjectId  `json:"author,omitempty" bson:"author,omitempty"`
	ResolvedBy  bson.ObjectId  `json:"resolvedBy,omitempty" bson:"resolvedBy,omitempty"`
	City        bson.ObjectId  `json:"city,omitempty" bson:"city,omitempty"`
	Location    LocationObject `bson:"location" json:"location" binding:"required"`
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
