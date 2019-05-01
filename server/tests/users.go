package tests

import (
	"net/http"

	"github.com/edwintcloud/pescaderoApi/server/models"
	"gopkg.in/gavv/httpexpect.v1"
)

// TestUser is our test user struct
var TestUser = models.User{
	Email:     "test@email.com",
	FirstName: "test",
	LastName:  "user",
	Password:  "testing123",
}

// TestUsers is the main test function all other tests will be called in
func TestUsers(e *httpexpect.Expect) {

	// *********************
	// CREATE TEST
	createdUser := e.POST("/api/users").
		WithJSON(TestUser).
		Expect().
		Status(http.StatusOK).
		JSON()

	// ensure response has a success message
	createdUser.Object().ContainsKey("message")

	// *********************
	// LOGIN TEST
	loggedInUser := e.POST("/api/users/login").
		WithJSON(TestUser).
		Expect().
		Status(http.StatusOK).
		JSON()

	// ensure response has a success message
	loggedInUser.Object().ContainsKey("message")

	// *********************
	// GET CURRENT USER TEST
	getUser := e.GET("/api/users/current").
		Expect().
		Status(http.StatusOK).
		JSON()

	// ensure get user does not have error message
	getUser.Object().NotContainsKey("message")

}
