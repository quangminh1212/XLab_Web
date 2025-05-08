const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Đường dẫn đến các tệp và thư mục cần xử lý
const traceFile = path.join(__dirname, '.next', 'trace');
const nextDir = path.join(__dirname, '.next');
const cacheDirs = [
  path.join(__dirname, '.next', 'cache'),
  path.join(__dirname, '.next', 'cache', 'webpack'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development'),
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, '.next', 'server', 'pages'),
  path.join(__dirname, '.next', 'server', 'vendor-chunks'),
  path.join(__dirname, '.next', 'static'),
  path.join(__dirname, '.next', 'static', 'chunks'),
  path.join(__dirname, '.next', 'static', 'css'),
  path.join(__dirname, '.next', 'static', 'media'),
  path.join(__dirname, '.next', 'static', 'webpack'),
  path.join(__dirname, '.next', 'static', 'development'),
  path.join(__dirname, '.next', 'types'),
  path.join(__dirname, 'node_modules', '.cache')
];

// Danh sách các file cần tạo để tránh lỗi
const filesToCreate = [
  { 
    path: path.join(__dirname, '.next', 'server', 'next-font-manifest.json'),
    content: '{"pages":{},"app":{}}'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'app-paths-manifest.json'),
    content: '{"/_not-found":{"resolvedPagePath":"next/dist/client/components/not-found-error"},"/":{"/":"app/page.js"}}'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'webpack-runtime.js'),
    content: `
    /******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    /******/ 	var __webpack_modules__ = ({});
    /******/ 	
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 		
    /******/ 		// Execute the module function
    /******/ 		var threw = true;
    /******/ 		try {
    /******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 			threw = false;
    /******/ 		} finally {
    /******/ 			if(threw) delete __webpack_module_cache__[moduleId];
    /******/ 		}
    /******/ 		
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /******/ 	__webpack_require__.X = (result, moduleKeys) => {};
    /******/ 	// Module API
    /******/ 	__webpack_require__.f = {};
    /******/ 	__webpack_require__.e = (chunkId) => Promise.resolve(chunkId);
    /******/ 	
    /******/ 	/* webpack/runtime/compat get default export */
    /******/ 	(() => {
    /******/ 		// getDefaultExport function for compatibility with non-harmony modules
    /******/ 		__webpack_require__.n = (module) => {
    /******/ 			var getter = module && module.__esModule ?
    /******/ 				() => (module['default']) :
    /******/ 				() => (module);
    /******/ 			__webpack_require__.d(getter, { a: getter });
    /******/ 			return getter;
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/define property getters */
    /******/ 	(() => {
    /******/ 		// define getter functions for harmony exports
    /******/ 		__webpack_require__.d = (exports, definition) => {
    /******/ 			for(var key in definition) {
    /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
    /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    /******/ 				}
    /******/ 			}
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/ensure chunk */
    /******/ 	(() => {
    /******/ 		__webpack_require__.f.ensure = (chunkId, promises) => {
    /******/   		return Promise.all(promises);
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/get javascript chunk filename */
    /******/ 	(() => {
    /******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
    /******/ 		__webpack_require__.u = (chunkId) => {
    /******/ 			return "" + chunkId + ".js";
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
    /******/ 	(() => {
    /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/make namespace object */
    /******/ 	(() => {
    /******/ 		// define __esModule on exports
    /******/ 		__webpack_require__.r = (exports) => {
    /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 			}
    /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/trusted types policy */
    /******/ 	(() => {
    /******/ 		__webpack_require__.tt = () => { return {} }
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/trusted types script url */
    /******/ 	(() => {
    /******/ 		__webpack_require__.tu = (url) => { return url };
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/publicPath */
    /******/ 	(() => {
    /******/ 		__webpack_require__.p = "/_next/";
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/importScripts chunk loading */
    /******/ 	(() => {
    /******/ 		// no baseURI
    /******/ 		
    /******/ 		// object to store loaded chunks
    /******/ 		// "1" means "already loaded"
    /******/ 		var installedChunks = {
    /******/ 			"webpack-runtime": 1
    /******/ 		};
    /******/ 		
    /******/ 		// no chunk install function needed
    /******/ 		
    /******/ 		// no chunk loading
    /******/ 		
    /******/ 		// no external install chunk
    /******/ 		
    /******/ 		// no HMR
    /******/ 		
    /******/ 		// no HMR manifest
    /******/ 	})();
    /******/ 	
    /******/ 	/* webpack/runtime/startup chunk dependencies */
    /******/ 	(() => {
    /******/ 		var next = __webpack_require__.x;
    /******/ 		__webpack_require__.x = () => {
    /******/ 			return Promise.resolve();
    /******/ 		};
    /******/ 	})();
    /******/ })();
    `
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'pages', 'webpack-runtime.js'),
    content: `
    /******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    /******/ 	var __webpack_modules__ = ({});
    /******/ 	
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 		
    /******/ 		// Execute the module function
    /******/ 		var threw = true;
    /******/ 		try {
    /******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 			threw = false;
    /******/ 		} finally {
    /******/ 			if(threw) delete __webpack_module_cache__[moduleId];
    /******/ 		}
    /******/ 		
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    `
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    content: '{"middleware":{},"functions":{},"version":2}'
  },
  { 
    path: path.join(__dirname, '.next', 'build-manifest.json'),
    content: '{}'
  },
  { 
    path: path.join(__dirname, '.next', 'react-loadable-manifest.json'),
    content: '{}'
  },
  {
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next.js'),
    content: 'module.exports = require("next");'
  },
  {
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react.js'),
    content: `
      module.exports = {
        __esModule: true,
        default: require("react"),
        useCallback: require("react").useCallback,
        useContext: require("react").useContext,
        useDebugValue: require("react").useDebugValue,
        useDeferredValue: require("react").useDeferredValue,
        useEffect: require("react").useEffect,
        useId: require("react").useId,
        useImperativeHandle: require("react").useImperativeHandle,
        useLayoutEffect: require("react").useLayoutEffect,
        useMemo: require("react").useMemo,
        useReducer: require("react").useReducer,
        useRef: require("react").useRef,
        useState: require("react").useState,
        use: require("react").use,
        Fragment: require("react").Fragment,
        Suspense: require("react").Suspense,
        createElement: require("react").createElement,
        createContext: require("react").createContext
      };
    `
  },
  {
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react-dom.js'),
    content: 'module.exports = require("react-dom");'
  }
];

