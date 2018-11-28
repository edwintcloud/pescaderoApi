package main

import (
	"fmt"
	"log"
	"os"
	"pescaderoApi/controllers/cities"
	"pescaderoApi/controllers/issues"
	"pescaderoApi/controllers/users"
	"time"

	"pescaderoApi/utils/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load env variables
	if _, ok := os.LookupEnv("MONGODB_URI"); !ok {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// Set gin mode
	gin.SetMode(gin.DebugMode)

	// connect to mongodb
	db := db.Connect(os.Getenv("MONGODB_URI"))
	defer db.Close()

	// create new instance of gin with default middlewares
	e := gin.Default()

	// setup CORS
	e.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://project-pescadero.now.sh", "http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve frontend static files
	// e.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// setup sessions
	store := cookie.NewStore([]byte(os.Getenv("COOKIE_SECRET")))
	store.Options(sessions.Options{
		HttpOnly: true,
	})
	e.Use(sessions.Sessions("session", store))

	// register controller routes
	cities.Register(e)
	users.Register(e)
	issues.Register(e)

	// catch all requests to non-existing endpoints
	e.NoRoute(func(c *gin.Context) {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Bad Request - %s %s is not a valid endpoint!", c.Request.Method, c.Request.RequestURI),
		})
	})

	// start the server
	e.Run(":" + os.Getenv("PORT"))

}
