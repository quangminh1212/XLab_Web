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
    content: '{"/_not-found":{"resolvedPagePath":"next/dist/client/components/not-found-error"},"/":{/":"app/page.js"}}'
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
    console.log("Đang xóa thư mục .next...");
    if (fileExists(nextDir)) {
      const deleteFolderRecursive = function(directoryPath) {
        if (fileExists(directoryPath)) {
          fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              // Bỏ qua các thư mục cache khi dev server đang chạy
              if (process.env.NODE_ENV === 'development' && curPath.includes('cache')) {
                return;
              }
              deleteFolderRecursive(curPath);
            } else {
              try {
                fs.unlinkSync(curPath);
              } catch (err) {
                if (err.code !== 'ENOENT' && err.code !== 'EPERM') {
                  console.error(`Lỗi khi xóa file ${curPath}: ${err.message}`);
                }
              }
            }
          });
          
          try {
            // Chỉ xóa thư mục nếu không phải là thư mục cache trong chế độ development
            if (!(process.env.NODE_ENV === 'development' && directoryPath.includes('cache'))) {
              fs.rmdirSync(directoryPath);
            }
          } catch (err) {
            if (err.code !== 'ENOENT' && err.code !== 'EPERM' && err.code !== 'ENOTEMPTY') {
              console.error(`Lỗi khi xóa thư mục ${directoryPath}: ${err.message}`);
            }
          }
        }
      };
      
      deleteFolderRecursive(nextDir);
      console.log("Đã xóa thư mục .next thành công.");
    } else {
      console.log("Thư mục .next không tồn tại, bỏ qua việc xóa.");
    }
  } catch (err) {
    console.error(`Lỗi khi xóa thư mục .next: ${err.message}`);
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
}

// Tạo các file static placeholder
function createStaticPlaceholders() {
  try {
    // Tạo thư mục static
    const staticDirs = [
      path.join(__dirname, '.next', 'static', 'chunks', 'app'),
      path.join(__dirname, '.next', 'static', 'chunks', 'pages'),
      path.join(__dirname, '.next', 'static', 'chunks', 'webpack'),
      path.join(__dirname, '.next', 'static', 'css', 'app')
    ];

    staticDirs.forEach(dir => {
      safeCreateDir(dir);
      console.log(`Đã tạo thư mục static: ${dir}`);
    });

    // Tạo file placeholder cho CSS
    const cssPlaceholder = path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css');
    fs.writeFileSync(cssPlaceholder, '/* CSS placeholder */');
    console.log(`Đã tạo file static placeholder: ${cssPlaceholder}`);

    // Tạo file placeholder cho JS
    const jsPlaceholder = path.join(__dirname, '.next', 'static', 'chunks', 'main-app.js');
    fs.writeFileSync(jsPlaceholder, '// JS placeholder');
    console.log(`Đã tạo file static placeholder: ${jsPlaceholder}`);
  } catch (err) {
    console.error(`Lỗi khi tạo static placeholders: ${err.message}`);
  }
}

// Tạo webpack placeholders
function createWebpackPlaceholders() {
  try {
    // Client development placeholders
    ['0', '1', '2'].forEach(index => {
      const clientPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'client-development', `${index}.pack`);
      createGzipFile(clientPackPath);
    });

    // Server development placeholders
    ['0', '1', '2'].forEach(index => {
      const serverPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'server-development', `${index}.pack`);
      createGzipFile(serverPackPath);
    });

    // Edge server development placeholders
    ['0', '1', '2'].forEach(index => {
      const edgePackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development', `${index}.pack`);
      createGzipFile(edgePackPath);
    });
  } catch (err) {
    console.error(`Lỗi khi tạo webpack placeholders: ${err.message}`);
  }
}

// Xóa webpack cache
function cleanWebpackCache() {
  try {
    // Client development
    ['0', '1', '2'].forEach(index => {
      const clientPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'client-development', `${index}.pack`);
      const clientGzipPath = `${clientPackPath}.gz`;
      safeDeleteFile(clientPackPath);
      safeDeleteFile(clientGzipPath);
    });

    // Server development
    ['0', '1', '2'].forEach(index => {
      const serverPackPath = path.join(__dirname, '.next', 'cache', 'webpack', 'server-development', `${index}.pack`);
      const serverGzipPath = `${serverPackPath}.gz`;
      safeDeleteFile(serverPackPath);
      safeDeleteFile(serverGzipPath);
    });

    // Edge server development
    ['0', '1', '2'].forEach(index => {
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
if (!process.env.NODE_ENV && process.argv.includes('dev')) {
  process.env.NODE_ENV = 'development';
}

// Thực thi quy trình
try {
  // Nếu đang chạy trong chế độ development, không xóa thư mục .next hoàn toàn
  if (process.env.NODE_ENV !== 'development') {
    deleteNextFolder();
  }
  
  createRequiredFiles();
  cleanTrace();
  
  // Tạo các placeholder chỉ khi không phải trong quá trình dev
  if (process.env.NODE_ENV !== 'development') {
    createWebpackPlaceholders();
    // Xóa cache sau khi đã tạo để tránh lỗi
    cleanWebpackCache();
  }
  
  createStaticPlaceholders();
  console.log("Hoàn tất việc dọn dẹp và chuẩn bị môi trường.");
} catch (err) {
  console.error(`Lỗi trong quá trình thực thi: ${err.message}`);
}