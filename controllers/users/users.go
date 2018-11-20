package users

import (
	"fmt"
	"pescaderoApi/models/user"
	"pescaderoApi/utils/db"

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
		Key:    []string{"email"},
		Unique: true,
	}
	d.EnsureIndex(index)

	//routes
	e.GET("/users", c.getUsers)
	e.POST("/users", c.createUser)
	e.PUT("/users", c.updateUser)
	e.DELETE("/users", c.deleteUser)

}

// FIND Users BY QUERY OR LIST ALL
func (*usersController) getUsers(c *gin.Context) {

	users := []user.User{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0]
	}

	if id, exists := filter["_id"]; exists {
		if bson.IsObjectIdHex(id) {
			if err := d.FindId(bson.ObjectIdHex(id)).All(&users); err == nil {
				c.JSON(200, users)
				return
			}
		}
	} else {
		if err := d.Find(filter).All(&users); err == nil {
			c.JSON(200, users)
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to find users",
	})

}

// CREATE ONE
func (*usersController) createUser(c *gin.Context) {
	user := user.User{}

	if err := c.ShouldBindJSON(&user); err == nil {
		if user.CheckValid(&user) == nil {
			if err := d.Insert(user.HashPassword(&user)); err == nil {
				c.JSON(200, gin.H{
					"message": fmt.Sprintf("User %s added to database!", user.FirstName),
				})
				return
			}
			c.JSON(200, gin.H{
				"error": "Email already registered!",
			})
			return
		}
		c.JSON(200, gin.H{
			"error": "Validation error!",
		})
		return
	}

	c.JSON(400, gin.H{
		"error": "Bad Request - Unable to create new User!",
	})
}

// UPDATE User BY ID QUERY
func (*usersController) updateUser(c *gin.Context) {
	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
		user := user.User{}

		if c.ShouldBindJSON(&user) == nil {
			if user.CheckValid(&user) == nil {
				if err := d.UpdateId(bson.ObjectIdHex(id), user.HashPassword(&user)); err == nil {
					c.JSON(200, gin.H{
						"message": fmt.Sprintf("User %s successfully updated!", user.FirstName),
					})
					return
				}
			}
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to update user!",
	})
}

// DELETE User BY ID QUERY
func (*usersController) deleteUser(c *gin.Context) {
	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
		if d.RemoveId(bson.ObjectIdHex(id)) == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("User with _id %s successfully deleted!", id),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to delete User!",
	})
}
