import fs  from 'fs';
import  CipherStream from './cipher.js';
import { shift, action, input, output , setOutput, setInput} from './parsingConsole.js';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
        .catch(error => {
            process.stderr.write('My custom permission denied of standart stream\n');
            process.exit(-1);
        });
    }
    else if (input === 'no file')
    {
        pipelineAsync(
            process.stdin,
            cipherStream,
            fs.createWriteStream(path.resolve(__dirname, output), {flags: 'a'})
        )
        .catch(error => {
            process.stderr.write('My custom permission denied on output file\n');
            process.exit(4);
        });
    }
    else if(output === 'no file')
    {
        pipelineAsync(
            fs.createReadStream(path.resolve(__dirname, input)),
            cipherStream,
            process.stdout
        )
        .catch(error => {
            process.stderr.write('My custom permission denied on input file\n');
            process.exit(5);
        });
    }
    else
    {
        pipelineAsync(
            fs.createReadStream(path.resolve(__dirname, input)),
            cipherStream,
            fs.createWriteStream(path.resolve(__dirname, output), {flags: 'a'})
        )
        .catch(error => {
            process.stderr.write('My custom permission denied of one from both files\n');
            process.exit(6);
        });
    }
}

export default run;
