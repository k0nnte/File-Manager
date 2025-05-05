// import {resolve} from 'path';
import fs from 'fs/promises';

export default async function ls(Dir, process){
    try{
        const item =  await fs.readdir(Dir, { withFileTypes: true });

        const rez = item.map(i => {
          const isDir = i.isDirectory();
          return{
            name: i.name,
            type: isDir ? 'directory' : 'file',
          }
        })

        const sortItem = rez.sort((a,b)=> {
          if(a.type !== b.type){
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        } )
        console.table(sortItem)
        process({type: 'output', message: ''});

    }catch{
        process({type: 'output', message: 'Operation failed'});
    }
   
}