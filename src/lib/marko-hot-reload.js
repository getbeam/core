import chokidar from 'chokidar';

export function register(viewPath) {
  require('marko/hot-reload').enable();

  function hotreload(file) {
    if (/\.marko$/.test(file)) {
      require('marko/hot-reload').handleFileModified(file);
    }
  }

  const watcher = chokidar.watch(viewPath);

  watcher.on('change', hotreload);
}
