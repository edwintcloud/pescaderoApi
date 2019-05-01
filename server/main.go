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

	// create new instance of our api
	api := controllers.API{}

	// initialize server
	Initialize(&api)	

	// defer db close
	defer api.DBSession.Close()

	// start the server
	api.Server.Run(":" + os.Getenv("PORT"))

}

// Initialize initializes server
func Initialize(api *controllers.API) {
	// Set gin mode
	gin.SetMode(gin.DebugMode)

	// connect to mongodb
	ConnectDB(api)

	// create new instance of gin with default middlewares
	api.Server = gin.Default()

	// setup CORS
	api.Server.Use(cors.New(cors.Config{
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
	api.Server.Use(sessions.Sessions("session", store))

	// register routes with server
	api.RegisterRoutes()

	// catch all requests to non-existing endpoints
	api.Server.NoRoute(func(c *gin.Context) {
		c.JSON(400, gin.H{
			"error": fmt.Sprintf("Bad Request - %s %s is not a valid endpoint!", c.Request.Method, c.Request.RequestURI),
		})
	})
}

// ConnectDB connects to mongodb
func ConnectDB(api *controllers.API) {
	session, err := mgo.Dial(os.Getenv("MONGODB_URI"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %s\n", err.Error())
	}
	database := strings.Split(os.Getenv("MONGODB_URI"), "/")
	api.DB = session.DB(database[len(database)-1])
	api.DBSession = session
}