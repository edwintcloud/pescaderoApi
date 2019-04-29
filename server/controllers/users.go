package controllers

import (
	"errors"
	"fmt"
	"github.com/edwintcloud/pescaderoApi/server/models"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

// RegisterUsers registers users routes with gin engine
func (api *API) RegisterUsers() {

	// ensure the email field is indexed as unique
	index := mgo.Index{
		Key:      []string{"email"},
		Unique:   true,
		DropDups: true, // delete duplicate documents in case they somehow get put in
	}
	api.DB.C("users").EnsureIndex(index)

	//routes
	routes := api.Server.Group("/api/users")
	{
		// routes.GET("", c.getUsers)
		routes.POST("", api.createUser)
		routes.PUT("", api.updateUser)
		// e.DELETE("/users", c.deleteUser)
		routes.POST("/login", api.loginUser)
		routes.POST("/logout", api.logoutUser)
		routes.GET("/current", api.getCurrentUser)
	}
}

// FIND Users BY QUERY OR LIST ALL
// func (api *API) getUsers(c *gin.Context) {
// 	var err error
// 	users := []models.User{}

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
// 			err = api.DB.C("users").FindId(bson.ObjectIdHex(id)).All(&users)
// 		}
// 	} else {
// 		err = api.DB.C("users").Find(filter).All(&users)
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
func (api *API) createUser(c *gin.Context) {
	var err error
	reqUser := models.User{}

	// bind req body to user struct, validate fields, and hash password
	err = c.ShouldBindJSON(&reqUser)
	if err == nil {
		err = reqUser.CheckValid()
	}
	if err == nil {
		reqUser.ID = bson.NewObjectId() // needed to set an object id in session
		err = api.DB.C("users").Insert(reqUser.HashPassword())
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
func (api *API) updateUser(c *gin.Context) {
	var err error
	var id string
	updates := bson.M{}
	result := models.User{}

	// make sure query params id is specified and a valid objectid
	if id = c.Query("id"); id == "" {
		err = errors.New("no id param specified")
	}
	if err == nil && !bson.IsObjectIdHex(id) {
		err = errors.New("not a valid ObjectId")
	}

	// find by id
	if err == nil {
		api.DB.C("users").FindId(bson.ObjectIdHex(id)).One(&result)
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
		err = api.DB.C("users").UpdateId(bson.ObjectIdHex(id), result)
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
func (api *API) loginUser(c *gin.Context) {
	var err error
	reqUser, foundUser := models.Login{}, models.User{}

	// bind req body to user struct, find user, compare passwords
	err = c.ShouldBindJSON(&reqUser)
	if err == nil {
		err = api.DB.C("users").Find(bson.M{"email": &reqUser.Email}).One(&foundUser)
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
func (api *API) logoutUser(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("user")
	session.Save()

	c.JSON(200, gin.H{
		"message": "logout success",
	})
}

// get current user
func (api *API) getCurrentUser(c *gin.Context) {
	session := sessions.Default(c)
	currentUser := models.User{}
	currentSession := session.Get("user")
	if currentSession != nil {
		err := api.DB.C("users").FindId(bson.ObjectIdHex(currentSession.(string))).One(&currentUser)
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
