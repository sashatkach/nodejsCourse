import fs  from 'fs';
import  CipherStream from './cipher.js';
import { shift, action, input, output , setOutput, setInput} from './parsingConsole.js';
import { pipeline } from 'stream';
import { promisify } from 'util';
const pipelineAsync = promisify(pipeline);

function checkError()
{
    if(action === 'error action' || shift === 'error shift')
    {
        process.stderr.write('error required flags -s --shift -a --action or value of this flag isn\'t correct\n');
        process.exit(1);
    }
    try
    {
        if(!fs.existsSync(input) && !fs.existsSync(output) && input !== 'no file' && output !== 'no file')
        {
            process.stderr.write('Both of files doesn\'t exist\n');
            process.exit(2);
        }  
        else if(!fs.existsSync(input))
        {
            setInput('no file');
        }
        else if(!fs.existsSync(output))
        {
            setOutput('no file');
        } 
    }
    catch(e)
    {
        console.error(e.message);
        process.exit(3);
    }
}

function run(){
    checkError();
    const cipherStream = new CipherStream(shift, action);
    if(input === 'no file' && output === 'no file')
    {
        pipelineAsync(
            process.stdin,
            cipherStream,
            process.stdout
        )
    } 
    else if (input === 'no file')
    {
        pipelineAsync(
            process.stdin,
            cipherStream,
            fs.createWriteStream(output, {flags: 'a'})
        );
    } 
    else if(output === 'no file') 
    {
        pipelineAsync(
            fs.createReadStream(input),
            cipherStream,
            process.stdout
        );
    } 
    else
    {
        pipelineAsync(
            fs.createReadStream(input),
            cipherStream,
            fs.createWriteStream(output, {flags: 'a'})
        );
    }
}

export default run;
