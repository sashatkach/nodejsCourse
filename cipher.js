import { Transform } from 'stream';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const deltaUpperLowerLetter = 'a'.charCodeAt() - 'A'.charCodeAt();
const alphabetLength = alphabet.length;

class CipherStream extends Transform
{
    constructor(shift, action)
    {
        super();
        this._shift = +shift;
        this._action = action;
    }

    _processStringToCipher(sourceString)
    {
        let resultString = '';
        if(this._action === 'decode')
        {
            this._shift = -this._shift;
        }
        for(let letter of sourceString)
        {
            if(alphabet.indexOf(letter) === -1 && alphabet.indexOf(String.fromCharCode(letter.charCodeAt() + deltaUpperLowerLetter)) === -1)
            {
                resultString += letter;
            }
            else
            {
                resultString += this._transferLetter(letter);
            }
        }
        return resultString;
    }

    _transferLetter(letter)
    {
        if(this._shift < 0 && letter.charCodeAt() < 'a'.charCodeAt())
        {
            const lowerLetter = String.fromCharCode(letter.charCodeAt() + deltaUpperLowerLetter);
            const encodedLetter = alphabet[(alphabet.length + alphabet.indexOf(lowerLetter) + this._shift) % alphabet.length];
            return String.fromCharCode(encodedLetter.charCodeAt() - deltaUpperLowerLetter);   
        }
        else if(this._shift < 0)
        {
            return alphabet[(alphabet.length + alphabet.indexOf(letter) + this._shift) % alphabet.length];
        }
        else if(letter.charCodeAt() < 'a'.charCodeAt())
        {
            const lowerLetter = String.fromCharCode(letter.charCodeAt() + deltaUpperLowerLetter);
            const encodedLetter = alphabet[(alphabet.indexOf(lowerLetter) + this._shift) % alphabet.length];
            return String.fromCharCode(encodedLetter.charCodeAt() - deltaUpperLowerLetter); 
        }
        else
        {
            return alphabet[(alphabet.indexOf(letter) + this._shift) % alphabet.length];
        }
    }

    _transform(chunk, enc, cb) {
        let cipherChunk = this._processStringToCipher(chunk.toString('utf-8').trim());
        this.push(cipherChunk + '\n');
        cb();
    };
}

export { alphabetLength };
export default CipherStream;