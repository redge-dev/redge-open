import { GithubFilesystem } from './github-filesystem';

describe('GithubFilesystem', () => {
  it('Should be able to read dir', async () => {
    const fs = new GithubFilesystem({
      token: process.env.GITHUB_TOKEN!,
      ref: 'master',
    });

    const files = await fs.readDir('./packages/frameworks');
    const readme = files.find((file) => file.name === 'README.md');
    expect(readme).toBeDefined();
  });

  it("Should throw error if an directory doesn't exist", async () => {
    const fs = new GithubFilesystem({
      token: process.env.GITHUB_TOKEN!,
      ref: 'master',
    });

    await expect(fs.readDir('./packages/random')).rejects.toThrow(
      'No directory found with the name random',
    );
  });

  it('Should be able to read file', async () => {
    const fs = new GithubFilesystem({
      token: process.env.GITHUB_TOKEN!,
      ref: 'master',
    });

    const file = await fs.readFile('./packages/frameworks/README.md');
    expect(file.toString()).toMatchSnapshot();
  });

  it('Should throw error when file is read failed', async () => {
    const fs = new GithubFilesystem({
      token: process.env.GITHUB_TOKEN!,
      ref: 'master',
    });

    await expect(
      fs.readFile('./packages/frameworks/EMDAER.md'),
    ).rejects.toThrow(
      'File EMDAER.md not found in directory packages/frameworks',
    );
  });
});
