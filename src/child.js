
import {resolve, dirname, join, basename, } from 'path'
import fs from 'fs';
import osi from '../src/modules/osi.js';
import cripty from 'crypto';
import {Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import up from './modules/up.js';
import cd from './modules/cd.js';
import ls from './modules/ls.js';
import cat from './modules/cat.js';
import add from './modules/add.js';
import mkdir from './modules/mkdir.js';
import rn from './modules/rn.js';
import cp from './modules/cp.js';
import mv from './modules/mv.js';
import rm from './modules/rm.js';
import hashi from './modules/hashi.js';
import compress from './modules/compress.js';
import decompress from './modules/decompress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function child(){
 process.on('message', ({command, Dir}) => {
   const [cmd, ...args] = command.split(' ');
    try{
        switch(cmd){
          case 'up': {
          up(Dir,process.send.bind(process));
          
    
          break;
        }
          case 'cd': {
     
            cd(Dir,args,process.send.bind(process));
            
           break; 
          }

          case 'ls': {
       
            ls(Dir,process.send.bind(process));
            break;
          }
          case 'cat': {
           
            cat(Dir, args, process.send.bind(process));
            
            break;
          }

          case 'add': {

           

            add(Dir, args, process.send.bind(process));

            break;
          }

          case 'mkdir' : {
        
         

           
            mkdir(Dir, args, process.send.bind(process));
            break;
          }

          case 'rn': {
         
            rn(Dir, args, process.send.bind(process));
            break;

          }

          case 'cp': {
          
            cp(Dir, args, process.send.bind(process));

            break;
          }

          case 'mv': {
           
            mv(Dir, args, process.send.bind(process));

            break;
          }

          case 'rm': {
           
            rm(Dir, args, process.send.bind(process));
            break;
          }

          case 'os' : {
        
          osi(args, process.send.bind(process));
           break;
          }

          case 'hash': {
           
            hashi(Dir, args, process.send.bind(process));
            break;
          }

          case 'compress': {
        
            compress(Dir, args, process.send.bind(process));

            break;
            

          }
          case 'decompress': {
    
            decompress(Dir, args, process.send.bind(process))

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