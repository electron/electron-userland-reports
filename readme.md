# electron-userland-reports

Slices of data about packages, repos, and users in Electron userland. Collected from the GitHub API, npm registry, and libraries.io

## Related Packages

- [all-the-package-repos](https://github.com/zeke/all-the-package-repos): All the repository URLs in the npm registry as an object whose keys are package names and values are URLs
- [all-the-packages](https://github.com/zeke/all-the-packages): All the npm registry metadata as an offline event stream.
- [electron-npm-packages](https://github.com/zeke/electron-npm-packages): A collection of all npm packages that mention `electron` in their package.json
- [fetch-nice-package](https://github.com/hemanth/fetch-nice-package): fetch cleaned package metadata from the npm registry.
- [nice-package](https://github.com/zeke/nice-package): Clean up messy package metadata from the npm registry
- [repos-using-electron](https://github.com/electron/repos-using-electron): A collection of all public repositories on GitHub that depend on `electron-prebuilt`

## Installation

```sh
npm install electron-userland-reports --save
```

## Usage

```
const reports = require('electron-userland-reports')
```

...or find the raw JSON output in the [/reports](reports) directory.

## Tests

```sh
npm install
npm test
```

## Dependencies

None

## Dev Dependencies

- [all-the-package-repos](https://github.com/zeke/all-the-package-repos): All the repository URLs in the npm registry as an object whose keys are package names and values are URLs
- [all-the-packages](https://github.com/zeke/all-the-packages): All the npm registry metadata as an offline event stream.
- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [count-array-values](https://github.com/zeke/count-array-values): Count the instances of each value in an array
- [electron-npm-packages](https://github.com/zeke/electron-npm-packages): A collection of all npm packages that mention `electron` in their package.json
- [fetch-nice-package](https://github.com/hemanth/fetch-nice-package): fetch cleaned package metadata from the npm registry.
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [nice-package](https://github.com/zeke/nice-package): Clean up messy package metadata from the npm registry
- [repos-using-electron](https://github.com/electron/repos-using-electron): A collection of all public repositories on GitHub that depend on `electron-prebuilt`
- [revalidator](https://github.com/flatiron/revalidator): A cross-browser / node.js validator powered by JSON Schema
- [standard](https://github.com/feross/standard): JavaScript Standard Style

## License

MIT
