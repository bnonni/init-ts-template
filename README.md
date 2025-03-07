# Init TS Template

TypeScript project template initializer. Like `npm init` but for TS. Includes robust configuration for tsconfig.
Requires node >= v22.0.0

## Installation

1. [Package Manager](#package-manager)
2. [Package Executor](#package-executor)

### Package Manager

* Globally installs using `pnpm`, `npm` or `yarn`
* Pick your preferred package manager to install the cli globally.

```sh
# pnpm
pnpm i -g init-ts-template
# npm
npm i -g init-ts-template
# yarn
yarn global add init-ts-template
```

### Package Executor

* Downloads and executes using `pnpx`, `npx` or `yarn dlx`
* Pick your preferred package executor to run the cli with `--name {INSERT_NAME}` and follow the terminal prompts.

```sh
# pnpx
pnpx init-ts-tempalte --name my-ts-project 
# npx
npx init-ts-tempalte --name my-ts-project
# yarn dlx
yarn dlx init-ts-tempalte --name my-ts-project
```

## Usage

* Run the `init-ts-template` CLI.
* Use the flag `-n/--name {YOUR_PROJECT_NAME}` to provide a custom project name.
* Follow the terminal prompts.
* The CLI takes lots of arguments. Checkout [cli.ts](/src/cli.ts) and [ts-template.ts](/src/ts-template.ts) for all options.

```sh
init-ts-template --name my-ts-project
```

## Quick Install

* To skip the prompts and install a new default project template in one line, use `-s` or `--skip`.
* If name not provided using `-n my-ts-project` or `--name my-ts-project`, cli tool will create a new folder called `TBD`
* Before using `skip`, check out the [project defaults](https://github.com/bnonni/init-ts-template/blob/aff0c9c13c2dc9185a09ad5612782418a921eec1/src/ts-template.ts#L39)
to make sure you are okay with those settings. Specifically, the `tsconfig.json` setup:
    * ESM [tsconfig.json](https://github.com/bnonni/init-ts-template/blob/aff0c9c13c2dc9185a09ad5612782418a921eec1/src/types.ts#L125)
    * CommonJS [tsconfig.cjs.json](https://github.com/bnonni/init-ts-template/blob/aff0c9c13c2dc9185a09ad5612782418a921eec1/src/types.ts#L450)

```sh
# Default "TBD"
# pnpx
pnpx init-ts-tempalte --skip
# npx
npx init-ts-tempalte --skip
# yarn dlx
yarn dlx init-ts-tempalte --skip

# Custom name "my-ts-project"
# pnpx
pnpx init-ts-tempalte --skip --name my-ts-project
# npx
npx init-ts-tempalte --skip --name my-ts-project
# yarn dlx
yarn dlx init-ts-tempalte --skip --name my-ts-project
```

```sh

# pnpx

# npx

# yarn dlx

```

## Default Settings

* TODO: Provide a detailed breakdown of all the default project settings