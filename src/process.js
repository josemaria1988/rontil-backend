import Command from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'production')
    .requireOption('-u <user>', 'Usuario utilizando el aplicativo', 'No se a declarado un usuario')
    .option('-l, --letters [letters...]', 'specify letters')

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);
