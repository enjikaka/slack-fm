convert -resize 16x16 img/logo.png img/logo.iconset/icon_16x16.png
convert -resize 32x32 img/logo.png img/logo.iconset/icon_16x16@2x.png
convert -resize 32x32 img/logo.png img/logo.iconset/icon_32x32.png
convert -resize 64x64 img/logo.png img/logo.iconset/icon_32x32@2x.png
convert -resize 128x128 img/logo.png img/logo.iconset/icon_128x128.png
convert -resize 256x256 img/logo.png img/logo.iconset/icon_128x128@2x.png
convert -resize 256x256 img/logo.png img/logo.iconset/icon_256x256.png
convert -resize 512x512 img/logo.png img/logo.iconset/icon_256x256@2x.png
convert -resize 512x512 img/logo.png img/logo.iconset/icon_512x512.png
convert -resize 1024x1024 img/logo.png img/logo.iconset/icon_512x512@2x.png
iconutil -c icns img/logo.iconset --output Icon.icns
