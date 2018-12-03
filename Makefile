icns: img/logo.png
	./scripts/resize-for-icns.sh
	./scripts/optimize-iconset.sh
	./scripts/create-icns.sh
tray: img/logo.png
	./scripts/resize-for-tray.sh
	./scripts/optimize-tray-icons.sh
build:
	yarn run build:osx
	zip -r -X SlackFM-darwin-x64.zip SlackFM-darwin-x64
	yarn run build:windows
	zip -r -X SlackFM-win32-x64.zip SlackFM-win32-x64
	yarn run build:linux
	zip -r -X SlackFM-linux-x64.zip SlackFM-linux-x64
