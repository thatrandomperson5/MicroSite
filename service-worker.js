importScripts("/assets/filebase.js");

var database;

// Database
let request = indexedDB.open("FileDatabase");
request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};
request.onsuccess = (event) => {
  console.log("Database active!");
  database = new FileBase(event.target.result);
};
request.onupgradeneeded = FileBase.initObjectStore;

// utils

async function redirect(request, url) {
  return new Response("", {
    "status": 308,
    "headers": {
      "Location": url
    }
  });
}

const domainName = self.location.hostname;

self.addEventListener("fetch", (event) => {
  
  let request = event.request;
  let url = new URL(request.url);
  console.log(request.url);
  if (domainName == url.hostname && url.pathname.startsWith("/view/")) {
    console.log("File!");

    var path = url.pathname.slice(6);
    if (path.endsWith("/") || path.length == 0) {
      path = path + "/index.html";
    }
    event.respondWith((async () => {
      try {
        let file = await database.readFile(path);
        return new Response(await file.content.text());
      } catch (error) {
        return new Response(error.toString(), {"status": 404});
      }
    })());
  } else if (domainName == url.hostname) {
    console.log("Redirect!");
    event.respondWith(redirect(request, "/view" + request.url));
  } else {
    console.log("Direct!");

    //event.respondWith(fetch(request));
  }
});
