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
    path: path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    content: '{"version":2,"sortedMiddleware":[],"middleware":{},"functions":{},"pages":{}}'
  },
  { 
    path: path.join(__dirname, '.next', 'build-manifest.json'),
    content: '{"polyfillFiles":[],"devFiles":[],"ampDevFiles":[],"lowPriorityFiles":[],"rootMainFiles":[],"pages":{"/_app":[],"/_error":[]},"ampFirstPages":[]}'
  },
  { 
    path: path.join(__dirname, '.next', 'react-loadable-manifest.json'),
    content: '{}'
  },
  {
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next.js'),
    content: 'module.exports = require("next/dist/lib/constants");'
  },
  {
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react.js'),
    content: `
      module.exports = {
        __esModule: true,
        cache: function(fn) { return fn; },
        default: require("react"),
        useCallback: require("react").useCallback,
        useContext: require("react").useContext,
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

/**
 * Xóa hoàn toàn thư mục .next
 */
function deleteNextFolder() {
  try {
    // Kiểm tra nếu thư mục .next tồn tại
    if (fs.existsSync(nextDir)) {
      console.log('Đang xóa thư mục .next...');
      // Sử dụng rimraf trong môi trường Windows để xử lý các vấn đề quyền truy cập
      try {
        const rimrafPath = path.join(__dirname, 'node_modules', '.bin', 'rimraf');
        if (fs.existsSync(rimrafPath)) {
          execSync(`${rimrafPath} .next`, { stdio: 'inherit' });
        } else {
          // Fallback: dùng fs.rmSync nếu có
          if (fs.rmSync) {
            fs.rmSync(nextDir, { recursive: true, force: true });
          } else {
            // Node.js cũ hơn
            const deleteFolderRecursive = function(directoryPath) {
              if (fs.existsSync(directoryPath)) {
                fs.readdirSync(directoryPath).forEach((file) => {
                  const curPath = path.join(directoryPath, file);
                  if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                  } else {
                    try {
                      fs.unlinkSync(curPath);
                    } catch (err) {
                      console.log(`Không thể xóa file: ${curPath}. Lỗi: ${err.message}`);
                    }
                  }
                });
                try {
                  fs.rmdirSync(directoryPath);
                } catch (err) {
                  console.log(`Không thể xóa thư mục: ${directoryPath}. Lỗi: ${err.message}`);
                }
              }
            };
            deleteFolderRecursive(nextDir);
          }
        }
        console.log('Đã xóa thư mục .next thành công.');
      } catch (error) {
        console.error('Lỗi khi xóa thư mục .next:', error.message);
      }
    } else {
      console.log('Thư mục .next không tồn tại, bỏ qua.');
    }
  } catch (error) {
    console.error('Lỗi khi xóa thư mục .next:', error.message);
  }
}

/**
 * Tạo file .gz với nội dung mặc định để tránh lỗi ENOENT
 * @param {string} filePath Đường dẫn file
 */
function createGzipFile(filePath) {
  try {
    const content = Buffer.from('{"version":1,"content":{}}');
    const compressed = zlib.gzipSync(content);
    fs.writeFileSync(filePath, compressed);
    console.log(`Đã tạo file gzip: ${filePath}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file gzip ${filePath}:`, err.message);
  }
}

/**
 * Đọc, xóa nội dung file trace và các file tạm thời khác
 */
function cleanTrace() {
  try {
    // Xóa file trace
    if (fs.existsSync(traceFile)) {
      try {
        fs.writeFileSync(traceFile, '', { encoding: 'utf8', mode: 0o666 });
        console.log('Đã xóa nội dung tệp trace thành công.');
      } catch (err) {
        console.log(`Không thể ghi file trace: ${err.message}`);
        // Nếu không thể ghi file, thử xóa nó
        try {
          fs.unlinkSync(traceFile);
          console.log('Đã xóa file trace.');
        } catch (unlinkErr) {
          console.log(`Không thể xóa file trace: ${unlinkErr.message}`);
        }
      }
    } else {
      console.log('File trace không tồn tại, bỏ qua.');
    }

    // Xóa các file cache webpack gây lỗi
    cleanWebpackCache();

    // Tạo các file cần thiết để tránh lỗi
    createRequiredFiles();

    console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');
  } catch (error) {
    console.error('Lỗi khi xóa file trace:', error.message);
  }
}

/**
 * Tạo các file cần thiết để tránh lỗi ENOENT
 */
function createRequiredFiles() {
  for (const file of filesToCreate) {
    try {
      const dir = path.dirname(file.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Đã tạo thư mục: ${dir}`);
      }
      
      fs.writeFileSync(file.path, file.content);
      console.log(`Đã tạo file: ${file.path}`);
    } catch (err) {
      console.error(`Lỗi khi tạo file ${file.path}:`, err.message);
    }
  }
  
  // Tạo các file cho static directory
  createStaticPlaceholders();
}

