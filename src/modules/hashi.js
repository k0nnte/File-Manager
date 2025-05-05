import {resolve} from 'path';
import {createHash} from 'crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import { pipeline } from 'stream/promises';

export default async function  hashi(Dir, args, process){
      const file = resolve(Dir, args.join(' '));

      try{
        const stats = await fsp.stat(file);
        if (!stats.isFile()) {
          process({ type: 'output', message: 'Invalid input' });
          return;
        }

        const hash = createHash('sha256');

        await pipeline(
            fs.createReadStream(file),
            hash
          );
          const digest = hash.digest('hex');
          process({ type: 'output', message: digest });
      }catch{
        process({ type: 'output', message: 'Operation failed' });
      }
    
            
}