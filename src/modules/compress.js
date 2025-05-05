import {resolve,dirname} from 'path';
import fs from 'fs/promises';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function compress(Dir, args, process) {
    if(args.length < 1){
                  process({type: 'output', message:'Invalid input'})
                  return
                }
                const file = resolve(Dir, args[0]);
                
                const comp = resolve(Dir, args[1] ? args[1] : '', `${args[0]}.br`);
                
                
                try{
                  
                    await fs.access(file)
                    
                      const worlerPath = resolve(__dirname, '../', 'worker_Compress.js');
                      const work = new Worker(worlerPath, {
                        workerData: {filePath: file, comp, mode: 'compress'},
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