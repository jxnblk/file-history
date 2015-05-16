# file-history

Returns an array of file contents based on git tags using the GitHub API.

## Getting Started

```bash
npm i file-history
```

```js
var history = require('file-history');

var config = {
  repo: 'basscss/basscss',
  filepaths: [
    '/css/basscss.css',
    '/basscss.css'
  ],
  token: GITHUB_API_ACCESS_TOKEN
}
history(config, function(arr) {
  // array of file objects
});

```

## Configuration

- `repo` - the `user/repo` to get file contents from (must have git tags)
- `filepaths` - an array of paths to check for the file. If the first one is not found, the next path in the array will be used.
- `token` - GitHub API access token - [Create a token here](https://github.com/settings/tokens)

**DO NOT** check in your access token to GitHub. Be sure to add that to your `.gitignore` file.

## Returned File Object

- `version` - Semver based on git tag (strips initial `v`)
- `filepath` - Relative path to file in the repo
- `content` - File content

---

MIT License

