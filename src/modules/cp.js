import {resolve, join, basename} from 'path';
import fs from 'fs'

export default function cp(Dir, args, process) {
     if(args.length < 2){
                  process({type: 'output', message: 'Invalid input'});
                  return
                }
    
                const firstPath = resolve(Dir, args[0]);
                const secondDir = resolve(Dir, args[1]);
                const cp = join(secondDir, basename(firstPath));
              
                if(
                  !fs.existsSync(firstPath) ||
                  !fs.statSync(firstPath).isFile() ||
                  !fs.existsSync(secondDir) ||
                  !fs.statSync(secondDir).isDirectory()
                ){
                  process({type: 'output', message: 'Invalid input'});
                  return
                }
    
                const read = fs.createReadStream(firstPath);
                const write = fs.createWriteStream(cp);
                
                read.pipe(write);
    
                write.on('close', ()=> {
                  process({type: 'output', message: ''});
                })
                write.on('error', ()=> {
                  process({type: 'output', message: 'Operation failed'});
                })
}