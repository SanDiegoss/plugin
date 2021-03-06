/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
'use strict';

(function(window){
    window.ImageEffects = window.ImageEffects || {};
    window.ImageEffects.isReady = false;
    window.ImageEffects.Apply = function() {
        console.log('Module is not ready');
    };

    window.ImageEffects.onLoadModule = function(exports) {
        window.ImageEffects.isReady = true;
        window.ImageEffects.Apply = exports.ApplyEffect;
    };
    // Точка входа из main.js
    window.ImageEffects.loadModule = function(settings) {
        let url = settings.enginePath ? settings.enginePath : './effects-core/deploy/engine/';

        let useWasm = false;
        const webAsmObj = window['WebAssembly'];
        if (typeof webAsmObj === 'object') {
            if (typeof webAsmObj['Memory'] === 'function') {
                if ((typeof webAsmObj['instantiateStreaming'] === 'function') || (typeof webAsmObj['instantiate'] === 'function')) {
                    useWasm = true;
                }
            }
        }
        url += (useWasm ? 'effects.js' : 'effects_ie.js');
        // eslint-disable-next-line no-var
        if (isWorker){
            const worker = new Worker(url);
            /**
             * @typedef {Object} Effect
             * @property {String} type
             * @property {Number} level
             * @param {Array<Effect>} effects
             * @param {Uint8ClampedArray} data
             */
            function ApplyEffect(effects, data){
                worker.postMessage({effects: effects, data: data});
            }
            worker.onmessage = function(e) {
                if (e.data == 'module is ready'){
                    console.log('WebWorkers will be used');
                    ImageEffects.onLoadModule({ApplyEffect: ApplyEffect});
                    console.log((useWasm ? 'wasm' : 'asmjs') + ' module will be used');
                    worker.onmessage = function(e){
                        effectImageData.data.set(e.data.data);
                        effectContext.putImageData(effectImageData, 0, 0);
                    };
                } else {
                    throw new Error('Unknown message from worker:' + url);
                }
            };
        } else {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function() {
                console.log('default script will be used');
                console.log((useWasm ? 'wasm' : 'asmjs') + ' module will be used');
            };
            script.onerror = function() {
                // TODO: попробовать загрузить еще сколько-то раз (максимальное число попыток  - зашито в коде - например 5)
            };
            document.head.appendChild(script);
        }
    };
})(self);
