package issues

import (
	"fmt"
	"pescaderoApi/models/issue"
	"pescaderoApi/utils/db"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type issuesController struct{}

var d *mgo.Collection

// setting up issue routes
func Register(e *gin.Engine) {
	c := issuesController{}

	// set the db collection
	d = db.DB.C("issues")

	//routes
	e.GET("/issues", c.getIssues)
	e.POST("/issues", c.createIssue)
	e.PUT("/issues", c.updateIssue)
	e.DELETE("/issues", c.deleteIssue)

}


// FIND issues BY QUERY OR LIST ALL
func (*issuesController) getIssues(c *gin.Context) {

	issues := []issue.Issue{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0]
	}

	if id, exists := filter["_id"]; exists {
		if bson.IsObjectIdHex(id) {
			if err := d.FindId(bson.ObjectIdHex(id)).All(&issues); err == nil {
				c.JSON(200, issues)
				return
			}
		}
	} else {
		if err := d.Find(filter).All(&issues); err == nil {
			c.JSON(200, issues)
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to find issues",
	})

}

// CREATE ONE
func (*issuesController) createIssue(c *gin.Context) {
	issue := issue.Issue{}

	if err := c.ShouldBindJSON(&issue); err == nil {
		if err := d.Insert(&issue); err == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("Issue %s added to database!", issue.Title),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad Request - Unable to create new User!",
	})
}

// UPDATE Issue BY ID QUERY
func (*issuesController) updateIssue(c *gin.Context) {
	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
		updates := issue.Issue{}

		if c.ShouldBindJSON(&updates) == nil {
			if err := d.UpdateId(bson.ObjectIdHex(id), updates); err == nil {
				c.JSON(200, gin.H{
					"message": fmt.Sprintf("Issue %s successfully updated!", updates.Title),
				})
				return
			}
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to update Issue!",
	})
}

// DELETE issue BY ID QUERY
func (*issuesController) deleteIssue(c *gin.Context) {
	if id := c.Query("_id"); id != "" && bson.IsObjectIdHex(id) {
		if d.RemoveId(bson.ObjectIdHex(id)) == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("Issue with _id %s successfully deleted!", id),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to delete Issue!",
	})
}
