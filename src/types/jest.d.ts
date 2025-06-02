
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Mock extends Function {
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
      mockImplementation(fn?: Function): this;
      mockImplementationOnce(fn?: Function): this;
      mockReturnValue(value: any): this;
      mockReturnValueOnce(value: any): this;
      mockResolvedValue(value: any): this;
      mockResolvedValueOnce(value: any): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
    }
  }

  var describe: (name: string, fn: () => void) => void;
  var test: (name: string, fn: () => void | Promise<void>) => void;
  var it: (name: string, fn: () => void | Promise<void>) => void;
  var expect: jest.Expect;
  var beforeEach: (fn: () => void | Promise<void>) => void;
  var afterEach: (fn: () => void | Promise<void>) => void;
  var beforeAll: (fn: () => void | Promise<void>) => void;
  var afterAll: (fn: () => void | Promise<void>) => void;
}

export {};
