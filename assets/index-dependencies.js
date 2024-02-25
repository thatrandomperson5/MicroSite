     {
        let deps = [
          // Bootstrap
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css",
            type: "css"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js",
            type: "js"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css",
            type: "css"
          },

          // Codemirror basic
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js",
            type: "js"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css",
            type: "css"
          },
          // Theme
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/lesser-dark.min.css",
            type: "css"
          },

          // Codemirror modes
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/javascript/javascript.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/css/css.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/xml/xml.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/htmlmixed/htmlmixed.min.js",
            type: "js"
          },

          // Deps
          {
            url: "https://unpkg.com/htmlhint@1.1.4/dist/htmlhint.js",
            type: "js"
          },
          {
            url: "https://unpkg.com/csslint@1.0.5/dist/csslint.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/xml-fold.min.js",
            type: "js"
          },

          // Hint
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/show-hint.min.css",
            type: "css"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/show-hint.min.js",
            type: "js"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/javascript-hint.min.js",
            type: "js"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/css-hint.min.js",
            type: "js"
          }, {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/html-hint.min.js",
            type: "js"
          },

          // Lint
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/jshint/2.13.6/jshint.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/lint/lint.min.css",
            type: "css"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/lint/lint.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/lint/javascript-lint.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/lint/html-lint.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/lint/css-lint.min.js",
            type: "js"
          },
          // Match and close
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/edit/matchbrackets.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/edit/matchtags.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/edit/closebrackets.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/edit/closetag.min.js",
            type: "js"
          },
          // Fold
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/foldcode.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/foldgutter.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/foldgutter.min.css",
            type: "css"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/brace-fold.min.js",
            type: "js"
          },
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/fold/comment-fold.min.js",
            type: "js"
          },
          
          // Misc
          {
            url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/selection/active-line.min.js", 
            type: "js"
          }
        ];
        deps.forEach((item) => {
          let e = item.type == "css" ? document.createElement("link") : document.createElement("script");
          e.setAttribute("crossorigin", "anonymous");
          e.setAttribute("referrerpolicy", "no-referrer");
          if (item.type == "css") {
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", item.url);
          } else {
            e.setAttribute("src", item.url);
          }

          document.head.appendChild(e);
        });
      }
// So freaking buggy, so tmp fix
var CodeMirror = null;
