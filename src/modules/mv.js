
import {resolve, join, basename} from 'path';
import fs from 'fs';


export default function mv(Dir, args, process){
     if(args.length < 2){
                  process({type: 'output', message: 'Invalid input'});
                  return
                }
    
                const firstPath = resolve(Dir, args[0]);
                const secondDir = resolve(Dir, args[1]);
                const file = join(secondDir, basename(firstPath));
    
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
                const write = fs.createWriteStream(file);
    
                read.pipe(write);
    
                read.on('error', ()=> {
    
                  process({type: 'output', message: 'Operation failed'});
                
                })
                write.on('error', ()=> {
                  process({type: 'output', message: 'Operation failed'});
                })
    
                write.on('close', ()=> {
                  fs.unlink(firstPath, (err)=> {
                    if(err){
                      process({type: 'output', message: 'Operation failed'});
                    }else{
                      process({type: 'output', message: ''});
                    }
                  })
                })
    
}