// Thêm các tệp tĩnh mới cần thiết
const staticFilesToCreate = [
  {
    path: path.join(__dirname, '.next', 'static', 'chunks', 'app-pages-internals.js'),
    content: '// Placeholder for app-pages-internals.js'
  },
  {
    path: path.join(__dirname, '.next', 'static', 'chunks', 'app', 'not-found.js'),
    content: '// Placeholder for not-found.js'
  },
  {
    path: path.join(__dirname, '.next', 'static', 'chunks', 'app', 'page.js'),
    content: '// Placeholder for page.js'
  },
  {
    path: path.join(__dirname, '.next', 'static', 'chunks', 'app', 'loading.js'),
    content: '// Placeholder for loading.js'
  }
];

// Hàm an toàn để kiểm tra xem một file có tồn tại không
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Hàm an toàn để xóa một file
function safeDeleteFile(filePath) {
  try {
    if (fileExists(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Đã xóa file: ${filePath}`);
    }
  } catch (err) {
    console.log(`Không thể xóa file ${filePath}: ${err.message}`);
  }
}

// Hàm an toàn để tạo một thư mục
function safeCreateDir(dirPath) {
  try {
    if (!fileExists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Đã tạo thư mục cache: ${dirPath}`);
    }
  } catch (err) {
    console.log(`Không thể tạo thư mục ${dirPath}: ${err.message}`);
  }
}

