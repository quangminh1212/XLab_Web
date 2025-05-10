/**
 * XLab_Web Maintenance Script
 * - Dọn dẹp và sửa lỗi tự động
 * - Tạo cấu trúc file tối thiểu cho .next
 * - Quản lý các thành phần xác thực
 * - Cập nhật .gitignore
 */

console.log('🚀 Khởi động script bảo trì...');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cấu hình
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');

console.log('📁 Thư mục gốc:', rootDir);
console.log('📁 Thư mục .next:', nextDir);

// Các thư mục cần thiết trong .next
const requiredDirs = [
  path.join(nextDir, 'cache'),
  path.join(nextDir, 'server'),
  path.join(nextDir, 'static'),
  path.join(nextDir, 'static', 'chunks'),
  path.join(nextDir, 'static', 'css'),
  path.join(nextDir, 'static', 'webpack'),
  path.join(nextDir, 'server', 'chunks'),
  path.join(nextDir, 'server', 'pages'),
  path.join(nextDir, 'server', 'vendor-chunks'),
  path.join(nextDir, 'server', 'app')
];

// Các mẫu cần có trong .gitignore
const gitignorePatterns = [
  '.next/',
  'node_modules/',
  '.DS_Store',
  '*.log',
  'dist/',
  'out/',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
];

// Tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Đã tạo thư mục: ${dirPath}`);
    return true;
  }
  return false;
}

