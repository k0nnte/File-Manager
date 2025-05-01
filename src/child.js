const { resolve } = require('path')
const fs = require('fs');

function child(){
 process.on('message', ({command, Dir}) => {
   const [cmd, ...args] = command.split(' ');
    try{
        switch(cmd){
          case 'up': {
          const parentDir = resolve(Dir, '..');
          if(   fs.existsSync(parentDir) &&
          fs.statSync(parentDir).isDirectory()){  
            process.send({type: 'cd', newDir: parentDir})
          }else{
            process.send({type: 'cd', newDir: Dir})
          }
          break;
        }
          case 'cd': {
            const target = args.join(' ');
            const newPath = target.startsWith('/') ? resolve(target) : resolve(Dir, target);
            
            if(
              fs.existsSync(newPath) &&
              fs.statSync(newPath).isDirectory()
            ){
              process.send({type: 'cd', newDir: newPath})
            }else{
              process.send({type: 'output', massage:'Operation failed'})
            }
            
           break; 
          }

          case 'ls': {
            const item = fs.readdirSync(Dir, {withFileTypes: true});

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

            break;
          }

          default: 
          process.send({type: 'output', massage:'Invalid input'})
        }
    }catch(err){
      process.send({type: 'output', massage: err})
      
    }
   
    
    
 })
}

child();