/**
 * Tạo các static placeholders để tránh lỗi
 */
function createStaticPlaceholders() {
  const staticDirs = [
    path.join(__dirname, '.next', 'static', 'chunks', 'app'),
    path.join(__dirname, '.next', 'static', 'chunks', 'pages'),
    path.join(__dirname, '.next', 'static', 'chunks', 'webpack'),
    path.join(__dirname, '.next', 'static', 'css', 'app'),
    path.join(__dirname, '.next', 'static', 'media'),
    path.join(__dirname, '.next', 'static', 'webpack'),
  ];

  staticDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục static: ${dir}`);
    }
  });

  // Tạo file CSS placeholder
  const cssPlaceholder = path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css');
  try {
    fs.writeFileSync(cssPlaceholder, '/* Placeholder CSS */');
    console.log(`Đã tạo file static placeholder: ${cssPlaceholder}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file ${cssPlaceholder}:`, err.message);
  }
  
  // Tạo file JS chunks placeholder
  const mainAppJs = path.join(__dirname, '.next', 'static', 'chunks', 'main-app.js');
  try {
    fs.writeFileSync(mainAppJs, '// Placeholder for main-app.js');
    console.log(`Đã tạo file static placeholder: ${mainAppJs}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file ${mainAppJs}:`, err.message);
  }
}

/**
 * Tạo các webpack cache placeholder để tránh lỗi
 */
function createWebpackPlaceholders() {
  // Tạo các tệp placeholder pack.gz để tránh lỗi
  const webpackDirs = [
    path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
    path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
    path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development')
  ];

  webpackDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục cache: ${dir}`);
    }

    // Tạo 3 tệp .pack và .pack.gz placeholder
    for (let i = 0; i < 3; i++) {
      const packFile = path.join(dir, `${i}.pack`);
      const gzipFile = path.join(dir, `${i}.pack.gz`);
      
      try {
        // Nội dung cho file .pack
        fs.writeFileSync(packFile, '{"version":1,"content":{}}');
        console.log(`Đã tạo file placeholder: ${packFile}`);
        
        // Tạo file .gz tương ứng
        createGzipFile(gzipFile);
      } catch (err) {
        console.error(`Lỗi khi tạo file ${packFile}:`, err.message);
      }
    }
  });
}

/**
 * Xóa các file cache webpack gây lỗi
 */
function cleanWebpackCache() {
  const cacheDir = path.join(__dirname, '.next', 'cache', 'webpack');
  const subDirs = ['client-development', 'server-development', 'edge-server-development'];
  
  try {
    if (!fs.existsSync(cacheDir)) {
      return;
    }
    
    for (const subDir of subDirs) {
      const dirPath = path.join(cacheDir, subDir);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
          if (file.endsWith('.pack.gz') || file.endsWith('.pack')) {
            const filePath = path.join(dirPath, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Đã xóa file: ${filePath}`);
            } catch (err) {
              // Bỏ qua lỗi nếu file không tồn tại hoặc không thể xóa
              console.log(`Không thể xóa file: ${filePath}. Lỗi: ${err.message}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Lỗi khi xóa cache webpack:', error.message);
  }
}

// Ưu tiên xóa thư mục .next trước
deleteNextFolder();

// Đảm bảo các thư mục cache tồn tại
cacheDirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục cache: ${dir}`);
    }
  } catch (err) {
    console.error(`Lỗi khi tạo thư mục cache ${dir}:`, err.message);
  }
});

// Tạo các placeholder cho webpack cache
createWebpackPlaceholders();

// Thực thi hàm
cleanTrace();