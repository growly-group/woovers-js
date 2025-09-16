#!/usr/bin/env bun

(async () => {
    console.log('Inicializando Woovers.js...');

    try{
        await import('../dist/server.js');
    } catch (error){
        console.error('Error: Falha em iniciar a aplicação');
        if (error.code === 'ERR_MODULE_NOT_FOUND'){
            console.error('O arquivo "dist/server.js" não foi encontrado. Execute o comando build.');
        }
        console.error(error);
        process.exit(1);
    }
})();