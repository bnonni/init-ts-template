export type CompilerOptions = {
  target: string;
  module: string;
  moduleResolution: string;
  strict: boolean;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  esModuleInterop: boolean;
  resolveJsonModule: boolean;
  skipLibCheck: boolean;
  declarationDir: string;
  outDir: string;
}

export type TsConfig = {
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
};

export type GitUser = {
  useremail: string;
  username: string
};

export type Contributor = {
  name: string;
  url: string;
  email?: string;
};

export type LicenseObject = {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
};

export type Repository = {
  type: string;
  url: string;
}

type Exports = {
  '.' : {
    types: string;
    import: string;
    require: string;
  }
}
type Scripts = {
  wipe               : string;
  start              : string;
  clean              : string;
  build              : string;
  'build:esm'        : string;
  'build:cjs'        : string;
  'build:tests:node' : string;
  lint               : string;
  'lint:fix'         : string;
  'test:node'        : string;
  'build:test'       : string;
  'build:lint:test'  : string;
  prepublish         : string;
};

export type PackageJson = {
  name: string;
  version: string;
  type: string;
  description: string;
  main: string;
  module: string;
  types: string;
  exports : Exports;
  license: string;
  contributors: Contributor[];
  homepage: string;
  repository: Repository;
  bugs: string;
  publishConfig: { access: 'public' };
  engines: { node: '>=22.0.0' };
  keywords: string[];
  scripts: Scripts;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  pnpm?: { onlyBuiltDependencies : string[] }
};

export type TsTemplateDefaults = {
  name: string;
  module: string;
  main: string;
  types: string;
  packageManager: string;
  packageJsonFile: string;
  repository: Repository;
  version: string;
  description: string;
  license: string;
  type: string;
  homepage: string;
  bugs: string;
  contributors: Contributor[]
  keywords: string[];
  src: boolean;
};

export type PackageInitOptions = {
    skip?: boolean;
    name?: string;
    src?: boolean;
    tsconfig?: string | TsConfig;
    version?: string;
    description?: string;
    license?: string;
    type?: string;
    homepage?: string;
    contributors?: Contributor[];
    keywords?: string[];
};

export const DEFAULT_TS_CONFIG = {
  compilerOptions : {
    target            : 'ES2022',
    module            : 'NodeNext',
    moduleResolution  : 'NodeNext',
    strict            : true,
    declaration       : true,
    declarationMap    : true,
    sourceMap         : true,
    esModuleInterop   : true,
    resolveJsonModule : true,
    skipLibCheck      : true,
    declarationDir    : 'dist/types',
    outDir            : 'dist/esm',
  },
  include : ['src'],
  exclude : ['eslint.config.cjs', 'node_modules']
} as TsConfig;

export const DEFAULT_DEPENDENCIES = {
  '@eslint/js'                       : '^9.21.0',
  '@types/chai'                      : '^5.0.1',
  '@types/chai-as-promised'          : '^8.0.1',
  '@types/eslint'                    : '^9.6.1',
  '@types/mocha'                     : '^10.0.10',
  '@types/node'                      : '^22.13.8',
  '@typescript-eslint/eslint-plugin' : '^8.25.0',
  '@typescript-eslint/parser'        : '^8.25.0',
  'c8'                               : '^10.1.3',
  'chai'                             : '^5.2.0',
  'chai-as-promised'                 : '^8.0.1',
  'esbuild'                          : '^0.25.0',
  'eslint'                           : '^9.21.0',
  'eslint-plugin-mocha'              : '^10.5.0',
  'globals'                          : '^16.0.0',
  'mocha'                            : '^11.1.0',
  'mocha-junit-reporter'             : '^2.2.1',
  'node-stdlib-browser'              : '^1.3.1',
  'rimraf'                           : '^6.0.1',
  'typescript'                       : '~5.7.3',
  'typescript-eslint'                : '^8.25.0'
};

export const DEV_DEPENDENCIES = [
  '@eslint/js',
  '@types/chai',
  '@types/chai-as-promised',
  '@types/eslint',
  '@types/mocha',
  '@types/node',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'c8',
  'chai',
  'chai-as-promised',
  'esbuild',
  'eslint',
  'eslint-plugin-mocha',
  'globals',
  'mocha',
  'mocha-junit-reporter',
  'node-stdlib-browser',
  'rimraf',
  'typescript@~5.7.3',
  'typescript-eslint'
];

