const glob = require('glob');
const shelljs = require('shelljs');

const os = require('os');
const platform = os.platform() === 'darwin' ? 'os' : 'linux'

process.setMaxListeners(0);

function ObjectToShell(obj){
    let param = [];
    for(let key in obj){
        if(typeof obj[key] === 'boolean' && obj[key]){
            param.push(`-${key}`);
        } else {
            param.push(`-${key} ${obj[key]}`);
        }
    }
    return param.join(' ');
}

function fileFormart(input){
    const newfile = input.replace(/(\(\S+\))/i, '"$1"');
    return newfile;
}

function inputToOutFile(input){
    const newfile = input.replace(/\.(png|jpg|jpeg)$/i, `.webp`)
    return newfile;
}
const errList = [];

function execPromise(cwebpParams, files, cb){
    if(!files.length){
        cb();
        return;
    }
    let _f = files.pop();
    if(/\.webp/i.test(_f) === true){
        return execPromise(cwebpParams, files, cb);
    };
    const f = fileFormart(_f);
    const outfile = inputToOutFile(f);
    shelljs.exec(`${__dirname}/cwebp-${platform} ${cwebpParams} ${f} -o ${outfile}`, (code, stdout, stderr) => {
        execPromise(cwebpParams, files, cb);
        if(stderr){
            errList.push(stderr);
        }
    });
}

function loop(files, cwebpParams, cb){
    if(!files.length){
        return cb();
    }
    let f = files.pop();
    execPromise(cwebpParams, f, function(err, ret){
        loop(files, cwebpParams, cb)
    });
}
// 一维数组转换为二维数组
function arrTrans(arr, num) {
    const newArr = [];
    while(arr.length > 0) {
      newArr.push(arr.splice(0, num));
    }
    arr = [];
    return newArr;
}

module.exports = function(options = {}){
    const fileOption = options.fileOption || {};
    const cwebpParams = ObjectToShell(options.compressOption || {});
    return new Promise((resolve, reject) => {
        glob(options.path, fileOption, (err, files)=>{
            if(err){
                return reject(err)
            }
            const loopFiles = arrTrans(files, options.processNumber || 100);
            function callback(){
                if(errList.length){
                    reject(errList);
                    return;
                }
                resolve(data);
            }
            loop(loopFiles, cwebpParams, callback);
        })
    });
}