package controllers

import (
	"fmt"

	"github.com/edwintcloud/pescaderoApi/server/models"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"
)

// RegisterCities registers cities routes with gin engine
func (api *API) RegisterCities() {
	// routes
	routes := api.Server.Group("/api")
	{
		routes.GET("/cities", api.getCities)
		routes.POST("/cities", api.createCity)
		routes.PUT("/cities", api.updateCity)
		routes.DELETE("/cities", api.deleteCity)
	}
}

// FIND CITIES BY QUERY OR LIST ALL
func (api *API) getCities(c *gin.Context) {

	cities := []models.City{}
	filter := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		filter[k] = v[0] // fixes query value being a slice of strings
	}

	if id, exists := filter["id"]; exists {
		if bson.IsObjectIdHex(id) {
			if err := api.DB.C("cities").FindId(bson.ObjectIdHex(id)).All(&cities); err == nil {
				c.JSON(200, cities)
				return
			}
		}
	} else {
		if err := api.DB.C("cities").Find(filter).All(&cities); err == nil {
			c.JSON(200, cities)
			return
		}
	}

	c.JSON(400, gin.H{
		"error": "Bad request - Unable to find cities!",
	})
}

// CREATE ONE
func (api *API) createCity(c *gin.Context) {
	city := models.City{}

	if err := c.ShouldBindJSON(&city); err == nil {
		if err := api.DB.C("cities").Insert(&city); err == nil {
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
func (api *API) updateCity(c *gin.Context) {
	if id := c.Query("id"); id != "" && bson.IsObjectIdHex(id) {
		// updates := city.City{}
		updates := models.City{}

		if c.ShouldBindJSON(&updates) == nil {
			if err := api.DB.C("cities").UpdateId(bson.ObjectIdHex(id), updates); err == nil {
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
func (api *API) deleteCity(c *gin.Context) {
	if id := c.Query("id"); id != "" && bson.IsObjectIdHex(id) {
		if api.DB.C("cities").RemoveId(bson.ObjectIdHex(id)) == nil {
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
