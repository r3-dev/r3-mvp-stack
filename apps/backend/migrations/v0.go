package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		settings, _ := dao.FindSettings()
		settings.Meta.AppName = "r3dev"
		settings.Meta.AppUrl = "http://localhost:3000"
		settings.DiscordAuth.ClientId = "ENV.DISCORD_CLIENT_ID"
		settings.DiscordAuth.ClientSecret = "ENV.DISCORD_CLIENT_SECRET"
		settings.DiscordAuth.Enabled = true
		settings.Backups.Cron = "0 0 * * *"
		settings.Backups.CronMaxKeep = 3

		return dao.SaveSettings(settings)
	}, nil)
}
