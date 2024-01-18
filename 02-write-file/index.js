const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit } = process;

const pathFile = path.join(__dirname, 'text.txt');
const input = readline.createInterface(stdin);
const output = fs.createWriteStream(pathFile);

stdout.write('Hi! Enter text please:\n');

const closeProcess = () => {
  stdout.write('\n Good buy! \n');
  exit();
};

input.on('line', (message) => {
  if (message === 'exit') closeProcess();
  output.write(`${message} `);
});

process.on('SIGINT', closeProcess);
