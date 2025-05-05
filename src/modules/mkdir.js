
import {resolve} from 'path';
import fs from 'fs/promises';

export default async function mkdir(Dir, args, process){
   const dirpath = resolve(Dir, args.join(' '));

    try{
      await  fs.access(dirpath);
      process({type: 'output', message: 'Invalid input'});
    }catch{
        try{
           await fs.mkdir(dirpath)
           process({type: 'output', message: ''});

        }catch{
            process({type: 'output', message: 'Operation failed'});
        }
    }
 
         
 
            
}