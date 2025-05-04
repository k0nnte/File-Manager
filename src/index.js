
const { homedir } = require('os');
const {  resolve } = require('path');
const { createInterface } = require('readline');
const { spawn, fork } = require('child_process');
const { fileURLToPath } = require('url');





function Main(){

    const args = process.argv.slice(2);

    const usernameArg = args.find((arg) => arg.startsWith('--username'));
    const username = usernameArg ? usernameArg.split('=')[1] : 'Username';
    


    let Dir = homedir();    
    
    console.log(`Welcome to the File Manager, ${username}!`);
    printDir();

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })

   
        const child = fork(resolve(__dirname, 'child.js'));

        rl.on('line', (input)=> {
          const command = input.trim();
          if(command === '.exit'){
            quit()
          }else{
            
            child.send({command, Dir});
          }
        })
    
        rl.on('SIGINT', quit);


        child.on('message', (data)=> {
            if(data.type === 'output'){
                if(data.message !== ''){
                    console.log(data.message);
                }
                
            }
             if(data.type === 'cd'){
                Dir = data.newDir;
               
                
            }
            printDir();
            
        })


    function printDir(){
        console.log(`You are currently in ${Dir}`);
        
    }

    function quit(){
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        child.kill();
        process.exit();
        
    }
}

Main();










