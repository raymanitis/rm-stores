fx_version "cerulean"
lua54 "yes"
game "gta5"

author "Thomas"

files {
    "modules/*.lua",
	"web/build/index.html",
	"web/build/**/*",
}

shared_scripts {
    "@ox_lib/init.lua",
    "config/config.lua",
    "config/locations.lua",
    "config/shop_items.lua",
}

client_scripts {
    "bridge/client/*.lua",
    "modules/target.lua",
    "modules/inventory.lua",
    "client/client.lua",
}

server_scripts {
    "bridge/server/*.lua",
    "modules/inventory.lua",
    "server/server.lua",
}

ui_page "web/build/index.html"

dependencies {
    'ox_lib',
}
