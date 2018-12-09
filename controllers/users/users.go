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
	routes := e.Group("/api/users")
	{
		// routes.GET("", c.getUsers)
		routes.POST("", c.createUser)
		routes.PUT("", c.updateUser)
		// e.DELETE("/users", c.deleteUser)
		routes.POST("/login", c.loginUser)
		routes.POST("/logout", c.logoutUser)
		routes.GET("/current", c.getCurrentUser)
	}
}

// FIND Users BY QUERY OR LIST ALL
// func (*usersController) getUsers(c *gin.Context) {
// 	var err error
// 	users := []user.User{}

// 	// make query params into a map string:string
// 	filter := make(map[string]string)
// 	for k, v := range c.Request.URL.Query() {
// 		filter[k] = v[0]
// 	}

// 	// find by id if id is a query param, otherwise find all that match query params
// 	if id, exists := filter["id"]; exists {
// 		if !bson.IsObjectIdHex(id) {
// 			err = errors.New("not a valid ObjectId")
// 		}
// 		if err == nil {
// 			err = d.FindId(bson.ObjectIdHex(id)).All(&users)
// 		}
// 	} else {
// 		err = d.Find(filter).All(&users)
// 	}

// 	// return results
// 	if err != nil {
// 		c.JSON(200, gin.H{
// 			"error": err.Error(),
// 		})
// 	} else {
// 		c.JSON(200, users)
// 	}
// }

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
		reqUser.ID = bson.NewObjectId() // needed to set an object id in session
		err = d.Insert(reqUser.HashPassword())
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		// log user in
		session := sessions.Default(c)
		// set password to empty so we don't expose it
		reqUser.Password = ""
		bytes, _ := bson.Marshal(&reqUser)
		fmt.Println(reqUser)
		session.Set("user", string(bytes))
		session.Save()

		c.JSON(200, gin.H{
			"message": fmt.Sprintf("user %s added to database", reqUser.FirstName),
		})
	}
}

// update user avatar
func (*usersController) updateUser(c *gin.Context) {
	var err error
	var id string
	updates := bson.M{}
	result := user.User{}

	// make sure query params id is specified and a valid objectid
	if id = c.Query("id"); id == "" {
		err = errors.New("no id param specified")
	}
	if err == nil && !bson.IsObjectIdHex(id) {
		err = errors.New("not a valid ObjectId")
	}

	// find by id
	if err == nil {
		d.FindId(bson.ObjectIdHex(id)).One(&result)
	}

	// bind req body to bson m
	if err == nil {
		err = c.ShouldBindJSON(&updates)
	}

	// make changes to result based on req body
	if val, ok := updates["avatar"]; ok {
		result.Avatar = val.(string)
	} else {
		err = errors.New("avatar field missing")
	}

	// update document in db
	if err == nil {
		err = d.UpdateId(bson.ObjectIdHex(id), result)
	}

	// return result
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"message": "user updated",
		})
	}
}

// login a user
func (*usersController) loginUser(c *gin.Context) {
	var err error
	reqUser, foundUser := user.Login{}, user.User{}

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
		session.Set("user", foundUser.ID.Hex())
		session.Save()

		c.JSON(200, gin.H{
			"message": "login success",
		})
	}
}

// logout a user
func (*usersController) logoutUser(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("user")
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
		err := d.FindId(bson.ObjectIdHex(currentSession.(string))).One(&currentUser)
		currentUser.Password = ""
		if err == nil {
			c.JSON(200, currentUser)
		} else {
			c.JSON(200, gin.H{
				"message": "an error occurred",
			})
		}

	} else {
		c.JSON(200, gin.H{
			"message": "no user logged in",
		})
	}
}