// Hàm để xóa thư mục .next
function deleteNextFolder() {
  try {
    console.log('Đang xóa thư mục .next...');
    
    // Hàm xóa thư mục đệ quy
    const deleteFolderRecursive = function(directoryPath) {
      if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
          const currentPath = path.join(directoryPath, file);
          
          try {
            if (fs.lstatSync(currentPath).isDirectory()) {
              // Đệ quy nếu là thư mục
              deleteFolderRecursive(currentPath);
            } else {
              // Xóa file
              try {
                fs.unlinkSync(currentPath);
              } catch (err) {
                // Bỏ qua lỗi nếu không thể xóa file
                console.log(`Không thể xóa file: ${currentPath}`);
              }
            }
          } catch (err) {
            console.log(`Lỗi khi truy cập: ${currentPath}`);
          }
        });
        
        try {
          fs.rmdirSync(directoryPath);
        } catch (err) {
          // Bỏ qua lỗi nếu không thể xóa thư mục
          console.log(`Không thể xóa thư mục: ${directoryPath}`);
        }
      }
    };
    
    // Bỏ qua một số thư mục cụ thể
    const skipPaths = [
      '.next/trace',
      '.next/cache/webpack'
    ];
    
    // Xóa nội dung thư mục .next trừ những thư mục cần bỏ qua
    if (fs.existsSync(nextDir)) {
      fs.readdirSync(nextDir).forEach((file) => {
        const fullPath = path.join(nextDir, file);
        
        // Bỏ qua những thư mục đặc biệt
        if (!skipPaths.some(skipPath => fullPath.includes(skipPath))) {
          try {
            if (fs.lstatSync(fullPath).isDirectory()) {
              deleteFolderRecursive(fullPath);
            } else {
              fs.unlinkSync(fullPath);
            }
          } catch (err) {
            console.log(`Lỗi khi xóa ${fullPath}: ${err.message}`);
          }
        }
      });
      
      console.log('Đã xóa thư mục .next thành công.');
    } else {
      console.log('Thư mục .next không tồn tại.');
    }
  } catch (error) {
    console.log(`Lỗi khi xóa thư mục .next: ${error.message}`);
  }
}

// Tạo file gzip
function createGzipFile(filePath) {
  try {
    const fileContent = Buffer.alloc(1024); // 1KB of zeros
    fs.writeFileSync(filePath, fileContent);
    console.log(`Đã tạo file placeholder: ${filePath}`);
    
    const gzipPath = `${filePath}.gz`;
    const gzipped = zlib.gzipSync(fileContent);
    fs.writeFileSync(gzipPath, gzipped);
    console.log(`Đã tạo file gzip: ${gzipPath}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file gzip ${filePath}: ${err.message}`);
  }
}

// Xử lý file trace
function cleanTrace() {
  try {
    if (fileExists(traceFile)) {
      fs.unlinkSync(traceFile);
      console.log("Đã xóa file trace.");
    } else {
      console.log("File trace không tồn tại, bỏ qua.");
    }
  } catch (err) {
    if (err.code === 'EPERM') {
      console.log(`[Error: ${err.message}] {
  errno: ${err.errno},
  code: '${err.code}',
  syscall: '${err.syscall}',
  path: '${err.path}'
}`);
    } else if (err.code !== 'ENOENT') {
      console.error(`Lỗi khi xóa file trace: ${err.message}`);
    }
  }
}

