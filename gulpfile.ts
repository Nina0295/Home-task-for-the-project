import { series } from 'gulp';
import * as path from 'path';
import { readdirSync, statSync, rmdirSync, rmSync, existsSync } from 'fs';
import { webpack } from 'webpack';
import { generateFilesAsync, readSourceFilesAsync } from "./src/utils";

const CONFIG_FILENAME = './input/files.json';

async function cleanEmptyFolders(folder: string) {
    const isDir = statSync(folder).isDirectory();
    if (!isDir) {
        return;
    }
    let files = readdirSync(folder);
    if (files.length > 0) {
        files.forEach((file) => {
            var fullPath = path.join(folder, file);
            cleanEmptyFolders(fullPath);
        });

        files = readdirSync(folder);
    }

    if (files.length == 0) {
        rmdirSync(folder);
        return;
    }
}

async function clean() {
    const sourceFiles = await readSourceFilesAsync(CONFIG_FILENAME);

    const outDir = path.resolve(path.dirname(CONFIG_FILENAME));

    const getFileName = (fileName: string) => path.join(outDir, fileName);

    const generatedfiles: string[] = [];
    sourceFiles.files.map((value, index, array) => {
        generatedfiles.push(getFileName(value.file));
    });
    generatedfiles.push(getFileName("webpack.config.js"));

    generatedfiles.push(path.join(outDir, sourceFiles.destination, sourceFiles.bundleName));

    generatedfiles.forEach((value, index, array) => {
        if (existsSync(value)){
            rmSync(value);
        }
    })

    cleanEmptyFolders(outDir);
}

async function build() {
    await generateFilesAsync(CONFIG_FILENAME);
}

async function bundle() {
    const webPackConfigFile = path.join(path.resolve(path.dirname(CONFIG_FILENAME)), "webpack.config.js");

    const webPackConfig = require(webPackConfigFile);

    await new Promise<void>((resolve, reject) => {
        webpack(webPackConfig, (err, status) => {
            if (status?.hasErrors()) {
                reject(new Error(status.compilation.errors.join('\n')))
            }
            else {
                resolve();
            }
        })
    });
}

exports.clean = clean;
exports.build = build;
exports.bundle = bundle;
exports.run = series(clean, build, bundle);