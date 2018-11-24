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
	Author      bson.ObjectId `json:"author" bson:"author" binding:"required"`
	ResolvedBy  bson.ObjectId `json:"resolvedBy,omitempty" bson:"resolvedBy,omitempty"`
	City        bson.ObjectId `json:"city" bson:"city" binding:"required"`
}

// CheckValid validates issue model.
func (Issue) CheckValid(m *Issue) error {

	if len(m.Title) < 5 {
		return errors.New("Title must be at least 6 characters long!")
	}

	if len(m.Description) < 49 {
		return errors.New("Description must be at least 50 characters!")
	}

	return nil

}
