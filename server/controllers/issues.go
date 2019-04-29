package controllers

import (
	"errors"
	"fmt"

	"github.com/edwintcloud/pescaderoApi/server/models"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"
)

// RegisterIssues registers issues routes with gin engine
func (api *API) RegisterIssues() {
	//routes
	routes := api.Server.Group("/api")
	{
		routes.GET("/issues", api.getIssues)
		routes.GET("/issues/:userID", api.getUserIssues)
		routes.POST("/issues", api.createIssue)
		routes.PUT("/issues", api.updateIssue)
		routes.DELETE("/issues", api.deleteIssue)
	}
}

// FIND issues BY QUERY OR LIST ALL
func (api *API) getIssues(c *gin.Context) {
	var err error
	result := []models.Result{}

	// make query params into a map string:interface{}
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
			err = api.DB.C("issues").Pipe([]bson.M{
				{"$match": bson.M{
					"_id": bson.ObjectIdHex(id),
				}},
				{"$lookup": bson.M{
					"from":         "users",
					"localField":   "author",
					"foreignField": "_id",
					"as":           "author",
				}},
				{"$lookup": bson.M{
					"from":         "users",
					"localField":   "resolvedBy",
					"foreignField": "_id",
					"as":           "resolvedBy",
				}},
				{"$lookup": bson.M{
					"from":         "cities",
					"localField":   "city",
					"foreignField": "_id",
					"as":           "city",
				}},
				{"$project": bson.M{
					"title":       1,
					"description": 1,
					"location":    1,
					"resolved":    1,
					"resolvedBy": bson.M{
						"$arrayElemAt": []interface{}{"$resolvedBy", 0},
					},
					"author": bson.M{
						"$arrayElemAt": []interface{}{"$author", 0},
					},
					"city": bson.M{
						"$arrayElemAt": []interface{}{"$city", 0},
					},
				}},
			}).All(&result)
		}
	} else {
		err = api.DB.C("issues").Pipe([]bson.M{
			{"$match": filter},
			{"$lookup": bson.M{
				"from":         "users",
				"localField":   "author",
				"foreignField": "_id",
				"as":           "author",
			}},
			{"$lookup": bson.M{
				"from":         "users",
				"localField":   "resolvedBy",
				"foreignField": "_id",
				"as":           "resolvedBy",
			}},
			{"$lookup": bson.M{
				"from":         "cities",
				"localField":   "city",
				"foreignField": "_id",
				"as":           "city",
			}},
			{"$project": bson.M{
				"title":       1,
				"description": 1,
				"location":    1,
				"resolved":    1,
				"resolvedBy": bson.M{
					"$arrayElemAt": []interface{}{"$resolvedBy", 0},
				},
				"author": bson.M{
					"$arrayElemAt": []interface{}{"$author", 0},
				},
				"city": bson.M{
					"$arrayElemAt": []interface{}{"$city", 0},
				},
			}},
		}).All(&result)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, result)
		return
	}
}

// CREATE ONE
func (api *API) createIssue(c *gin.Context) {
	var err error
	issue := models.Issue{}

	// bind req body to issue struct, validate, and insert into db
	err = c.ShouldBindJSON(&issue)
	if err == nil {
		err = api.DB.C("issues").Insert(&issue)
	}
	if err == nil {
		err = issue.CheckValid()
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
func (api *API) updateIssue(c *gin.Context) {
	var err error
	var id string
	result := []models.Result{}
	issue := models.Issue{}

	// bind body to issues struct and validate
	err = c.ShouldBindJSON(&issue)
	if err == nil {
		err = issue.CheckValid()
	}

	// // convert issue struct to map and delete empty fields
	// reqBody := structs.Map(&issue)
	// for k := range reqBody {
	// 	if reflect.DeepEqual(reqBody[k], reflect.Zero(reflect.TypeOf(reqBody[k])).Interface()) {
	// 		delete(reqBody, k)
	// 	}
	// }
	// fmt.Println(reqBody)

	// make sure query params id is specified and a valid objectid
	if id = c.Query("id"); id == "" {
		err = errors.New("no id param specified")
	}
	if err == nil && !bson.IsObjectIdHex(id) {
		err = errors.New("not a valid ObjectId")
	}

	// update document in db
	if err == nil {
		err = api.DB.C("issues").UpdateId(bson.ObjectIdHex(id), issue)
	}

	// find updated document
	if err == nil {
		err = api.DB.C("issues").Pipe([]bson.M{
			{"$match": bson.M{
				"_id": bson.ObjectIdHex(id),
			}},
			{"$lookup": bson.M{
				"from":         "users",
				"localField":   "author",
				"foreignField": "_id",
				"as":           "author",
			}},
			{"$lookup": bson.M{
				"from":         "users",
				"localField":   "resolvedBy",
				"foreignField": "_id",
				"as":           "resolvedBy",
			}},
			{"$lookup": bson.M{
				"from":         "cities",
				"localField":   "city",
				"foreignField": "_id",
				"as":           "city",
			}},
			{"$project": bson.M{
				"title":       1,
				"description": 1,
				"location":    1,
				"resolved":    1,
				"resolvedBy": bson.M{
					"$arrayElemAt": []interface{}{"$resolvedBy", 0},
				},
				"author": bson.M{
					"$arrayElemAt": []interface{}{"$author", 0},
				},
				"city": bson.M{
					"$arrayElemAt": []interface{}{"$city", 0},
				},
			}},
		}).All(&result)
	}

	// return results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, result[0])
	}
}

// DELETE issue BY ID QUERY
func (api *API) deleteIssue(c *gin.Context) {
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
		err = api.DB.C("issues").RemoveId(bson.ObjectIdHex(id))
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

//Get issues a creator has made by id
func (api *API) getUserIssues(c *gin.Context) {

	var err error
	var userID string
	result := []models.Issue{}

	userID = c.Query("userID")

	// make sure userID was passed and that the user id is valid.
	if userID == "" {
		err = errors.New("no userID param specified")
	}

	if err == nil && !bson.IsObjectIdHex(userID) {
		err = errors.New("not a valid userID")
	}

	// get docs
	if err == nil {
		api.DB.C("issues").Find(bson.M{"author": bson.ObjectIdHex(userID)}).All(&result)
	}

	// send back results
	if err != nil {
		c.JSON(200, gin.H{
			"error": err.Error(),
		})
	} else {
		c.JSON(200, result)
		return
	}

}
