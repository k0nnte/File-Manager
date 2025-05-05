
import {resolve} from 'path';
import fs from 'fs/promises';

export default async function add(Dir, args, process){
    const filePath = resolve(Dir, args.join(' '));
    try{
        await fs.access(filePath);
        process({type: 'output', message: 'Invalid input'});
    }catch{
            try{
               await fs.writeFile(filePath, '', 'utf-8');
                process({type: 'output', message: ''});
            }catch{
                process({type: 'output', message: 'Operation failed'});
            }
    }
    
}