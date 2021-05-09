import { alphabetLength } from './cipher.js';

const PERMITTED_FLAGS = {shift: ['-s', '--shift'], action: ['-a', '--action', ], input: ['-i', '--input'], output: ['-o', '--output']};

const idxShift = process.argv.indexOf(PERMITTED_FLAGS.shift[0]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.shift[0]) : process.argv.indexOf(PERMITTED_FLAGS.shift[1]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.shift[1]) : 'error shift';
let shift = idxShift !== 'error shift' && Number.isInteger(+process.argv[idxShift + 1]) ? process.argv[idxShift + 1] : 'error shift';

if(Math.abs(shift) >= alphabetLength / 2)
{
    shift %= (alphabetLength / 2);
}

const idxAction = process.argv.indexOf(PERMITTED_FLAGS.action[0]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.action[0]) : process.argv.indexOf(PERMITTED_FLAGS.action[1]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.action[1]) : 'error action';
const action = idxAction !== 'error action' && ['encode', 'decode'].includes(process.argv[idxAction + 1]) ? process.argv[idxAction + 1] : 'error action';

const inputShift = process.argv.indexOf(PERMITTED_FLAGS.input[0]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.input[0]) : process.argv.indexOf(PERMITTED_FLAGS.input[1]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.input[1]) : 'no file';
let input = inputShift !== 'no file' ? process.argv[inputShift + 1] : 'no file';

const outputShift = process.argv.indexOf(PERMITTED_FLAGS.output[0]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.output[0]) : process.argv.indexOf(PERMITTED_FLAGS.output[1]) !== -1 
    ? process.argv.indexOf(PERMITTED_FLAGS.output[1]) : 'no file';
let output = outputShift !== 'no file' ? process.argv[outputShift + 1] : 'no file';


function setInput(newInput)
{
    input = newInput;
}

function setOutput(newOutput)
{
    output = newOutput;
}

export {
    shift, action, input, output, setInput, setOutput
};