# Task

Create a project somewhere in remote storage, for example: https://github.com/, and provide a link.

## Create an application with Node.js and TypeScript

- Code should be created with TS 3.9+ and Node.js 16.15+

- The application must read `files.json` and create the source files, specified in the config.
- Nice to have: source files should be generated in parallel mode, one file in a single thread/process. Please use Node.JS API only - without external libraries. You can consider child_process/worker_threads/cluster. 
    ```json
        //Note: all paths are relative to `files.json`
        {
            "destination": "", // out folder for webpack bundle, relative path
            "bundleName": "", // name of webpack bundle
            "files": [
                {
                    "file": "", // relative path, name of the file
                    "content": "", // file content
                    "entry": true // optional (by default is false) - specifies if it is an entry point for Webpack.
                    // Note: Webpack may has several entry points.  
                }
            ]
        }
    ```

## Webpack bundle

- Create webpack JS bundle based on generated .ts files
- Create `webpack.config.js` which will generate js bundle, using settings from files.json.
    Try to create a function, which automatically builds webpack configuration with settings from files.json

## Build tasks

- Create `gulp` tasks;
  - `gulp clean` - delete generated files and bundles
  - `gulp build` - to run the application and generation of `.ts` files.
  - `gulp bundle` - to run webpack and generating `.js` bundle
  - `gulp run` - to run all previous tasks

- Add `npm build` script which will do the same as `gulp run` task

- Add a PowerShell script which will remove `node_modules` and run `npm install`
