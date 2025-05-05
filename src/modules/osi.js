import os from 'os';

export default function osi (args, process){
    switch (args[0]){
                case '--EOL': {
                  const eol = JSON.stringify(os.EOL)
                  process({type: 'output', message: eol});
                  break;
                }
                case '--cpus': {
                  const cpus = os.cpus();
                  const count = cpus.length;
    
                  let rez = `Total CPUs: ${count}\n`;
    
                  cpus.forEach((cpu, index)=> {
                    rez += `CPU ${index+1}: ${cpu.model} on ${cpu.speed / 1000} GHZ\n`;
                  })
                  process({type: 'output', message: rez});
                 
                  break;
                }
                case '--homedir': {
                  const home = os.homedir();
                  process({type: 'output', message: home});
                  break;
                  
                }
                case '--username': {
                  const username = os.userInfo().username;
                  process({type: 'output', message: username});
                  break;
                }
                case '--architecture': {
                  const architecture = process.arch;
                  process({type: 'output', message: architecture});
                  break;
                }
                default:
                  process({type: 'output', message:'Invalid input'})
               }
}