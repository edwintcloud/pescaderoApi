package cities

import (
	"fmt"
	// "pescaderoApi/models/city"
	"pescaderoApi/models"
	"pescaderoApi/utils/db"

	"github.com/globalsign/mgo/bson"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

type citiesController struct{}

var d *mgo.Collection

// Register registers controller routes with gin engine
func Register(e *gin.Engine) {
	c := citiesController{}

	// set db collection
	d = db.DB.C("cities")

	// routes
	routes := e.Group("/api")
	{
		routes.GET("/cities", c.getCities)
		routes.POST("/cities", c.createCity)
		routes.PUT("/cities", c.updateCity)
		routes.DELETE("/cities", c.deleteCity)
	}
}

// FIND CITIES BY QUERY OR LIST ALL
func (*citiesController) getCities(c *gin.Context) {

	// cities := []city.City{}
	cities := []models.City{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0] // fixes query value being a slice of strings
	}

	if id, exists := filter["id"]; exists {
		if bson.IsObjectIdHex(id) {
			if err := d.FindId(bson.ObjectIdHex(id)).All(&cities); err == nil {
				c.JSON(200, cities)
				return
			}
		}
	} else {
		if err := d.Find(filter).All(&cities); err == nil {
			c.JSON(200, cities)
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to find cities!",
	})
}

// CREATE ONE
func (*citiesController) createCity(c *gin.Context) {
	// city := city.City{}
	city := models.City{}

	if err := c.ShouldBindJSON(&city); err == nil {
		if err := d.Insert(&city); err == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("City %s added to database!", city.Name),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad Request - Unable to create new city!",
	})
}

// UPDATE CITY BY ID QUERY
func (*citiesController) updateCity(c *gin.Context) {
	if id := c.Query("id"); id != "" && bson.IsObjectIdHex(id) {
		// updates := city.City{}
		updates := models.City{}

		if c.ShouldBindJSON(&updates) == nil {
			if err := d.UpdateId(bson.ObjectIdHex(id), updates); err == nil {
				c.JSON(200, gin.H{
					"message": fmt.Sprintf("City %s successfully updated!", updates.Name),
				})
				return
			}
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to update city!",
	})
}

// DELETE CITY BY ID QUERY
func (*citiesController) deleteCity(c *gin.Context) {
	if id := c.Query("id"); id != "" && bson.IsObjectIdHex(id) {
		if d.RemoveId(bson.ObjectIdHex(id)) == nil {
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("City with _id %s successfully deleted!", id),
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to delete city!",
	})
}
