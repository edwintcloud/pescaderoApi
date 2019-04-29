package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
)

// API is our api model
type API struct {
	Server *gin.Engine
	DB     *mgo.Database
}

// RegisterRoutes register api routes with gin server
func (api *API) RegisterRoutes() {
	api.RegisterCities()
	api.RegisterIssues()
	api.RegisterUsers()
}
