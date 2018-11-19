package user

import (
	"errors"
	"regexp"

	"github.com/globalsign/mgo/bson"
	"golang.org/x/crypto/bcrypt"
)

// User model
type User struct {
	ID        bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Avatar    string        `bson:"avatar,omitempty" json:"avatar,omitempty"`
	FirstName string        `bson:"firstName" json:"firstName" binding:"required"`
	LastName  string        `bson:"lastName" json:"lastName" binding:"required"`
	Email     string        `bson:"email" json:"email" binding:"required"`
	Password  string        `bson:"password" json:"password" binding:"required"`
	City      bson.ObjectId `json:"city_id,omitempty" bson:"city_id,omitempty"`
}

// HashPassword hashes user password and returns user
func (User) HashPassword(m *User) *User {

	// generate hash from password.
	hash, _ := bcrypt.GenerateFromPassword([]byte(m.Password), bcrypt.DefaultCost)
	m.Password = string(hash)
	return m

}

// ComparePasswords compares a user Found password(hash) to a user password(string)
func (User) ComparePasswords(fm *User, m *User) error {
	if err := bcrypt.CompareHashAndPassword([]byte(fm.Password), []byte(m.Password)); err != nil {
		return errors.New("invalid password")
	}
	return nil
}

// CheckValid makes sure user struct has valid input to insert into database
func (User) CheckValid(m *User) error {
	// Validate Password
	if len(m.Password) < 5 {
		return errors.New("Password must be at least 6 characters!")
	}
	// Validate FirstName and LastName
	if len(m.FirstName) < 2 || len(m.LastName) < 2 {
		return errors.New("names must be at least 3 characters")
	}
	//Validate Email
	if match, _ := regexp.MatchString(`.+@.+\..+`, m.Email); !match {
		return errors.New("not a valid email address")
	}
	return nil
}
