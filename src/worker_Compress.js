
function worker_compress() {
    const {parentPort, workerData} = require('worker_threads');
    const fs = require('fs');
    const zlib = require('zlib');
    const {filePath, comp, mode } = workerData;
        
   
    if(mode === 'compress'){
        const file = fs.createReadStream(filePath);
        const end = fs.createWriteStream(comp);
        const brotlic = zlib.createBrotliCompress();
        file.pipe(brotlic).pipe(end);
        end.on('finish', ()=> {
            parentPort.postMessage({status: 'ok'});
        });
    
        end.on('error', ()=> {
            parentPort.postMessage({status: 'neok'});
        })
    
        file.on('error', ()=> {
            parentPort.postMessage({status: 'neok'});
        })
    }else{
        const file = fs.createWriteStream(filePath);
        const end = fs.createReadStream(comp);
        const brotlic =  zlib.createBrotliDecompress();
        
        end.pipe(brotlic).pipe(file);
        file.on('finish', ()=> {
            parentPort.postMessage({status: 'ok'});
        });
    
        file.on('error', ()=> {
            parentPort.postMessage({status: 'neok'});
        })
    
        end.on('error', ()=> {
            parentPort.postMessage({status: 'neok'});
        })
    }

    
    
   

   
    
}

worker_compress();