@echo off
echo === FIXING NEXTJS ERRORS ===

mkdir .next\server\vendor-chunks
mkdir .next\server\pages\vendor-chunks
mkdir .next\server\chunks
mkdir .next\static\chunks\app\products\[id]
mkdir .next\static\chunks\app\products\%%5Bid%%5D
mkdir .next\server\app\products\[id]

echo module.exports = require("next"); > .next\server\vendor-chunks\next.js
echo module.exports = require("react"); > .next\server\vendor-chunks\react.js
echo module.exports = require("react-dom"); > .next\server\vendor-chunks\react-dom.js
echo module.exports = require("@swc/helpers"); > .next\server\vendor-chunks\@swc.js
echo module.exports = require("styled-jsx"); > .next\server\vendor-chunks\styled-jsx.js
echo module.exports = require("client-only"); > .next\server\vendor-chunks\client-only.js
echo module.exports = {}; > .next\server\vendor-chunks\next-client-pages-loader.js

echo module.exports = require("next"); > .next\server\pages\vendor-chunks\next.js
echo module.exports = require("react"); > .next\server\pages\vendor-chunks\react.js
echo module.exports = require("react-dom"); > .next\server\pages\vendor-chunks\react-dom.js
echo module.exports = require("@swc/helpers"); > .next\server\pages\vendor-chunks\@swc.js
echo module.exports = require("styled-jsx"); > .next\server\pages\vendor-chunks\styled-jsx.js
echo module.exports = require("client-only"); > .next\server\pages\vendor-chunks\client-only.js
echo module.exports = {}; > .next\server\pages\vendor-chunks\next-client-pages-loader.js

echo module.exports = require("next"); > .next\server\chunks\next.js
echo module.exports = require("react"); > .next\server\chunks\react.js
echo module.exports = require("react-dom"); > .next\server\chunks\react-dom.js
echo module.exports = require("@swc/helpers"); > .next\server\chunks\@swc.js
echo module.exports = require("styled-jsx"); > .next\server\chunks\styled-jsx.js
echo module.exports = require("client-only"); > .next\server\chunks\client-only.js
echo module.exports = {}; > .next\server\chunks\next-client-pages-loader.js

echo // Product placeholder > .next\static\chunks\app\products\[id]\page.js
echo // Loading placeholder > .next\static\chunks\app\products\[id]\loading.js
echo // Not found placeholder > .next\static\chunks\app\products\[id]\not-found.js

echo // URL encoded placeholder > .next\static\chunks\app\products\%%5Bid%%5D\page.js
echo // URL encoded placeholder > .next\static\chunks\app\products\%%5Bid%%5D\loading.js
echo // URL encoded placeholder > .next\static\chunks\app\products\%%5Bid%%5D\not-found.js

echo module.exports = function(){ return { props: {} } } > .next\server\app\products\[id]\page.js
echo module.exports = function(){ return null } > .next\server\app\products\[id]\loading.js
echo module.exports = function(){ return { notFound: true } } > .next\server\app\products\[id]\not-found.js

echo {"/"^: "app/page.js", "/products/[id]"^: "app/products/[id]/page.js"} > .next\server\app-paths-manifest.json

echo === COMPLETED ===
echo.
echo Press any key to exit...
pause > nul 