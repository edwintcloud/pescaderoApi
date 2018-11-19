package issue

import (
	"errors"

	"github.com/globalsign/mgo/bson"
)

// Issue model
type Issue struct {
	ID          bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string        `bson:"title" json:"title" binding:"required"`
	Description string        `bson:"description" json:"description" binding:"required"`
	Author      bson.ObjectId `json:"author_id,omitempty" bson:"author_id,omitempty"`
	Resolved_By bson.ObjectId `json:"resolved_id,omitempty" bson:"resolved_id,omitempty"`
	City        bson.ObjectId `json:"city_id,omitempty" bson:"city_id,omitempty"`
}

// Validate issue model.
func (Issue) CheckValid(x *Issue) error {

	if len(x.Title) < 5 {
		return errors.New(" title must be at least 6 characters long")
	}

	if len(x.Description) < 49 {
		return errors.New(" description must be at least 50 charactaers")
	}

	return nil

}
