import {resolve} from 'path';
import fs from 'fs';


export default function up(Dir, process){
    
      const parentDir = resolve(Dir, '..');
              if(   fs.existsSync(parentDir) &&
              fs.statSync(parentDir).isDirectory()){  
                process({type: 'cd', newDir: parentDir})
              }else{
                process({type: 'cd', newDir: Dir})
              }
};