
import {resolve} from 'path';
import fs from 'fs';

export default function cat(Dir, args, process){
     const filePath = resolve(Dir, args.join(' '));
                
        if(!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()){
                  process({type: 'output', message: 'Invalid input'});
                }
      
        const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});
        
        let empty = true;
        readStream.on('data', (chunk)=> {
          empty = false;
          process({type: 'output', message: chunk});
        })

        readStream.on('end', ()=> {
          if(empty){
            process({type: 'output', message: ''});
          }
        })

        readStream.on('error', ()=> {
          process({type: 'output', message: 'Operation failed'});
        })
     
    
              
    
             
}