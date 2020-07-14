const glob = require('glob');
const shelljs = require('shelljs');

const os = require('os');
const platform = os.platform() === 'darwin' ? 'os' : 'linux'

function ObjectToShell(obj){
    let param = [];
    for(let key in obj){
        if(typeof obj[key] === 'boolean' && obj[key]){
            param.push(`--${key}`);
        } else {
            param.push(`--${key} ${obj[key]}`);
        }
    }
    return param.join(' ');
}

function inputToOutFile(input){
    const newfile = input.replace(/\.(png|jpg|jpeg)$/i, `.webp`)
    return newfile;
}

module.exports = function(options = {}){
    const fileOption = options.fileOption || {};
    const cwebpParams = ObjectToShell(options.compressOption || {});
    return new Promise((resolve, reject) => {
        glob(options.path, fileOption, (err, files)=>{
            if(err){
                return reject(err)
            }
            files.forEach((file) => {
                const outfile = inputToOutFile(file);
                shelljs.exec(`${__dirname}/cwebp-${platform} ${cwebpParams} ${file} -o ${outfile}`, (code, stdout, stderr) => {
                    if(stderr){
                        return reject(err);
                    }
                    resolve(stdout);
                });
            })
        })
    });
}