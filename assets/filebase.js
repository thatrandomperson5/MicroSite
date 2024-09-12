class FileBase {
  #idb;

  constructor(idb) {
    this.#idb = idb;
  }

  async saveFile(path, content) {
    var rcontent;
    if (content instanceof Blob) {
      rcontent = content;
      /* } else if (typeof content == "string") {
              const encoder = new TextEncoder();
              rcontent = new Blob([encoder.encode(content)]); */
    } else {
      rcontent = new Blob([content]);
    }

    let fileStore = this.#idb
      .transaction("files", "readwrite")
      .objectStore("files");

    const request = fileStore.put({
      path: path,
      content: rcontent,
      modified: Date.now(),
    });

    return await new Promise((resolve, reject) => {
      request.onerror = (event) => {
        let err = event.target.error;
        // throw err;
        return reject(err);
      };
      request.onsuccess = (event) => {
        return resolve(true);
      };
    });
  }

  async readFile(path) {
    let fileStore = this.#idb
      .transaction("files", "readonly")
      .objectStore("files");
    const request = fileStore.get(path);

    return await new Promise((resolve, reject) => {
      request.onerror = (event) => {
        // throw event.target.error;
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        resolve(request.result);
      };
    });
  }

  async deleteFile(path) {
    let fileStore = this.#idb
      .transaction("files", "readwrite")
      .objectStore("files");
    const request = fileStore.delete(path);

    return await new Promise((resolve, reject) => {
      request.onerror = (event) => {
        // throw event.target.error;
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        resolve(true);
      };
    });
  }

  async keys() {
    let fileStore = this.#idb
      .transaction("files", "readonly")
      .objectStore("files");
    const request = fileStore.getAllKeys();

    return await new Promise((resolve, reject) => {
      request.onerror = (event) => {
        // throw event.target.error;
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        resolve(request.result);
      };
    });
  }

  static initObjectStore(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("files", {
      keyPath: "path",
    });
    objectStore.createIndex("content", "content", {
      unique: false,
    });
    objectStore.createIndex("modified", "modified", {
      unique: false,
    });
  }
}
