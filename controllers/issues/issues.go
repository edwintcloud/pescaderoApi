package issues

import (
	"errors"
	"fmt"
	"pescaderoApi/models/issue"
	"pescaderoApi/utils/db"

	"github.com/fatih/structs"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type issuesController struct{}

var d *mgo.Collection

// Register registers controller routes with gin engine
func Register(e *gin.Engine) {
	c := issuesController{}

	// set the db collection
	d = db.DB.C("issues")

	//routes
	routes := e.Group("/api")
	{
		routes.GET("/issues", c.getIssues)
		routes.POST("/issues", c.createIssue)
		routes.PUT("/issues", c.updateIssue)
		routes.DELETE("/issues", c.deleteIssue)
	}
}

// FIND issues BY QUERY OR LIST ALL
func (*issuesController) getIssues(c *gin.Context) {
	var err error
	issues := []issue.Issue{}

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
			err = d.FindId(bson.ObjectIdHex(id)).All(&issues)
		}
	} else {
		err = d.Find(filter).All(&issues)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		switch len(issues) {
		case 0:
			c.JSON(200, gin.H{
				"message": "no issues found",
			})
		case 1:
			c.JSON(200, issues[0])
		default:
			c.JSON(200, issues)
		}
	}
}

// CREATE ONE
func (*issuesController) createIssue(c *gin.Context) {
	var err error
	issue := issue.Issue{}

	// bind req body to issue struct, validate, and insert into db
	err = c.ShouldBindJSON(&issue)
	if err == nil {
		err = d.Insert(&issue)
	}
	if err == nil {
		err = issue.CheckValid(&issue)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"message": fmt.Sprintf("Issue %s added to database!", issue.Title),
		})
	}
}

// UPDATE Issue BY ID QUERY
func (*issuesController) updateIssue(c *gin.Context) {
	var err error
	var id string
	issue := issue.Issue{}

	// make sure query params id is specified and a valid objectid
	if id = c.Query("id"); id == "" {
		err = errors.New("no id param specified")
	}
	if err == nil && !bson.IsObjectIdHex(id) {
		err = errors.New("not a valid ObjectId")
	}

	// bind req body to issue struct and validate
	if err == nil {
		err = c.ShouldBindJSON(&issue)
	}
	if err == nil {
		err = issue.CheckValid(&issue)
	}

	// convert struct to map and delete empty fields
	updates := structs.Map(&issue)
	for i := range updates {
		if val, ok := updates[i].(string); ok && len(val) == 0 {
			delete(updates, i)
		} else if val, ok := updates[i].(bson.ObjectId); ok && len(val) == 0 {
			delete(updates, i)
		}
	}

	// update document in db
	if err == nil {
		err = d.UpdateId(bson.ObjectIdHex(id), updates)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"message": fmt.Sprintf("Issue %s successfully updated!", issue.Title),
		})
	}
}

// DELETE issue BY ID QUERY
func (*issuesController) deleteIssue(c *gin.Context) {
	var err error
	var id string

	// make sure query params id is specified and a valid objectid
	if id = c.Query("id"); id == "" {
		err = errors.New("no id param specified")
	}
	if err == nil && !bson.IsObjectIdHex(id) {
		err = errors.New("not a valid ObjectId")
	}

	// remove document from db
	if err == nil {
		err = d.RemoveId(bson.ObjectIdHex(id))
	}

	// return result
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"message": fmt.Sprintf("Issue with _id %s successfully deleted!", id),
		})
	}
}