// Tạo file với nội dung
function createFileWithContent(filePath, content) {
  const dirPath = path.dirname(filePath);
  ensureDirectoryExists(dirPath);
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Đã tạo file: ${filePath}`);
}

// Xử lý file trace
function fixTraceFile() {
  console.log('🔍 Kiểm tra file trace...');
  
  const tracePath = path.join(nextDir, 'trace');
  if (fs.existsSync(tracePath)) {
    try {
      // Đặt lại quyền truy cập
      try {
        fs.chmodSync(tracePath, 0o666);
        console.log('✅ Đã đặt lại quyền truy cập của file trace');
      } catch (chmodErr) {
        console.log('❌ Không thể đặt lại quyền truy cập:', chmodErr.message);
      }

      // Xóa file trace
      try {
        fs.unlinkSync(tracePath);
        console.log('✅ Đã xóa file trace thành công');
      } catch (unlinkErr) {
        console.log('❌ Không thể xóa file trace:', unlinkErr.message);
        
        // Thử phương pháp khác trên Windows
        try {
          execSync('attrib -r -s -h .next\\trace');
          execSync('del /f /q .next\\trace');
          if (!fs.existsSync(tracePath)) {
            console.log('✅ Đã xóa file trace thành công bằng CMD');
          }
        } catch (cmdErr) {
          console.log('❌ Vẫn không thể xóa file trace:', cmdErr.message);
        }
      }
    } catch (error) {
      console.log('❌ Lỗi khi xử lý file trace:', error.message);
    }
  } else {
    console.log('✅ Không tìm thấy file trace, không cần xử lý');
  }
}

// Sửa lỗi Next.js config
function fixNextConfig() {
  console.log('🔧 Kiểm tra và sửa cấu hình Next.js...');
  
  const configPath = path.join(rootDir, 'next.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('❌ Không tìm thấy file next.config.js');
    return;
  }
  
  // Đọc nội dung file
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Kiểm tra xem outputFileTracingExcludes có trong experimental không
  const hasExperimentalTracing = configContent.includes('experimental') && 
    configContent.includes('outputFileTracingExcludes') && 
    /experimental\s*:\s*{[^}]*outputFileTracingExcludes/.test(configContent);
  
  if (hasExperimentalTracing) {
    console.log('🔄 Đang sửa cấu hình next.config.js...');
    
    // Tạo bản sao lưu nếu chưa có
    if (!fs.existsSync(`${configPath}.bak`)) {
      try {
        fs.copyFileSync(configPath, `${configPath}.bak`);
        console.log('✅ Đã tạo bản sao lưu next.config.js.bak');
      } catch (err) {
        console.log('❌ Lỗi khi tạo bản sao lưu:', err.message);
      }
    }
    
    try {
      // Trích xuất nội dung của outputFileTracingExcludes
      const tracingMatch = /outputFileTracingExcludes\s*:\s*({[^}]*})/.exec(configContent);
      if (tracingMatch && tracingMatch[1]) {
        const tracingContent = tracingMatch[1];
        
        // Xóa nó khỏi experimental
        let newConfig = configContent.replace(/(\s*outputFileTracingExcludes\s*:\s*{[^}]*}),?/g, '');
        
        // Thêm nó như một tùy chọn cấp cao nhất
        newConfig = newConfig.replace(/(experimental\s*:\s*{[^}]*}\s*),?/g, '$1,\n  outputFileTracingExcludes: ' + tracingContent + ',\n  ');
        
        fs.writeFileSync(configPath, newConfig);
        console.log('✅ Đã sửa cấu hình next.config.js thành công');
      } else {
        console.log('⚠️ Không thể tìm thấy nội dung outputFileTracingExcludes');
      }
    } catch (err) {
      console.log('❌ Lỗi khi sửa cấu hình:', err.message);
    }
  } else {
    console.log('✅ Cấu hình next.config.js đã hợp lệ');
  }
}

// Tạo cấu trúc thư mục tối thiểu cho .next
function createMinimalNextStructure() {
  console.log('📁 Tạo cấu trúc thư mục tối thiểu cho Next.js...');
  
  // Đảm bảo thư mục .next tồn tại
  ensureDirectoryExists(nextDir);
  
  // Tạo các thư mục cần thiết
  let createdAny = false;
  for (const dir of requiredDirs) {
    if (ensureDirectoryExists(dir)) {
      createdAny = true;
      
      // Tạo file .gitkeep trong mỗi thư mục
      const gitkeepPath = path.join(dir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
      }
    }
  }
  
  if (createdAny) {
    console.log('✅ Đã tạo xong cấu trúc thư mục tối thiểu');
  } else {
    console.log('ℹ️ Cấu trúc thư mục đã đầy đủ');
  }
}

// Xóa hoàn toàn thư mục .next và tạo lại
function resetNextDirectory() {
  console.log('🔄 Xóa hoàn toàn và tạo mới thư mục .next...');
  
  try {
    // Nếu thư mục .next tồn tại, xóa nó
    if (fs.existsSync(nextDir)) {
      try {
        // Trên Windows, đôi khi cần thiết lập lại quyền truy cập trước khi xóa
        try {
          execSync('attrib -R -S -H .next /S /D');
        } catch (error) {
          console.log('⚠️ Không thể đặt lại thuộc tính thư mục .next:', error.message);
        }
        
        fs.rmSync(nextDir, { recursive: true, force: true });
        console.log('✅ Đã xóa thư mục .next cũ');
      } catch (error) {
        console.log('❌ Lỗi khi xóa thư mục .next:', error.message);
        console.log('⚠️ Thử phương pháp xóa thay thế...');
        
        try {
          // Thử phương pháp khác: sử dụng cmd
          execSync('rd /s /q .next', { shell: true });
          console.log('✅ Đã xóa thư mục .next bằng cmd');
        } catch (cmdError) {
          console.log('❌ Không thể xóa .next ngay cả với cmd:', cmdError.message);
          return false;
        }
      }
    }
    
    // Tạo thư mục .next mới
    ensureDirectoryExists(nextDir);
    console.log('✅ Đã tạo thư mục .next mới');
    
    // Tạo các thư mục con cần thiết
    requiredDirs.forEach(dir => {
      ensureDirectoryExists(dir);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Lỗi không xác định khi xử lý thư mục .next:', error.message);
    return false;
  }
}

// Tạo các file manifest cần thiết cho Next.js
function createNextManifestFiles() {
  console.log('📄 Tạo các file manifest quan trọng...');

  const serverDir = path.join(nextDir, 'server');
  ensureDirectoryExists(serverDir);

  const manifestFiles = [
    {
      path: path.join(serverDir, 'middleware-manifest.json'),
      content: JSON.stringify({ 
        version: 2,
        middleware: {},
        sortedMiddleware: [],
        functions: {},
        pages: {}
      }, null, 2)
    },
    {
      path: path.join(serverDir, 'pages-manifest.json'),
      content: JSON.stringify({}, null, 2)
    },
    {
      path: path.join(serverDir, 'app-paths-manifest.json'),
      content: JSON.stringify({}, null, 2)
    },
    {
      path: path.join(serverDir, 'next-font-manifest.json'),
      content: JSON.stringify({ pages: {}, app: {} }, null, 2)
    },
    {
      path: path.join(nextDir, 'build-manifest.json'),
      content: JSON.stringify({ 
        polyfillFiles: [], 
        devFiles: [], 
        ampDevFiles: [], 
        lowPriorityFiles: [],
        rootMainFiles: [],
        pages: { "/_app": [] },
        ampFirstPages: []
      }, null, 2)
    },
    {
      path: path.join(serverDir, 'server-reference-manifest.json'),
      content: JSON.stringify({ clientModules: {}, ssrModules: {}, edgeSSRModules: {} }, null, 2)
    },
    {
      path: path.join(serverDir, 'client-reference-manifest.json'),
      content: JSON.stringify({ clientModules: {}, ssrModules: {}, edgeSSRModules: {} }, null, 2)
    },
    {
      path: path.join(serverDir, 'webpack-runtime.js'),
      content: `
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
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
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup entrypoint */
/******/ 	(() => {
/******/ 		__webpack_require__.X = (result, chunkIds, fn) => {
/******/ 			// arguments: chunkIds, moduleId are deprecated
/******/ 			var moduleId = chunkIds;
/******/ 			if(!fn) chunkIds = result, fn = () => (__webpack_require__(__webpack_require__.s = moduleId));
/******/ 			chunkIds.map(__webpack_require__.e, __webpack_require__)
/******/ 			var r = fn();
/******/ 			return r === undefined ? result : r;
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"webpack-runtime": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if("webpack-runtime" != chunkId) {
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	
/******/ })()
;
      `
    },
    {
      path: path.join(serverDir, 'chunks', 'webpack.js'),
      content: `/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["webpack"],{},
/*!********************!*\\
  !*** ./webpack.js ***!
  \\********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
/***/ (() => {

eval("// This file is created as a placeholder by XLab_Web maintenance script\\r\\n//# sourceURL=[module]\\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vd2VicGFjay5qcz81MTZjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\\n//# sourceURL=webpack-internal:///./webpack.js\\n");

/***/ })
},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./webpack.js"));
/******/ }
]);
      `
    },
    {
      path: path.join(nextDir, 'react-refresh.js'),
      content: `/* global __webpack_require__ */
