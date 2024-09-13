importScripts("/assets/filebase.js");

var database;
var legalPaths;

// Database
let request = indexedDB.open("FileDatabase");
request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};
request.onsuccess = (event) => {
  console.log("Database active!");
  database = new FileBase(event.target.result);
  database.keys().then((result) => {
    legalPaths = result;
  });
};
request.onupgradeneeded = FileBase.initObjectStore;

// utils

async function redirect(request, url) {
  return new Response("", {
    status: 308,
    headers: {
      Location: url,
    },
  });
}

const domainName = self.location.hostname;

self.addEventListener("fetch", (event) => {
  let request = event.request;
  let url = new URL(request.url);
  console.log(request.url);
  if (domainName == url.hostname && url.pathname.startsWith("/view/")) {
    console.log("File!");
    var content = "text/plain";
    var path = url.pathname.length == 6 ? "index.html" : url.pathname.slice(6);
    if (path.endsWith("/")) {
      path = path + "index.html";
    }
    if (!path.includes(".")) {
      path = path + ".html";
    }

    if (!legalPaths.includes(path)) {
      console.log(path);
      event.respondWith(
        (async () => {
          return new Response("404 Not Found", {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        })(),
      );
      return;
    }

    if (path.endsWith(".html")) {
      content = "text/html";
    }
    if (path.endsWith(".js")) {
      content = "text/javascript";
    }
    if (path.endsWith(".css")) {
      content = "text/css";
    }
    if (path.endsWith(".json")) {
      content = "application/json";
    }

    event.respondWith(
      (async () => {
        try {
          let file = await database.readFile(path);
          return new Response(await file.content.text(), {
            headers: { "Content-Type": content },
          });
        } catch (error) {
          return new Response(error.toString(), {
            status: 500,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
      })(),
    );
  } else if (domainName == url.hostname) {
    console.log("Redirect!");
    event.respondWith(redirect(request, "/view" + url.pathname));
  } else {
    console.log("Direct!");

    //event.respondWith(fetch(request));
  }
});

// Handle messages
self.addEventListener("message", (event) => {
  console.log(`Message received: ${event.data}`);
  if (event.data["type"] === "filetreeRefresh") {
    database.keys().then((result) => {
      legalPaths = result;
    });
  }
});
