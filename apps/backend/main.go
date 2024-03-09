package main

import (
	"log"
	"os"
	"strings"

	_ "pb-stack/migrations"
	"pb-stack/typegen"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	// loosely check if it was executed using "go run" or from binary
	isDev := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		Automigrate: isDev,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// Server public folder
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./public"), true))

		dao := app.Dao()

		settings, err := dao.FindSettings()
		if err != nil {
			return err
		}

		// Hide the Admin UI controls when running in production
		settings.Meta.HideControls = !isDev

		return dao.SaveSettings(settings)
	})

	typegen.Start()

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
