import {resolve} from 'path';
import fs from 'fs/promises';

export default async function cd(Dir, args, process){
      const target = args.join(' ');
                const newPath = target.startsWith('/') ? resolve(target) : resolve(Dir, target);
                  try{
                        await fs.access(newPath);
                        (await fs.stat(newPath)).isDirectory();
                        process({type: 'cd', newDir: newPath})
                  }catch{
                        process({type: 'output', message:'Operation failed'})
                  }
      
}