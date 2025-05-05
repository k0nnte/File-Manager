

import {resolve, join, dirname} from 'path';
import fs from 'fs/promises'; 

export default async function rn(Dir, args, process){
     if(args.length < 2){
                  process({type: 'output', message: 'Invalid input'});
                  return;
                }
                const old = resolve(Dir, args[0]);
                const fileName = args[1];
    
                const newPath = join(dirname(old), fileName);
    
                try{
                 await fs.rename(old, newPath);
                  process({type: 'output', message: ''});
                  return
                }catch{
                  process({type: 'output', message: 'Operation failed'});
                }
}