// Tạo các file cần thiết
function createRequiredFiles() {
  // Tạo các thư mục cache
  cacheDirs.forEach(dir => {
    safeCreateDir(dir);
  });

  // Đảm bảo các thư mục App được tạo
  safeCreateDir(path.join(__dirname, '.next', 'static', 'chunks', 'app'));
  safeCreateDir(path.join(__dirname, '.next', 'static', 'chunks', 'app', '_not-found'));
  safeCreateDir(path.join(__dirname, '.next', 'server', 'app'));
  safeCreateDir(path.join(__dirname, '.next', 'server', 'app', '_not-found'));
  safeCreateDir(path.join(__dirname, '.next', 'static', 'css', 'app'));

  // Tạo các file Next.js cần thiết
  filesToCreate.forEach(file => {
    try {
      const dir = path.dirname(file.path);
      if (!fileExists(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(file.path, file.content);
      console.log(`Đã tạo file: ${file.path}`);
    } catch (err) {
      console.error(`Lỗi khi tạo file ${file.path}: ${err.message}`);
    }
  });

  // Tạo thêm các tệp tĩnh mới
  staticFilesToCreate.forEach(file => {
    try {
      const dir = path.dirname(file.path);
      if (!fileExists(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(file.path, file.content);
      console.log(`Đã tạo file tĩnh: ${file.path}`);
    } catch (err) {
      console.error(`Lỗi khi tạo file tĩnh ${file.path}: ${err.message}`);
    }
  });
}

// Tạo các file static placeholder
function createStaticPlaceholders() {
  try {
    // Tạo thư mục static
    const staticDirs = [
      path.join(__dirname, '.next', 'static', 'chunks', 'app'),
      path.join(__dirname, '.next', 'static', 'chunks', 'app', '_not-found'),
      path.join(__dirname, '.next', 'static', 'chunks', 'pages'),
      path.join(__dirname, '.next', 'static', 'chunks', 'webpack'),
      path.join(__dirname, '.next', 'static', 'css'),
      path.join(__dirname, '.next', 'static', 'css', 'app'),
      path.join(__dirname, '.next', 'static', 'media'),
      path.join(__dirname, '.next', 'static', 'webpack') // Thêm thư mục webpack cho hot update
    ];

    staticDirs.forEach(dir => {
      safeCreateDir(dir);
      console.log(`Đã tạo thư mục static: ${dir}`);
      
      // Đảm bảo thư mục có quyền ghi
      try {
        fs.chmodSync(dir, 0o777);
      } catch (chmodErr) {
        console.log(`Không thể cập nhật quyền cho thư mục ${dir}: ${chmodErr.message}`);
      }
    });

    // Tạo file hot update cho webpack với các ID động
    const generateHexId = () => {
      return Math.random().toString(16).slice(2, 18);
    };

    // Tạo 5 file hot update với ID ngẫu nhiên
    for (let i = 0; i < 5; i++) {
      const id = generateHexId();
      const hotUpdateFile = path.join(__dirname, '.next', 'static', 'webpack', `${id}.webpack.hot-update.json`);
      fs.writeFileSync(hotUpdateFile, '{"h":"","c":{},"r":[]}');
      console.log(`Đã tạo file webpack hot update: ${hotUpdateFile}`);
    }

    // Tạo thư mục CSS/app xong rồi mới tạo file trong đó
    const cssAppDir = path.join(__dirname, '.next', 'static', 'css', 'app');
    safeCreateDir(cssAppDir);
    console.log(`Đã tạo thư mục CSS: ${cssAppDir}`);

    // Tạo file placeholder cho CSS với nội dung tailwind cơ bản
    const cssPlaceholderPath = path.join(cssAppDir, 'layout.css');
    const tailwindCSS = `
/*
! tailwindcss v3.3.5 | MIT License | https://tailwindcss.com
*/
*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}
.container{width:100%}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}
@media (min-width:1536px){.container{max-width:1536px}}
`;
    fs.writeFileSync(cssPlaceholderPath, tailwindCSS);
    console.log(`Đã tạo file static CSS: ${cssPlaceholderPath}`);

    // Tạo một file layout-manifest.json để Next.js biết có file CSS
    const cssManifestPath = path.join(__dirname, '.next', 'build-manifest.json');
    const cssManifest = {
      "polyfillFiles": [],
      "devFiles": ["static/development/dll/dll_5de4531dc031fc53f873.js", "static/development/dll/dll_5de4531dc031fc53f873.js.map"],
      "ampDevFiles": [],
      "lowPriorityFiles": ["static/development/_buildManifest.js", "static/development/_ssgManifest.js"],
      "rootMainFiles": ["static/chunks/webpack-1c8e1cb7c773f8a5.js", "static/chunks/fd9d1056-eff92f9fd528dc77.js", "static/chunks/472-bd0c769973fd9bb3.js", "static/chunks/main-app-e5eebe8e1efb9fc8.js"],
      "pages": {
        "/_app": ["static/chunks/webpack-1c8e1cb7c773f8a5.js", "static/chunks/framework-aec8b63b2a06b90f.js", "static/chunks/main-e5f270a497bd5087.js", "static/chunks/pages/_app-5841ab2cb8c5af32.js"],
        "/_error": ["static/chunks/webpack-1c8e1cb7c773f8a5.js", "static/chunks/framework-aec8b63b2a06b90f.js", "static/chunks/main-e5f270a497bd5087.js", "static/chunks/pages/_error-91a5938854a6f402.js"]
      },
      "ampFirstPages": []
    };
    fs.writeFileSync(cssManifestPath, JSON.stringify(cssManifest, null, 2));
    console.log(`Đã tạo file manifest CSS: ${cssManifestPath}`);

    // Tạo file placeholder cho JS
    const jsPlaceholder = path.join(__dirname, '.next', 'static', 'chunks', 'main-app.js');
    fs.writeFileSync(jsPlaceholder, '// JS placeholder for main-app.js');
    console.log(`Đã tạo file static placeholder: ${jsPlaceholder}`);

    // Tạo các file tĩnh bị thiếu
    staticFilesToCreate.forEach(file => {
      const dir = path.dirname(file.path);
      if (!fileExists(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(file.path, file.content);
      console.log(`Đã tạo file tĩnh: ${file.path}`);
    });
  } catch (err) {
    console.error(`Lỗi khi tạo static placeholders: ${err.message}`);
  }
}

// Tạo webpack placeholders
function createWebpackPlaceholders() {
  try {
    // Client development placeholders
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const clientPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'client-development', `${index}.pack`);
      createGzipFile(clientPackPath);
    });

    // Server development placeholders
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const serverPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'server-development', `${index}.pack`);
      createGzipFile(serverPackPath);
    });

    // Edge server development placeholders
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const edgePackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development', `${index}.pack`);
      createGzipFile(edgePackPath);
    });
  } catch (err) {
    console.error(`Lỗi khi tạo webpack placeholders: ${err.message}`);
  }
}

