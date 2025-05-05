import {resolve,dirname} from 'path';
import fs from 'fs/promises';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function decompress(Dir, args, process) {
      if(args.length < 1){
                  process({type: 'output', message:'Invalid input'})
                  return;
                }
                const compres = resolve(Dir, args[0]);

                try{
                    await fs.access(compres);
                    const file = resolve(Dir, args[1] ? args[1] : '', `${args[0].slice(0, -3)}`);
                
                    const worlerPath = resolve(__dirname, '../', 'worker_Compress.js');
                    console.log(worlerPath);
                    
                    const work = new Worker(worlerPath, {
                      workerData: {filePath: file, comp: compres, mode: 'decompress'},
                    });
        
                    work.on('message', (ms)=> {
                      if(ms.status === 'ok'){
                        process({type: 'output', message:''})
                      }else{
                        process({type: 'output', message: 'Operation failed'});
                      }
                      
                    });
        
                    work.on('error', ()=> {
                      process({type: 'output', message: 'Operation failed'});
                    })
                }catch{
                    process({type: 'output', message:'Invalid input'})
                }
               
                
              
}