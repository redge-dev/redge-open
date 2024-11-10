export type FileSystemStat<M extends unknown = Record<string, unknown>> = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  metadata: M;
};
