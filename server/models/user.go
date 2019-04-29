package models

import (
	"errors"
	"regexp"

	"github.com/globalsign/mgo/bson"
	"golang.org/x/crypto/bcrypt"
)

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
