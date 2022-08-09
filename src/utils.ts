import { readFile } from "fs";
import * as path from 'path';
import { Worker } from 'worker_threads';
import { SourceFiles } from './project-configuration';

async function createFileAsync(fileName: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './createFileWorker.js'), { workerData: { fileName: fileName, data: data } });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`stopped with  ${code} exit code`));
            }
            else {
                resolve();
            }
        });
    });
}

async function createWebpackConfigFileAsync(filesJson: SourceFiles, outDir: string) {
    const entryPoint = filesJson.files.find((item) => !!item.entry);
    if (!entryPoint) {
        throw new Error('Entry point not found!');
    }

    const webpackTemplate = 
    `const path = require('path');

    module.exports = {
        module: {
            rules: [ { use: 'ts-loader' } ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        entry: path.resolve(__dirname, "${entryPoint.file}"),
        output: {
            path: path.resolve(__dirname, "${filesJson.destination}"),
            filename: '${filesJson.bundleName}',
        }
    }`;

    const webPackConfigFileName = path.join(outDir, 'webpack.config.js');
    
    await createFileAsync(webPackConfigFileName, webpackTemplate);
}

export async function readSourceFilesAsync(sourceFileName: string): Promise<SourceFiles> {
    return new Promise<SourceFiles>((resolve, reject) => {
        readFile(sourceFileName, 'utf8', (err, data) => {
            if (err) {
                reject(err);    
            }
            else {
                return resolve(JSON.parse(data) as SourceFiles);
            }
        });
    });        
}

export async function generateFilesAsync(jsonFileName: string): Promise<void> {
    const filesInfo = await readSourceFilesAsync(jsonFileName);
    
    const outDir = path.resolve(path.dirname(jsonFileName));

    const getFileName = (fileName: string) => path.join(outDir, fileName);

    const writeFilePromises: Promise<void>[] = []; 

    filesInfo.files.map((value) => {
        writeFilePromises.push(createFileAsync(getFileName(value.file), value.content));
    });

    writeFilePromises.push(createWebpackConfigFileAsync(filesInfo, outDir));
    
    await Promise.all(writeFilePromises);
}