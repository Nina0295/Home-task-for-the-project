import { workerData } from 'worker_threads';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';

const dir = path.dirname(workerData.fileName); 
if (!existsSync(dir)){
    mkdirSync(dir, { recursive: true });
}

writeFileSync(workerData.fileName, workerData.data);