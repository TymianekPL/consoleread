const LoggingLib = require('@tymianekpl/LoggingLib');
const process = require('process');

const log = new LoggingLib({
     category: "ConsoleRead",
     writeToFile: false
});

class ConsoleRead {
     read(...args) {
          let options = {};
          let callback = null;
          if (args?.[0] instanceof Object)
               options = args[0];
          if (args?.[0] instanceof Function)
               callback = args[1];

          if (options.prefix)
               process.stdout.write(options.prefix);
          const p = new Promise((resolve) => {
               process.stdin.setEncoding('utf8');
               process.stdin.on('data', (data) => {
                    resolve(data.toString().trim());
               });
          });

          if (callback)
               p.then(callback);
          else
               return p;
     }

     get #ascii() {
          return {
               cyan: '\x1b[36m',
               green: '\x1b[32m',
               red: '\x1b[31m',
               reset: '\x1b[0m',
               white: '\x1b[37m',
               invert: '\x1b[7m',
               yellow: '\x1b[33m',
               bold: '\x1b[1m',
          };
     }

     question(...args) {
          let options = {};
          let callback = null;
          let multiple = false;

          if (args?.[0] instanceof Object)
               options = args[0];
          if (args?.[1] instanceof Function)
               callback = args[1];
          else if (args?.[1] instanceof Boolean)
               multiple = args[1];
          if (args?.[2] instanceof Function)
               callback = args[2];

          process.stdout.write(`${this.#ascii.cyan}${options.question} ${this.#ascii.green}`);
          const p = new Promise((resolve) => {
               process.stdin.setEncoding('utf8');
               process.stdin.on('data', (data) => {
                    process.stdout.write(this.#ascii.reset);
                    resolve(data.toString().trim());
               });
          });

          if (callback)
               p.then(callback);
          else
               return p;
     }

     list(...args) {
          let choices = args[0];
          let callback = null;
          let multiple = false;
          let question = "Choose ";

          if (args?.[1] instanceof Function)
               callback = args[1];
          if (typeof args?.[1] == "boolean")
               multiple = args[1];
          if (typeof args?.[1] === "string")
               question = args?.[1];
          else if (typeof args?.[2] === "boolean")
               multiple = args[2];
          if (typeof args?.[2] === "string")
               question = args?.[2];

          if (question == "Choose ")
               if (multiple)
                    question = "Choose multiple";
               else
                    question = "Choose one";


          const p = new Promise((resolve) => {
               var readline = require('readline'),
                    rl = readline.createInterface(process.stdin, process.stdout);
               var tty = require('tty');

               process.stdin.resume();
               if (tty.isatty(process.stdin.fd)) {
                    if (process.stdin.setRawMode)
                         process.stdin.setRawMode(true);
                    else
                         tty.setRawMode(true);
               } else {
                    log.error("Not a TTY");
                    process.exit(1);
               }
               var selected = 0;
               var multipleSelect = [];

               function renderChoices() {
                    choices.forEach(function (choice, i) {
                         // cyan
                         if (!multiple)
                              process.stdout.write(i === selected ? '\x1b[1m\x1b[36m' : '\x1b[0m');
                         else
                              process.stdout.write(multipleSelect.includes(i) ? '\x1b[1m\x1b[36m' : '\x1b[0m');
                         process.stdout.write("[" + (i === selected ? '*' : ' ') + "] ");
                         process.stdout.write('\x1b[0m');
                         if (!multiple) {
                              if (i === selected)
                                   process.stdout.write('\x1b[1m');
                         }
                         else
                              if (multipleSelect.includes(i))
                                   process.stdout.write('\x1b[1m');
                         process.stdout.write(choice + "\r\n");
                         // white
                         process.stdout.write(i === selected ? '\x1b[37m' : '\x1b[0m');
                    });
               }

               const up = (y) => {
                    if (y === undefined) y = 1;
                    process.stdout.write(`\x1b[${y}A`);
               };

               process.stdout.write(`${this.#ascii.yellow}${question}:\n${this.#ascii.reset}`);

               process.stdin.on('keypress', function (_s, key) {
                    if (key.name === "up" && (selected - 1) >= 0) {
                         selected--;
                    } else if (key.name === "down" && (selected + 1) < choices.length) {
                         selected++;
                    } else if (key.name == "space" && multiple) {
                         if (multipleSelect.indexOf(selected) === -1)
                              multipleSelect.push(selected);
                         else
                              multipleSelect.splice(multipleSelect.indexOf(selected), 1);
                    } else {
                         return; // don't render if nothing changed
                    }
                    process.stdout.write('\x1b[2K');
                    choices.forEach(function () {
                         up(1);
                         process.stdout.write('\x1b[2K');
                    });
                    renderChoices();
               });

               renderChoices();

               rl.on('line', () => {
                    process.stdout.write(this.#ascii.reset);
                    resolve(multiple ? multipleSelect.map(a => {
                         return choices[a];
                    }) : choices[selected]);
                    rl.close();
               }).on('close', function () {
                    rl.close();
               });
          });

          if (callback)
               p.then(callback);
          else
               return p;
     }
}

module.exports = ConsoleRead;
module.exports.default = ConsoleRead; // for ES6 imports