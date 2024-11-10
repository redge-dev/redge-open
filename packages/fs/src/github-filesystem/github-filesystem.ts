import path from 'path';
import { BaseFilesystem } from '../base-filesystem';
import { FileSystemStat } from '../types';

type GithubTreeNode = {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
};

type GithubTreeResponse = {
  tree: GithubTreeNode[];
};

export type GithubFilesystemStat = FileSystemStat<GithubTreeNode>;

export type GithubFilesystemProps = {
  /**
   * Github access token
   */
  token: string;
  /**
   * Git ref (could be a branch or a tag) to make the file traverse.
   */
  ref: string;
  /**
   * Root of the FS
   */
  root?: string;
};

/**
 * `GithubFilesystem` is a class that represents a virtual filesystem
 * for a Github repository using Github API.
 */
export class GithubFilesystem extends BaseFilesystem<GithubFilesystemStat> {
  private root: string;
  private token: string;
  private ref: string;

  constructor({ token, ref, root = '' }: GithubFilesystemProps) {
    super();
    this.token = token;
    this.ref = ref;
    this.root = root;
  }

  private async getRootSha() {
    const {
      commit: { sha },
    } = await this.makeRequest<{ commit: { sha: string } }>(
      `https://api.github.com/repos/redge-dev/redge-open/branches/${this.ref}`,
    );
    return sha;
  }

  private getFilePath(name: string) {
    return path.join(this.root, name);
  }

  private async makeRequest<T>(input: RequestInfo | URL): Promise<T> {
    try {
      const result = await fetch(input, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return result.json();
    } catch (err) {
      console.error(`Failed to request to ${input}.`);
      console.error(err);
      throw err;
    }
  }

  protected async _readDir(sha: string): Promise<GithubFilesystemStat[]> {
    try {
      const { tree } = await this.makeRequest<GithubTreeResponse>(
        `https://api.github.com/repos/redge-dev/redge-open/git/trees/${sha}`,
      );

      return tree.map((node) => ({
        name: node.path,
        path: this.getFilePath(node.path),
        type: node.type === 'blob' ? 'file' : 'dir',
        metadata: {
          ...node,
        },
      }));
    } catch (err) {
      console.error(`Failed to get the directory with sha: ${sha}`);
      console.error(err);
      throw err;
    }
  }

  /**
   * `readDir` recursively reads all the entry in the path.
   * @param dirPath The path of the directory to read
   * @returns
   */
  public async readDir(dirPath: string): Promise<GithubFilesystemStat[]> {
    const normalizedPath = this.normalizePath(dirPath);
    const entries = this.getEntriesFromPath(dirPath);

    let c = this.readDirCache.get(dirPath);
    if (c) {
      return c;
    }

    /**
     * Recursively reads all the directory entries.
     */
    for (const entry of entries) {
      if (entry === this.root && !this.readDirCache.has(entry)) {
        const sha = await this.getRootSha();
        const c = this._readDir(sha);
        this.readDirCache.set(entry, c);
        continue;
      }

      if (entry !== this.root && !this.readDirCache.has(entry)) {
        const dirName = entry.split('/').at(-1);
        const prefixes = this.getEntriesFromPath(entry).at(-2);
        if (typeof dirName !== 'string' || typeof prefixes !== 'string') {
          throw new Error(`Failed to read the directory ${entry}`);
        }

        const rootDir = await this.readDirCache.get(prefixes);
        if (!rootDir) {
          throw new Error(
            `Failed to read the directory: Root directory has been read yet.`,
          );
        }

        const dirStat = rootDir.find(
          (dir) => dir.name === dirName && dir.type === 'dir',
        );
        if (!dirStat) {
          throw new Error(`No directory found with the name ${dirName}`);
        }

        const c = this._readDir(dirStat.metadata.sha);
        this.readDirCache.set(entry, c);
      }
    }

    const result = await this.readDirCache.get(normalizedPath);
    if (!result) {
      throw new Error(`Failed to read the directory ${normalizedPath}`);
    }

    return result;
  }
}
