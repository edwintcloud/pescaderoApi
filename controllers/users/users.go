package users

import (
	"errors"
	"fmt"
	"pescaderoApi/models/user"
	"pescaderoApi/utils/db"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type usersController struct{}

var d *mgo.Collection

// Register registers controller routes with gin engine
func Register(e *gin.Engine) {
	c := usersController{}

	// set the db collection
	d = db.DB.C("users")

	// ensure the email field is indexed as unique
	index := mgo.Index{
		Key:      []string{"email"},
		Unique:   true,
		DropDups: true, // delete duplicate documents in case they somehow get put in
	}
	d.EnsureIndex(index)

	//routes
	routes := e.Group("/users")
	{
		routes.GET("", c.getUsers)
		routes.POST("", c.createUser)
		// e.PUT("/users", c.updateUser)
		// e.DELETE("/users", c.deleteUser)
		routes.POST("/login", c.loginUser)
		routes.POST("/logout", c.logoutUser)
		routes.GET("/current", c.getCurrentUser)
	}
}

// FIND Users BY QUERY OR LIST ALL
func (*usersController) getUsers(c *gin.Context) {
	var err error
	users := []user.User{}

	// make query params into a map string:string
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0]
	}

	// find by id if id is a query param, otherwise find all that match query params
	if id, exists := filter["id"]; exists {
		if !bson.IsObjectIdHex(id) {
			err = errors.New("not a valid ObjectId")
		}
		if err == nil {
			err = d.FindId(bson.ObjectIdHex(id)).All(&users)
		}
	} else {
		err = d.Find(filter).All(&users)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		switch len(users) {
		case 0:
			c.JSON(200, gin.H{
				"message": "no users found",
			})
		case 1:
			c.JSON(200, users[0])
		default:
			c.JSON(200, users)
		}
	}
}

// CREATE ONE
func (*usersController) createUser(c *gin.Context) {
	var err error
	reqUser := user.User{}

	// bind req body to user struct, validate fields, and hash password
	err = c.ShouldBindJSON(&reqUser)
	if err == nil {
		err = reqUser.CheckValid()
	}
	if err == nil {
		err = d.Insert(reqUser.HashPassword())
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"message": fmt.Sprintf("user %s added to database", reqUser.FirstName),
		})
	}
}

// // UPDATE User BY ID QUERY
// func (*usersController) updateUser(c *gin.Context) {
// 	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
// 		user := user.User{}

// 		if c.ShouldBindJSON(&user) == nil {
// 			if user.CheckValid(&user) == nil {
// 				if err := d.UpdateId(bson.ObjectIdHex(id), user.HashPassword(&user)); err == nil {
// 					c.JSON(200, gin.H{
// 						"message": fmt.Sprintf("User %s successfully updated!", user.FirstName),
// 					})
// 					return
// 				}
// 			}
// 		}
// 	}

// 	c.JSON(400, gin.H{
// 		"error": "Bad request - Unable to update user!",
// 	})
// }

// // DELETE User BY ID QUERY
// func (*usersController) deleteUser(c *gin.Context) {
// 	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
// 		if d.RemoveId(bson.ObjectIdHex(id)) == nil {
// 			c.JSON(200, gin.H{
// 				"message": fmt.Sprintf("User with _id %s successfully deleted!", id),
// 			})
// 			return
// 		}
// 	}

// 	c.JSON(400, gin.H{
// 		"error": "Bad request - Unable to delete User!",
// 	})
// }

// login a user
func (*usersController) loginUser(c *gin.Context) {
	var err error
	reqUser, foundUser := user.User{}, user.User{}

	// bind req body to user struct, find user, compare passwords
	err = c.ShouldBindJSON(&reqUser)
	if err == nil {
		err = d.Find(bson.M{"email": &reqUser.Email}).One(&foundUser)
	}
	if err == nil {
		err = reqUser.ComparePasswords(foundUser)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		// set session
		session := sessions.Default(c)
		// set password to empty so we don't expose it
		foundUser.Password = ""
		bytes, _ := bson.Marshal(&foundUser)
		session.Set("user", string(bytes))
		session.Save()

		c.JSON(200, gin.H{
			"message": "login success",
		})
	}
}

// logout a user
func (*usersController) logoutUser(c *gin.Context) {
	session := sessions.Default(c)
	session.Set("user", nil)
	session.Save()

	c.JSON(200, gin.H{
		"message": "logout success",
	})
}

// get current user
func (*usersController) getCurrentUser(c *gin.Context) {
	session := sessions.Default(c)
	currentUser := user.User{}
	currentSession := session.Get("user")
	if currentSession != nil {
		bson.Unmarshal([]byte(currentSession.(string)), &currentUser)
		c.JSON(200, currentUser)
	} else {
		c.JSON(200, gin.H{
			"message": "no user logged in",
		})
	}
}
