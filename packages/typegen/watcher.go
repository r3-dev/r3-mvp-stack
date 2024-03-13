package typegen

// fsnotify watches for changes in migration files
// on changes, it triggers pocketbase-typegen npm package to regenerate types for the client

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/fsnotify/fsnotify"
)

func WatchMigrationFolder() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		fmt.Println("Error creating watcher:", err)
		return
	}
	defer watcher.Close()

	err = watcher.Add("migrations")
	if err != nil {
		fmt.Println("Error adding directory to watcher:", err)
		return
	}

	fmt.Println("Watching for changes in the 'migration' folder...")

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			var shouldGenerate = event.Op == fsnotify.Create || event.Op == fsnotify.Write || event.Op == fsnotify.Remove || event.Op == fsnotify.Rename

			if shouldGenerate {
				fmt.Println("Migration created:", event.Name)
				// Trigger typegen to regenerate types for the client
				cmd := exec.Command("pnpm", "typegen")
				cmd.Stdout = os.Stdout // Redirect stdout to os.Stdout
				err := cmd.Run()
				if err != nil {
					log.Fatalf("cmd.Run() failed with %s\n", err)
				}
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			fmt.Println("Error:", err)
		}
	}
}

func Start() {
	fmt.Println("Starting migration watcher...")
	go WatchMigrationFolder()
}
