# beam

> beam core

## Install

To install the development environment, run: `npm run bootstrap`

_Note: You need to have Node.js installed locally. tbc_

## Auto-Reload

On **your local machine** (not the Vagrant Box) run: `npm run watch`

When you change a \*.js or \*.json file inside of the /app directory, it will reload Beam on the Vagrant Box.

Type `r` to reload Beam manually.  
Exit with `q` or `ctrl-c`.

**Q: What kind of sorcery is this?**  
A: When Node-Developer use auto-reloading, we usually start our apps with modules like [nodemon](https://github.com/remy/nodemon). Those modules use filesystem-events (fsevents) to capture changes and restart the node-app. This works fine for running node locally. But Beam runs inside a Virtual Machine as node-app, and the local files are shared with the Virtual Machine using nfs. **nfs doesn't support fsevents.** Instead we could use rsync to share the files, which will trigger fsevents, but this isn't the best solution either. Or we could use nodemon's polling, but this isn't really reliable and too slow to recognize changes.  
What we're doing is running a file-watcher locally on your machine and starting a ssh connection to the Vagrant Box in the background. When a local file changes, a reload will be triggered through ssh on the Vagrant Box. This is fast and reliable.
