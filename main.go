package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "PokeData",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup:       app.startup,
		Frameless:       true,
		CSSDragProperty: "widows",
		CSSDragValue:    "1",
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			DisableFramelessWindowDecorations: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
