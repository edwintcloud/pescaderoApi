package main

import (
	"fmt"
	"log"
	"os"
	"time"
	"strings"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/edwintcloud/pescaderoApi/server/controllers"
)

func main() {

	// Set gin mode
	gin.SetMode(gin.DebugMode)

	// connect to mongodb
	dbSession, db := ConnectDB()
	defer dbSession.Close()

	// create new instance of gin with default middlewares
	e := gin.Default()

	// setup CORS
	e.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://project-pescadero.now.sh", "http://localhost:3000", "https://staging-project-pescadero.now.sh"},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// setup sessions
	store := cookie.NewStore([]byte(os.Getenv("COOKIE_SECRET")))
	store.Options(sessions.Options{
		HttpOnly: true,
		Path:     "/",
	})
	e.Use(sessions.Sessions("session", store))

	// register api with gin server
	api := controllers.API{
		Server: e,
		DB: db,
	}
	api.RegisterRoutes()
	// register controller routes
	// cities.Register(e)
	// users.Register(e)
	// issues.Register(e)

	// catch all requests to non-existing endpoints
	e.NoRoute(func(c *gin.Context) {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Bad Request - %s %s is not a valid endpoint!", c.Request.Method, c.Request.RequestURI),
		})
	})

	// start the server
	e.Run(":" + os.Getenv("PORT"))

}

// ConnectDB connects to mongodb
func ConnectDB() (*mgo.Session, *mgo.Database) {
	session, err := mgo.Dial(os.Getenv("MONGODB_URI"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %s\n", err.Error())
	}
	database := strings.Split(os.Getenv("MONGODB_URI"), "/")
	db := session.DB(database[len(database)-1])
	return session, db
}