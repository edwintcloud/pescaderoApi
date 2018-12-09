package models

import (
	"errors"
	"regexp"

	"github.com/globalsign/mgo/bson"
	"golang.org/x/crypto/bcrypt"
)

// City model
type City struct {
	ID      bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name    string        `bson:"name" json:"name" binding:"required"`
	State   string        `bson:"state" json:"state" binding:"required"`
	Country string        `bson:"country" json:"country" binding:"required"`
}

// User model
type User struct {
	ID        bson.ObjectId `bson:"_id,omitempty" json:"_id,omitempty"`
	Avatar    string        `bson:"avatar" json:"avatar"`
	FirstName string        `bson:"firstName" json:"firstName" binding:"required"`
	LastName  string        `bson:"lastName" json:"lastName" binding:"required"`
	Email     string        `bson:"email" json:"email" binding:"required"`
	Password  string        `bson:"password" json:"password" binding:"required"`
	City      bson.ObjectId `bson:"city,omitempty" json:"city,omitempty"`
}

// Login model
type Login struct {
	Email    string `bson:"email" json:"email" binding:"required"`
	Password string `bson:"password" json:"password" binding:"required"`
}

// LocationObject model for issue marker
type LocationObject struct {
	Latitude  string `bson:"lat" json:"lat" binding:"required" structs:"lat"`
	Longitude string `bson:"lng" json:"lng" binding:"required" structs:"lng"`
}

// Issue model
type Issue struct {
	ID          bson.ObjectId  `json:"_id,omitempty" bson:"_id,omitempty" structs:"_id"`
	Title       string         `bson:"title" json:"title" structs:"title"`
	Description string         `bson:"description" json:"description" structs:"description"`
	Author      bson.ObjectId  `json:"author" bson:"author" structs:"author"`
	ResolvedBy  bson.ObjectId  `json:"resolvedBy,omitempty" bson:"resolvedBy,omitempty" structs:"resolvedBy"`
	City        bson.ObjectId  `json:"city" bson:"city" structs:"city"`
	Location    LocationObject `bson:"location" json:"location" structs:"location"`
	Resolved    string         `bson:"resolved" json:"resolved" structs:"resolved"`
}

// validations

// CheckValid validates issue model.
func (m Issue) CheckValid() error {

	if len(m.Title) < 5 {
		return errors.New("title must be at least 6 characters long")
	}

	if len(m.Description) < 49 {
		return errors.New("description must be at least 50 characters")
	}

	return nil

}

// user validations

// HashPassword hashes user password and returns user
func (u User) HashPassword() User {

	// generate hash from password.
	hash, _ := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	u.Password = string(hash)
	return u

}

// ComparePasswords compares a userFound password(hash) to a userReq password(string)
func (u Login) ComparePasswords(uF User) error {
	// make sure userFound is not empty first
	if len(uF.Email) == 0 {
		return errors.New("user not found")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(uF.Password), []byte(u.Password)); err != nil {
		return errors.New("invalid password")
	}
	return nil
}

// CheckValid makes sure user struct has valid input to insert into database
func (u User) CheckValid() error {
	// Validate Password
	if len(u.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	// Validate FirstName and LastName
	if len(u.FirstName) < 1 || len(u.LastName) < 1 {
		return errors.New("names must be at least 1 characters")
	}
	//Validate Email
	if match, _ := regexp.MatchString(`.+@.+\..+`, u.Email); !match {
		return errors.New("not a valid email address")
	}
	return nil
}
