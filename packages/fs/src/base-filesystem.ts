import { normalize, join } from 'path';
import { FileSystemStat } from './types';

/**
 * `BaseFileSystem` is an abstract class that represents a virtual filesystem.
 *
 * Its abstract method must be implemented by a subclass that perform the actual FS operation.
 * Example subclasses could be implemented as:
 *
 *  - Local filesystem, which proxies the FS operations to the equivalent `fs`
 *    module functions.
 *  - HTTP filesystem, which implements the FS operations over an HTTP server
 *    and does not require a local copy of the files.
 *  - `Files` filesystem, which operates on a virtual `Files` object (i.e. from
 *    the `glob()` function) which could include `FileFsRef`, `FileBlob`, etc.
 *
 * This base class implements various helper functions for common tasks (i.e.
 * read and parse a JSON file). It also includes caching for all FS operations
 * so that multiple functions de-dup read operations on the same file
 * to reduce network/filesystem overhead.
 *
 * **NOTE:** This implementation is inspired by the great library `@vercel/fs-detectors`.
 */
export abstract class BaseFilesystem<
  F extends FileSystemStat = FileSystemStat,
> {
  protected abstract _readDir(name: string): Promise<F[]>;
  protected abstract _readFile(name: string): Promise<Buffer>;

  protected readDirCache: Map<string, Promise<F[]>>;
  protected readFileCache: Map<string, Promise<Buffer>>;
  protected fileCache: Map<string, Promise<boolean>>;

  constructor() {
    this.readDirCache = new Map();
    this.readFileCache = new Map();
    this.fileCache = new Map();

    this.readFile = this.readFile.bind(this);
    this.readDir = this.readDir.bind(this);
  }

  /**
   * Returns a Buffer of the file.
   * @param filename The path of the file to read
   */
  public async readFile(filename: string): Promise<Buffer> {
    let c = this.readFileCache.get(filename);
    if (!c) {
      c = this._readFile(filename);
      this.readFileCache.set(filename, c);
    }
    return c;
  }

  /**
   * Returns a list of Stat objects from the current working directory.
   * @param dirPath The path of the directory to read.
   */
  public async readDir(dirPath: string) {
    let c = this.readDirCache.get(dirPath);
    if (!c) {
      c = this._readDir(dirPath);
      this.readDirCache.set(dirPath, c);
    }

    return c;
  }

  protected normalizePath(path: string): string {
    return normalize(path);
  }

  protected getEntriesFromPath(path: string): string[] {
    const normalized = this.normalizePath(path);
    const entries = normalized.split('/');
    let result: string[] = [''];
    let curr = 0;
    for (let i = 0; i < entries.length; i++) {
      result.push(join(result[curr]!, entries[i]!));
      curr++;
    }

    return result;
  }
}
