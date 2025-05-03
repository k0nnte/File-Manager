const { resolve, dirname, join, basename } = require('path')
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
              process.send({type: 'output', message:'Operation failed'})
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
            process.send({type: 'output', message: ''});

            break;
          }
          case 'cat': {
            const filePath = resolve(Dir, args.join(' '));
            

            if(!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});
            let empty = true;
            readStream.on('data', (chunk)=> {
              empty = false;
              process.send({type: 'output', message: chunk});
            })

            readStream.on('end', ()=> {
              if(empty){
                process.send({type: 'output', message: ''});
              }
            })

            readStream.on('error', ()=> {
              process.send({type: 'output', message: 'Operation failed'});
            })
            
            
            break;
          }

          case 'add': {

            const filePath = resolve(Dir, args.join(' '));
            if(fs.existsSync(filePath)){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            fs.writeFile(filePath, '', 'utf-8', (err)=> {
              if(err){
                process.send({type: 'output', message: 'Operation failed'});
              }else{
                process.send({type: 'output', message: ''});
              }
            })

            break;
          }

          case 'mkdir' : {
        
            const dirpath = resolve(Dir, args.join(' '));

            if(fs.existsSync(dirpath)){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            try{
              fs.mkdirSync(dirpath);
              process.send({type: 'output', message: ''});
            }catch{
              process.send({type: 'output', message: 'Operation failed'});
            }

           
            
            break;
          }

          case 'rn': {
            if(args.length < 2){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }
            const old = resolve(Dir, args[0]);
            const fileName = args[1];

            const newPath = join(dirname(old), fileName);

            try{
              fs.renameSync(old, newPath);
              process.send({type: 'output', message: ''});
              break
            }catch{
              process.send({type: 'output', message: 'Operation failed'});
            }
            break;

          }

          case 'cp': {
            if(args.length < 2){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            const firstPath = resolve(Dir, args[0]);
            const secondDir = resolve(Dir, args[1]);
            const cp = join(secondDir, basename(firstPath));
          
            if(
              !fs.existsSync(firstPath) ||
              !fs.statSync(firstPath).isFile() ||
              !fs.existsSync(secondDir) ||
              !fs.statSync(secondDir).isDirectory()
            ){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            const read = fs.createReadStream(firstPath);
            const write = fs.createWriteStream(cp);
            
            read.pipe(write);

            write.on('close', ()=> {
              process.send({type: 'output', message: ''});
            })
            write.on('error', ()=> {
              process.send({type: 'output', message: 'Operation failed'});
            })

            break;
          }

          case 'mv': {
            if(args.length < 2){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            const firstPath = resolve(Dir, args[0]);
            const secondDir = resolve(Dir, args[1]);
            const file = join(secondDir, basename(firstPath));

            if(
              !fs.existsSync(firstPath) ||
              !fs.statSync(firstPath).isFile() ||
              !fs.existsSync(secondDir) ||
              !fs.statSync(secondDir).isDirectory()
            ){

              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            const read = fs.createReadStream(firstPath);
            const write = fs.createWriteStream(file);

            read.pipe(write);

            read.on('error', ()=> {

              process.send({type: 'output', message: 'Operation failed'});
            
            })
            write.on('error', ()=> {
              process.send({type: 'output', message: 'Operation failed'});
            })

            write.on('close', ()=> {
              fs.unlink(firstPath, (err)=> {
                if(err){
                  process.send({type: 'output', message: 'Operation failed'});
                }else{
                  process.send({type: 'output', message: ''});
                }
              })
            })


            break;
          }

          case 'rm': {
            const fileDel = resolve(Dir, args[0]);

            if(!fs.existsSync(fileDel) || !fs.statSync(fileDel).isFile()){
              process.send({type: 'output', message: 'Invalid input'});
              break;
            }

            fs.unlink(fileDel, (err)=> {
              if(err){
                process.send({type: 'output', message: 'Operation failed'});
                
              }else{
                process.send({type: 'output', message: ''});
                
              }
            })
            break;
          }

          default: 
          process.send({type: 'output', message:'Invalid input'})
        }
    }catch(err){
      process.send({type: 'output', message: err})
      
    }
   
    
    
 })
}

child();