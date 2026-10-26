import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {existsSync} from 'node:fs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function pythonOperation(input){
  return new Promise((resolve,reject)=>{
    const venv=path.join(root,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');
    const command=process.env.PYTHON_EXECUTABLE||process.env.CODEX_PRIMARY_RUNTIME_PYTHON||(existsSync(venv)?venv:process.platform==='win32'?'python':'python3');
    const child=spawn(command,['backend/python_service.py'],{cwd:root,stdio:['pipe','pipe','pipe'],shell:false});
    let output='',errors='';const timer=setTimeout(()=>{child.kill();reject(new Error('Python calculation timed out.'));},30000);
    child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>errors+=chunk);
    child.on('error',error=>{clearTimeout(timer);reject(error);});
    child.on('close',code=>{clearTimeout(timer);if(code!==0){const detail=errors.trim().split('\n').at(-1)??'';return reject(new Error('Python service failed. '+detail.slice(0,250)));}try{resolve(JSON.parse(output));}catch{reject(new Error('Python service returned invalid JSON.'));}});
    child.stdin.end(JSON.stringify(input));
  });
}