// Xóa webpack cache
function cleanWebpackCache() {
  // Không xóa cache nếu đang ở chế độ development
  if (process.env.NODE_ENV === 'development') {
    console.log("Đang chạy trong chế độ development, bỏ qua việc xóa cache webpack.");
    return;
  }
  
  try {
    // Client development
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const clientPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'client-development', `${index}.pack`);
      const clientGzipPath = `${clientPackPath}.gz`;
      safeDeleteFile(clientPackPath);
      safeDeleteFile(clientGzipPath);
    });

    // Server development
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const serverPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'server-development', `${index}.pack`);
      const serverGzipPath = `${serverPackPath}.gz`;
      safeDeleteFile(serverPackPath);
      safeDeleteFile(serverGzipPath);
    });

    // Edge server development
    ['0', '1', '2', '3', '4', '5'].forEach(index => {
      const edgePackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development', `${index}.pack`);
      const edgeGzipPath = `${edgePackPath}.gz`;
      safeDeleteFile(edgePackPath);
      safeDeleteFile(edgeGzipPath);
    });
  } catch (err) {
    console.error(`Lỗi khi xóa webpack cache: ${err.message}`);
  }
}

// Kiểm tra môi trường và gán
if (!process.env.NODE_ENV && (process.argv.includes('dev') || process.argv.includes('start'))) {
  process.env.NODE_ENV = 'development';
}

// Thực thi quy trình
try {
  // Nếu đang chạy trong chế độ development, không xóa thư mục .next hoàn toàn
  if (process.env.NODE_ENV !== 'development') {
    deleteNextFolder();
  }
  
  // Tạo các thư mục cache và file cần thiết
  createRequiredFiles();
  
  // Xử lý file trace
  cleanTrace();
  
  // Tạo các placeholder cho webpack cache
  createWebpackPlaceholders();
  
  // Tạo các static placeholder
  createStaticPlaceholders();

  // Trong môi trường development, không xóa cache sau khi đã tạo
  if (process.env.NODE_ENV !== 'development') {
    cleanWebpackCache();
  }
  
  console.log("Hoàn tất việc dọn dẹp và chuẩn bị môi trường.");
} catch (err) {
  console.error(`Lỗi trong quá trình thực thi: ${err.message}`);
}