import {resolve} from 'path';
import fs from 'fs/promises';

export default async function rm(Dir, args, process){
     const fileDel = resolve(Dir, args[0]);
  
     

    try{
       await fs.access(fileDel)
       const stats = await fs.stat(fileDel);

       if (!stats.isFile()) {
        process({ type: 'output', message: 'Invalid input' });
        return;
      }
        
       try{
        await fs.unlink(fileDel);
        process({type: 'output', message: ''});

       }catch{
        process({type: 'output', message: 'Operation failed'});
       }



    }catch{
        process({type: 'output', message: 'Invalid input'});
        
    }
    

}