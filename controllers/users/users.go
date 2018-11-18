package users 

import(
	"fmt"
	"pescaderoApi/models/user"
	"pescaderoApi/utils/db"
	"github.com/globalsign/mgo/bson"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

type usersController struct{}

var d *mgo.Collection

// setting up user routes
func Register(e *gin.Engine){
	c := usersController{}

	// set the db collection
	d = db.DB.C("users")
	
	//routes
	e.GET("/users", c.getUsers)
	e.POST("/users",c.createUser)
	e.PUT("/users", c.updateCity)
	e.DELETE("/users", c.deleteCity)

}


// FIND Users BY QUERY OR LIST ALL
func (*usersController) getUsers(c *gin.Context){

	users := []user.User{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query(){
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
		if err := d.Insert(&user); err == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("User %s added to database!", user.First_Name),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad Request - Unable to create new User!",
	})
}

// UPDATE CITY BY ID QUERY
func (*usersController) updateCity(c *gin.Context) {
	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
		updates := user.User{}

		if c.ShouldBindJSON(&updates) == nil {
			if err := d.UpdateId(bson.ObjectIdHex(id), updates); err == nil {
				c.JSON(200, gin.H{
					"message": fmt.Sprintf("User %s successfully updated!", updates.First_Name),
				})
				return
			}
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to update user!",
	})
}

// DELETE User BY ID QUERY
func (*usersController) deleteCity(c *gin.Context) {
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





