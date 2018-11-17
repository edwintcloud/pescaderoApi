package cities

import (
	"fmt"
	"pescaderoApi/models/city"
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
	e.GET("/cities", c.getCities)
	e.POST("/cities", c.createCity)
	e.PUT("/cities", c.updateCities)
	e.DELETE("/cities", c.deleteCities)
}

// FIND CITIES BY QUERY OR LIST ALL
func (*citiesController) getCities(c *gin.Context) {
	cities := []city.City{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0] // fixes query value being a slice of strings
	}
	fmt.Printf("%s\n", filter)
	if id, exists := filter["_id"]; exists {
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
		"error": "Bad request - Unable to find cities",
	})
}

// CREATE ONE
func (*citiesController) createCity(c *gin.Context) {
	city := city.City{}

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

// UPDATE CITIES THAT MATCH QUERY
func (*citiesController) updateCities(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Not implemented",
	})
}

// DELETE CITIES THAT MATCH QUERY
func (*citiesController) deleteCities(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Not implemented",
	})
}