import * as RefreshRuntime from "react-refresh/runtime"
var cleanup = function() {};
if (process.env.NODE_ENV !== 'production') {
  cleanup = RefreshRuntime.createContainer(__webpack_require__);
  self.$RefreshReg$ = RefreshRuntime.register;
  self.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
export default cleanup;
      `
    }
  ];

  let createdAny = false;
  for (const file of manifestFiles) {
    try {
      // Xóa file cũ nếu có
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      // Tạo thư mục cha nếu cần
      const dirPath = path.dirname(file.path);
      ensureDirectoryExists(dirPath);
      
      // Tạo file mới
      fs.writeFileSync(file.path, file.content, { encoding: 'utf8', flag: 'w' });
      console.log(`✅ Đã tạo file manifest: ${file.path}`);
      
      // Đảm bảo các quyền truy cập đúng (Windows có thể gây vấn đề)
      try {
        fs.chmodSync(file.path, 0o666);  // Quyền đọc-ghi cho mọi người
      } catch (chmodErr) {
        console.log(`⚠️ Không thể đặt quyền cho file ${file.path}: ${chmodErr.message}`);
      }
      
      createdAny = true;
    } catch (error) {
      console.log(`❌ Lỗi khi tạo file ${file.path}: ${error.message}`);
    }
  }

  if (!createdAny) {
    console.log('⚠️ Không thể tạo bất kỳ file manifest nào');
  } else {
    console.log('✅ Đã tạo các file manifest cần thiết');
  }
  
  return createdAny;
}

// Tạo file CSS giả và file route giả cho NextAuth
function createPlaceholderFiles() {
  console.log('🎭 Tạo các file giả để tránh lỗi 404...');
  
  // CSS file
  const cssDir = path.join(nextDir, 'static', 'css');
  ensureDirectoryExists(cssDir);
  
  const cssFile = path.join(cssDir, 'app-layout.css');
  if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, '/* Placeholder CSS */');
    console.log(`✅ Đã tạo file CSS giả: ${cssFile}`);
  }
  
  // NextAuth route
  const nextAuthDir = path.join(nextDir, 'server', 'app', 'api', 'auth', '[...nextauth]');
  ensureDirectoryExists(nextAuthDir);
  
  const routeFile = path.join(nextAuthDir, 'route.js');
  if (!fs.existsSync(routeFile)) {
    fs.writeFileSync(routeFile, '// Placeholder NextAuth route file');
    console.log(`✅ Đã tạo file route giả cho NextAuth: ${routeFile}`);
  }
}

// Kiểm tra file .env và .env.local
function checkEnvFiles() {
  console.log('🔐 Kiểm tra file môi trường...');
  
  const envPath = path.join(rootDir, '.env');
  const envLocalPath = path.join(rootDir, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    createFileWithContent(envPath, 'NODE_ENV=development\nNEXTAUTH_URL=http://localhost:3000\n');
    console.log('✅ Đã tạo file .env');
  }
  
  if (!fs.existsSync(envLocalPath)) {
    createFileWithContent(envLocalPath, 'NEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=\n');
    console.log('✅ Đã tạo file .env.local');
  }
}

// Đảm bảo component withAdminAuth tồn tại
function ensureAuthComponents() {
  console.log('🔐 Kiểm tra các thành phần xác thực...');
  
  // Đường dẫn đến component withAdminAuth
  const withAdminAuthPath = path.join(rootDir, 'src', 'components', 'auth', 'withAdminAuth.tsx');
  const authDir = path.join(rootDir, 'src', 'components', 'auth');
  
  // Kiểm tra xem component đã tồn tại chưa
  if (!fs.existsSync(withAdminAuthPath)) {
    // Tạo thư mục nếu chưa tồn tại
    ensureDirectoryExists(authDir);
    
    // Nội dung của component
    const componentContent = `'use client';

import { useEffect, ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Higher Order Component để bảo vệ các trang admin
function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
      // Kiểm tra nếu người dùng đang tải
      if (status === 'loading') return;
      
      // Kiểm tra nếu không có session thì chuyển hướng về trang đăng nhập
      if (!session) {
        signIn();
        return;
      }
      
      // Kiểm tra nếu người dùng không phải admin thì chuyển hướng về trang chủ
      // Giả sử vai trò admin được lưu trong session.user.role
      if (session.user && (session.user as any).role !== 'admin') {
        router.push('/');
        return;
      }
    }, [session, status, router]);
    
    // Hiển thị màn hình loading trong khi kiểm tra xác thực
    if (status === 'loading' || !session) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    // Kiểm tra nếu không phải admin thì hiển thị thông báo
    if (session.user && (session.user as any).role !== 'admin') {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
    
    // Nếu người dùng là admin, hiển thị component
    return <Component {...props} />;
  };
}

