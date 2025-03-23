import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="vi">
        <Head>
          {/* Preconnect to essential domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Polyfill for Function.prototype.call */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Check if Function.prototype.call exists and works correctly
                  try {
                    if (typeof Function.prototype.call === 'function') {
                      // Test Function.prototype.call
                      var testFn = function(arg) { return 'Test: ' + arg; };
                      var result = Function.prototype.call.call(testFn, null, 'test');
                      
                      // If we get here, call is working properly
                      console.log('Function.prototype.call test passed:', result);
                    } else {
                      console.error('Function.prototype.call is not a function! Type:', typeof Function.prototype.call);
                      
                      // If Function.prototype.call doesn't exist or isn't a function, create it using apply
                      if (typeof Function.prototype.apply === 'function') {
                        console.log('Attempting to restore Function.prototype.call using apply');
                        
                        // Create a new implementation of call using apply
                        Function.prototype.call = function(thisArg) {
                          var args = [];
                          for (var i = 1; i < arguments.length; i++) {
                            args.push(arguments[i]);
                          }
                          return this.apply(thisArg, args);
                        };
                        
                        // Test our implementation
                        var fixTestFn = function(arg) { return 'Fixed: ' + arg; };
                        var fixResult = Function.prototype.call.call(fixTestFn, null, 'fixed test');
                        console.log('Restored Function.prototype.call test:', fixResult);
                      } else {
                        console.error('Both Function.prototype.call and Function.prototype.apply are unavailable!');
                      }
                    }
                  } catch (error) {
                    console.error('Error checking Function.prototype.call:', error);
                  }
                  
                  // Log debugging info
                  console.log('Document initialization: ' + new Date().toISOString());
                  console.log('Navigator:', navigator.userAgent);
                  console.log('Function.prototype methods:', Object.getOwnPropertyNames(Function.prototype));
                })();
              `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 