export const ESLINT_CONFIG_CJS = `const eslint = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const mochaPlugin = require('eslint-plugin-mocha');
const globals = require('globals');

module.exports = [
  eslint.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  {
    languageOptions: {
      parser        : tsParser,
      parserOptions : {
        ecmaFeatures : { modules: true },
        ecmaVersion  : '2022'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint' : tsPlugin,
      'mocha'              : mochaPlugin
    },
    files   : ['**/src/*.ts', '**/lib/*.ts'],
    rules: {
      'no-unsafe-optional-chaining' : 'off',
      'key-spacing'                 : [
        'error',
        {
          'singleLine': {
            'beforeColon' : false,
            'afterColon'  : true,
          },
          'multiLine': {
            'beforeColon' : true,
            'afterColon'  : true,
          },
          'align': {
            'beforeColon' : true,
            'afterColon'  : true,
            'on'          : 'colon',
            'mode'        : 'minimum'
          }
        }
      ],
      'quotes': [
        'error',
        'single',
        { 'allowTemplateLiterals': true }
      ],
      'semi'                              : ['error', 'always'],
      'indent'                            : ['error', 2, { 'SwitchCase': 1 }],
      'no-unused-vars'                    : 'off',
      'prefer-const'                      : 'off',
      '@typescript-eslint/no-unused-vars' : [
        'error',
        {
          'vars'               : 'all',
          'args'               : 'after-used',
          'ignoreRestSiblings' : true,
          'argsIgnorePattern'  : '^_',
          'varsIgnorePattern'  : '^_'
        }
      ],
      'no-dupe-class-members'                    : 'off',
      'no-trailing-spaces'                       : ['error'],
      '@typescript-eslint/no-explicit-any'       : 'off',
      '@typescript-eslint/no-non-null-assertion' : 'off',
      '@typescript-eslint/ban-ts-comment'        : 'off',
      'mocha/no-exclusive-tests'                 : 'warn',
      'mocha/no-setup-in-describe'               : 'off',
      'mocha/no-mocha-arrows'                    : 'off',
      'mocha/max-top-level-suites'               : 'off',
      'mocha/no-identical-title'                 : 'off',
      'mocha/no-pending-tests'                   : 'off',
      'mocha/no-skipped-tests'                   : 'off',
      'mocha/no-sibling-hooks'                   : 'off',
    }
  },
  {
    ignores: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.d.ts',
      '**/prototyping/*'
    ]
  }
];
`;

export const GIT_IGNORE = `# Test files
compiled

# bundle metadata
bundle-metadata.json

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

### Node Patch ###
# Serverless Webpack directories
.webpack/

# Optional stylelint cache

# SvelteKit build / generate output
.svelte-kit

# MacOS
.DS_STORE

# IntelliJ
.idea

results.xml

.tbdocs
temp

# Hermit build output
.hermit

# NPM
.npmrc
`;

export const TSCONFIG_CJS_JSON = {
  'extends'         : './tsconfig.json',
  'compilerOptions' : {
    'target'           : 'ES5',
    'module'           : 'CommonJS',
    'moduleResolution' : 'Node',
    'outDir'           : 'dist/cjs',
    'declaration'      : false,
    'declarationMap'   : false,
    'declarationDir'   : null,
  },
  'include' : [
    'src',
  ]
};

export const TESTS_TSCONFIG_JSON = {
  'extends'         : '../tsconfig.json',
  'compilerOptions' : {
    'outDir'         : 'compiled',
    'declarationDir' : 'compiled/types',
    'sourceMap'      : true,
  },
  'include' : [
    '../src',
    '.',
  ],
  'exclude' : [
    './compiled'
  ]
};

export const INDEX_SPEC_TS = `import { expect } from 'chai';
import { helloWorld } from '../src/index.js';

describe('Index Test', () => {
    it('should pass', () => {
        expect(helloWorld()).to.equal('Hello, World!');
    });
});`;

export const MOCHA_ARC_JSON = {
  'enable-source-maps' : true,
  'exit'               : true,
  'spec'               : ['tests/compiled/**/*.spec.js'],
  'timeout'            : 5000
};

export const C8RC_JSON = {
  'all'       : true,
  'cache'     : false,
  'extension' : [
    '.js'
  ],
  'include' : [
    'tests/compiled/**/src/**'
  ],
  'exclude' : [
    'tests/compiled/**/src/index.js',
    'tests/compiled/**/src/types.js',
    'tests/compiled/**/src/types/**'
  ],
  'reporter' : [
    'text'
  ]
};
