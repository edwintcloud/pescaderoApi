package main

import (
	"github.com/edwintcloud/pescaderoApi/server/controllers"
	"testing"
	"gopkg.in/gavv/httpexpect.v1"
	"github.com/globalsign/mgo/bson"
	"net/http/httptest"
	"github.com/edwintcloud/pescaderoApi/server/tests"
)

var api *controllers.API

func TestMain(t *testing.T) {
	api = &controllers.API{}

	// initialize gin server
	Initialize(api)

	// defer db session close
	defer api.DBSession.Close()

	// defer db cleanup
	defer cleanupDB()

	server := httptest.NewServer(api.Server)
	defer server.Close()

	e := httpexpect.WithConfig(httpexpect.Config{
		BaseURL:  server.URL,
		Reporter: httpexpect.NewAssertReporter(t),
		Printers: []httpexpect.Printer{
			httpexpect.NewDebugPrinter(t, true),
		},
	})

	// register tests here
	tests.TestUsers(e)
}

func cleanupDB() {	
	api.DB.C("users").RemoveAll(bson.M{"email": tests.TestUser.Email})
}