package main

import (
	"fmt"
	"log"
	"os"
	"pescaderoApi/controllers/cities"
	"pescaderoApi/utils/db"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load env variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Set gin mode
	gin.SetMode(gin.DebugMode)

	// connect to mongodb
	db := db.Connect(os.Getenv("DB_URI"), os.Getenv("DB_NAME"))
	defer db.Close()

	// create new instance of gin with default middlewares
	e := gin.Default()

	// Serve frontend static files
	e.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// register controller routes
	cities.Register(e)

	// catch all requests to non-existing endpoints
	e.NoRoute(func(c *gin.Context) {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Bad Request - %s %s is not a valid endpoint!", c.Request.Method, c.Request.RequestURI),
		})
	})

	// start the server
	e.Run(":5000")

}
