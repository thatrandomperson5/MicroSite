var currentFile = "";
var database;

// Codemirror

var cm;

// Filetree

function renderFolder(name, path, children) {
  return `<li>
            <p class="d-inline-flex justify-content-between w-100 gap-1">
              <span>
              <i class="bi bi-folder-fill"></i>
              <a data-bs-toggle="collapse" href="#filepath-${path}" role="button" aria-expanded="false" aria-controls="#filepath-${path}">
                ${name}
              </a>
              </span>
              <button class="text-danger btn btn-link p-0 m-0" onclick="deleteFolder('${path}')"><i class="bi bi-trash3"></i></button>
            </p>
            <ul class="collapse" id="filepath-${path}">
              ${children}
            </ul>
          </li>`;
}

function renderFiles(files, path = []) {
  var result = "";
  var npath = path;
  for (const [key, value] of Object.entries(files)) {
    npath.push(key);
    if (typeof value === "string" || value instanceof String) {
      result += `<li class="d-inline-flex justify-content-between w-100">
      <span><i class="bi bi-file-earmark-code-fill"></i>&nbsp;<a href="#filepath-${npath.join("/")}">${key}</a></span>
      <button class="text-danger btn btn-link p-0 m-0" onclick="deleteFile('${path.join("/")}')"><i class="bi bi-trash3"></i></button>
      </li>`;
    } else {
      let childResult = renderFiles(value, npath);
      result += renderFolder(key, npath.join("/"), childResult);
    }
    npath.pop();
  }
  return result;
}

function set(path, value, obj) {
  // https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
  var schema = obj; // a moving reference to internal objects within obj
  var pList = path;
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
}

function deleteKey(object, keys) {
  // https://stackoverflow.com/questions/51450513/how-can-i-delete-a-key-in-a-nested-javascript-object-with-a-dynamic-number-of-pr
  var last = keys.pop();
  delete keys.reduce((o, k) => o[k], object)[last];
  return object;
}

function hasChildren(object, path) {
  var o = object;
  path.forEach((item) => {
    o = o[item];
  });
  return o != "id" && Object.keys(o).length > 0;
}

// Click event handles

function runHandle(event) {
  let ipreview = document.getElementById("result-inline");
  if (ipreview.classList.contains("d-none")) {
    window.location.href = "/view.html";
  } else {
    ipreview.src = "/view.html";
  }
}

function addFolder(event) {
  var tree = JSON.parse(window.localStorage.getItem("fileTree"));

  let path = (prompt("Path to folder & name:") || "").split("/");
  if (path[0] == "") {
    return;
  }
  try {
    set(path, {}, tree);
  } catch (error) {
    alert("You can only create folders in an exisiting directory.");
  }
  console.log(tree);
  document.getElementById("fileTree").innerHTML = renderFiles(tree);
  window.localStorage.setItem("fileTree", JSON.stringify(tree));
}

function addFile(event) {
  var tree = JSON.parse(window.localStorage.getItem("fileTree"));

  let path = (prompt("Path to file & name:") || "").split("/");
  if (path[0] == "") {
    return;
  }
  try {
    set(path, "id", tree);
  } catch (error) {
    alert("You can only create file in an exisiting directory.");
  }

  database.saveFile(path.join("/"), "").then((success) => {
    window.localStorage.setItem("fileTree", JSON.stringify(tree));
    document.getElementById("fileTree").innerHTML = renderFiles(tree);
  });
}

function saveFile(event, doAlert=true) {
  let cf = currentFile;
  database.saveFile(cf, cm.getValue()).then((res) => {
    if (doAlert) {
      alert("Saved " + cf);
    }
  });
}

function deleteFile(path) {
  if (confirm("Delete " + path)) {
    database.deleteFile(path).then((res) => {
      console.log(res);
      if (res) {
        var tree = JSON.parse(window.localStorage.getItem("fileTree"));
        deleteKey(tree, path.split("/"));
        window.localStorage.setItem("fileTree", JSON.stringify(tree));
        document.getElementById("fileTree").innerHTML = renderFiles(tree);
      }
    });
  }
}

function deleteFolder(path) {
  var tree = JSON.parse(window.localStorage.getItem("fileTree"));
  if (hasChildren(tree, path.split("/"))) {
    alert("You can only delete empty folders!");
    return;
  }
  if (confirm("Delete " + path)) {
    deleteKey(tree, path.split("/"));
    window.localStorage.setItem("fileTree", JSON.stringify(tree));
    document.getElementById("fileTree").innerHTML = renderFiles(tree);
  }
}

