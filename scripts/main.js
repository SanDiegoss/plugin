import {createEvents} from './visualEvents.js'

let image = document.createElement('img');

/* Drag n Drop */

let dropArea = document.getElementById("drop-area");
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')

const context = CANVAS.getContext('2d');

createEvents(dropArea);

let imagePreview = function drawImageOnDisplay(){
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(this, 0, 0, CANVAS.width, CANVAS.height);
};

/**
 * @param {DragEvent} event 
 */
let handleFiles = function handleFilesFromForm(event){
    let files = event.dataTransfer.files;
    if(files.length > 1) {
        console.error("Too many files!");
        throw new Error('Only 1 file, please.');
    }
    let file = files.item(0);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        image.src = reader.result;
        image.onload = imagePreview;
    }
}

dropArea.addEventListener('drop', handleFiles, false);

let lulz = async function lul(){
    let module = await Module();

    var h = 2;
    var w = 3;
    var size = h * w * 4;
    var data = new Uint8ClampedArray(size);
    for(let i = 0; i < size; i += 4)
        for(let j = 0; j < 4; j++)
            data[i + j] = j + 1;

    // ptr для JS, ptr_ для wasm
    let [ptr, ptr_] = allocateMemory(module, size);
    setMemory(module, data, ptr_)

    console.log('JS print:')
    for(let i = 0; i < size; i++) console.log(ptr[i]);

    module._print(ptr_, h, w);

    freeMemory(module, ptr_);
    return 123;
}();

// allocate memory for wasm, returns pointer
function allocateMemory(module, length)
{
    var ptr = module._malloc(length);
    return [new Uint8ClampedArray(module.HEAP8.buffer, ptr, length), ptr];
}

// free memory
function freeMemory(module, ptr)
{
    module._free(ptr);
}

// fill memory
function setMemory(module, data, ptr)
{
    module.HEAP8.set(data, ptr);
}
