declare module "consoleread" {
     class ConsoleRead {
          constructor(options?: ConsoleReadOptions);
          read(callback: (err: Error, data: string) => void): void;
          read(): Promise<string>;
          read(options: ConsoleReadOptions): Promise<string>;
          read(options: ConsoleReadOptions, callback: (err: Error, data: string) => void): void;

          question(question: string, callback: (err: Error, data: string) => void): void;
          question(question: string): Promise<string>;
          question(question: string, options: ConsoleReadOptions): Promise<string>;
          question(question: string, options: ConsoleReadOptions, callback: (err: Error, data: string) => void): void;

          list(list: string[]): Promise<string>;
          list(list: string[], question: string): Promise<string>;
          list(list: string[], multiple: boolean): Promise<string>;
          list(list: string[], multiple: boolean, question: string): Promise<string>;
     }

     export interface ConsoleReadOptions {
          timeout?: number;
          prefix?: string;
     }

     export interface ConsoleQuestionOptions {
          timeout?: number;
          question?: string;
     }

     export = ConsoleRead;
}