function isValidFile(path) {
  var tree = JSON.parse(window.localStorage.getItem("fileTree"));
  var result = true;

  path.forEach((item) => {
    if (tree.hasOwnProperty(item)) {
      tree = tree[item];
    } else {
      result = false;
      return;
    }
  });
  return result;
}

// KillSwitch
const killChannel = new BroadcastChannel("microsite_killswitch_v1");

// Modal handle
document.getElementById("loadModalTrigger").onload = (event) =>
  event.target.click();

document.head.addEventListener("globalPageDependenciesLoaded", (event) => {
  let trigger = document.getElementById("loadModalTrigger");
  let modal = document.getElementById("loadModal");
  if (modal.classList.contains("show")) {
    trigger.click();
  }
});

// Init

function init() {
  // Codemirror
  cm = CodeMirror(document.getElementById("editor"), {
    value: "<!-- Please choose a file! -->",
    mode: "htmlmixed",
    theme: "lesser-dark",
    lineNumbers: true,
    lint: true,
    showHint: {},
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchBrackets: true,
    matchTags: {
      bothTags: true,
    },
    gutters: [
      "CodeMirror-lint-markers",
      "CodeMirror-linenumbers",
      "CodeMirror-foldgutter",
    ],
    foldGutter: true,
    styleActiveLine: true,
  });
  cm.setSize("100%", "100%");

  // kill

  killChannel.postMessage({
    action: "killAll",
  });
  killChannel.onmessage = (event) => {
    if (event.data.action === "killAll") {
      killChannel.close();
      window.location.href = "/killed.html";
    }
  };

  const hashEventHandle = (event) => {
    // Sneaky save
    if (currentFile != "") {
      saveFile(event);

    }

    let hash = window.location.hash;
    currentFile = hash.slice(10);
    if (!isValidFile(currentFile.split("/"))) {
      window.location.href = "#filepath-index.html";
    }
    // window.localStorage.setItem("currentFile", currentFile);
    // let path = hash.slice(10).split("/");
    // let filename = path[path.length - 1];
    if (currentFile != "") {
      document.getElementById("currentFile").textContent = currentFile;
      database.readFile(currentFile).then(async (file) => {
        if (file === undefined) {
          console.warn(
            "IOS Incompatibiltiy, defaulting to empty strings instead of db defaults.!",
          );
        }
        let content = file === undefined ? "" : await file.content.text();

        // let content = "";
        cm.setValue(content);
        let path = currentFile.split("/");
        let nameparts = path[path.length - 1].split(".");
        if (nameparts[nameparts.length - 1] == "js") {
          cm.setOption("mode", "javascript");
        } else if (nameparts[nameparts.length - 1] == "html") {
          cm.setOption("mode", "htmlmixed");
        } else if (nameparts[nameparts.length - 1] == "css") {
          cm.setOption("mode", "css");
        } else {
          cm.setOption("mode", "");
        }
      });
    }
  };
  window.addEventListener("hashchange", hashEventHandle);

  // init db
  let request = window.indexedDB.open("FileDatabase");
  request.onerror = (event) => {
    alert(`Database error: ${event.target.errorCode}`);
  };
  request.onsuccess = (event) => {
    console.log("Database active!");
    database = new FileBase(event.target.result);
    // init currentFile
    //currentFile = currentFile || "";
    // window.location.href = `#filepath-${currentFile}`;

    // init variables
    if (window.localStorage.getItem("fileTree") == null) {
      window.localStorage.setItem("fileTree", '{"index.html": "id"}');
      database.saveFile("index.html", "<!-- Please choose a file! -->");
    }

    document.getElementById("fileTree").innerHTML = renderFiles(
      JSON.parse(window.localStorage.getItem("fileTree")),
    );

    hashEventHandle(null);
  };
  request.onupgradeneeded = FileBase.initObjectStore;

  // document.getElementById("currentFile").textContent = currentFile;
}
document.head.addEventListener("globalPageDependenciesLoaded", init);
document.head.addEventListener("globalPageDependenciesLoaded", (event) => {
  setInterval(() => {
    saveFile(event, false);
  }, 120000);
});
window.addEventListener("beforeunload", (e) => {
  saveFile(e, false);
  return "Working file saved!";
})