export default withAdminAuth;`;

    // Ghi nội dung vào file
    createFileWithContent(withAdminAuthPath, componentContent);
    console.log('✅ Đã tạo component withAdminAuth');
  } else {
    console.log('ℹ️ Component withAdminAuth đã tồn tại');
  }
}

// Cập nhật file .gitignore
function updateGitignore() {
  console.log('📝 Kiểm tra .gitignore...');
  
  const gitignorePath = path.join(rootDir, '.gitignore');
  
  // Nếu không có file .gitignore, tạo mới
  if (!fs.existsSync(gitignorePath)) {
    createFileWithContent(gitignorePath, gitignorePatterns.join('\n'));
    console.log('✅ Đã tạo file .gitignore mới');
    return;
  }
  
  // Đọc nội dung file .gitignore hiện tại
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = content.split('\n').map(line => line.trim());
  
  // Kiểm tra và thêm các mẫu còn thiếu
  let updated = false;
  const missingPatterns = gitignorePatterns.filter(pattern => !lines.includes(pattern));
  
  if (missingPatterns.length > 0) {
    // Thêm các mẫu còn thiếu vào cuối file
    const newContent = content + '\n' + missingPatterns.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
    console.log('✅ Đã cập nhật .gitignore với các mẫu còn thiếu');
    updated = true;
  }
  
  if (!updated) {
    console.log('✅ .gitignore đã chứa tất cả các mẫu cần thiết');
  }
}

// Tạo các file .pack giả để tránh lỗi ENOENT
function createEmptyPackFiles() {
  console.log('📦 Tạo các file .pack giả để tránh lỗi...');
  
  const webpackDirs = [
    path.join(nextDir, 'cache', 'webpack', 'client-development'),
    path.join(nextDir, 'cache', 'webpack', 'server-development'),
    path.join(nextDir, 'cache', 'webpack', 'edge-server-development')
  ];
  
  webpackDirs.forEach(dir => {
    if (ensureDirectoryExists(dir)) {
      for (let i = 0; i <= 5; i++) {
        const packFile = path.join(dir, `${i}.pack`);
        const packGzFile = path.join(dir, `${i}.pack.gz`);
        
        if (!fs.existsSync(packFile)) {
          fs.writeFileSync(packFile, '');
          console.log(`✅ Đã tạo file trống: ${packFile}`);
        }
        
        if (!fs.existsSync(packGzFile)) {
          fs.writeFileSync(packGzFile, '');
          console.log(`✅ Đã tạo file trống: ${packGzFile}`);
        }
      }
    }
  });
}

// Chức năng chính
async function main() {
  console.log('=== Bảo trì dự án Next.js ===');
  console.log('🚀 Bắt đầu quá trình bảo trì và tối ưu hóa...');
  
  // Xóa và tạo mới hoàn toàn thư mục .next
  resetNextDirectory();
  
  // Tạo file trace nếu cần thiết
  fixTraceFile();
  
  // Tạo cấu trúc thư mục tối thiểu
  createMinimalNextStructure();
  
  // Tạo các file manifest
  createNextManifestFiles();
  
  // Kiểm tra và sửa cấu hình Next.js
  fixNextConfig();
  
  // Tạo file giả và .pack
  createEmptyPackFiles();
  createPlaceholderFiles();
  
  // Kiểm tra file môi trường
  checkEnvFiles();
  
  // Đảm bảo các thành phần xác thực
  ensureAuthComponents();
  
  // Cập nhật .gitignore
  updateGitignore();
  
  console.log('✅ Đã hoàn tất quá trình bảo trì!');
  console.log('📝 Bạn có thể khởi động dự án bây giờ');
  
  return true;
}

// Chạy chương trình
main().catch(error => {
  console.error('❌ Lỗi:', error);
  process.exit(1);
}).finally(() => {
  console.log('✅ Script bảo trì đã hoàn thành, khởi động Next.js đã sẵn sàng.');
}); 