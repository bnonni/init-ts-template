import Logger from '@bnonni/logger';
import * as Inquirer from '@inquirer/prompts';
import { execSync } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { SOFTWARE_LICENSES } from './constants.js';
import {
  C8RC_JSON,
  DEFAULT_DEPENDENCIES,
  DEFAULT_TS_CONFIG,
  GIT_IGNORE,
  GitUser,
  INDEX_SPEC_TS,
  LicenseObject,
  MOCHA_ARC_JSON,
  PackageInitOptions,
  PackageJson,
  ProjectDefaults,
  TESTS_TSCONFIG_JSON,
  TsConfig,
  TSCONFIG_CJS_JSON,
} from './types.js';

/**
 * TODO: Redesign code architecture to be more flexible and reusable
 * TODO: Add constructor to class and use it in the cli call
 * TODO: Add support for loading all project details from a local file
 * TODO: Add more cli options for generating project files and folders
 *
 * A class for generating a new TypeScript project
 * @class TsTemplate
 * @type {TsTemplate}
 */
class TsTemplate {
  /**
   * The default project details used to the skip flow
   * @static
   * @type {ProjectDefaults} The default project details
   */
  public static projectDefaults: ProjectDefaults = {
    name            : 'TBD',
    version         : '0.1.0',
    description     : 'TBD',
    license         : 'Unlicense',
    src             : true,
    type            : 'module',
    homepage        : 'TBD',
    repository      : { type: 'git', url: 'TBD' },
    bugs            : 'TBD',
    contributors    : [{ name: 'TBD', email: 'TBD', url: 'TBD'}],
    keywords        : [],
    module          : './dist/esm/index.js',
    main            : './dist/cjs/index.js',
    types           : './dist/types/index.d.ts',
    packageManager  : 'pnpm',
    packageJsonFile : 'pnpm-lock.yaml',
  };


  /**
   * Get the git user details from the gitconfig file
   * @static
   * @async
   * @returns {Promise<GitUser>} A promise that resolves with the git user details
   */
  static async getGitConfigUser(): Promise<GitUser> {
    const gitconfig = await readFile(`${process.env.HOME}/.gitconfig`, 'utf-8');
    const gitconfigUserEmail = gitconfig.match(/(email = .*)/g)?.[0] ?? 'email =';
    const gitconfigUserName = gitconfig.match(/(name = .*)/g)?.[0] ?? 'name =';
    const useremail = gitconfigUserEmail.split('=')[1].trim() ?? '';
    const username = gitconfigUserName.split('=')[1].trim() ?? '';
    return { useremail, username };
  }


  /**
   * Build the tsconfig.json file
   * @static
   * @async
   * @param {TsConfig} tsconfig The tsconfig.json file
   * @returns {Promise<TsConfig>} A promise that resolves with the tsconfig.json file
   */
  static async buildTsConfig(tsconfig: TsConfig): Promise<TsConfig> {
    Logger.info('---------- build tsconfig.json ----------');
    let useDefaults;
    do {
      useDefaults = await Inquirer.select({
        message : 'Would you like to use project defaults for tsconfig.json?',
        choices : ['Yes', 'No', 'Show'],
        default : 'Yes',
      });
      if (useDefaults === 'Yes') {
        Logger.info('Using tsconfig.json defaults:', DEFAULT_TS_CONFIG);
        return DEFAULT_TS_CONFIG;
      } else if (useDefaults === 'Show') {
        Logger.info('tsconfig.json defaults:', DEFAULT_TS_CONFIG);
      }
    } while (useDefaults === 'Show');

    tsconfig.compilerOptions.target = await Inquirer.select({
      message : 'Compiler Option: target',
      choices : [
        'ES5',
        'ES6',
        'ES2015',
        'ES2016',
        'ES2017',
        'ES2018',
        'ES2019',
        'ES2020',
        'ES2021',
        'ES2022',
        'ES2023',
        'ESNext',
      ],
      default : tsconfig.compilerOptions.target,
    });

    tsconfig.compilerOptions.module = await Inquirer.select({
      message : 'Compiler Option: module',
      choices : [
        'CommonJS',
        'ES6',
        'ES2015',
        'ES2020',
        'ES2022',
        'ESNext',
        'Node16',
        'NodeNext'
      ],
      default : tsconfig.compilerOptions.target === 'ES5'
        ? tsconfig.compilerOptions.module
        : 'ES2015',
    });

    tsconfig.compilerOptions.moduleResolution = await Inquirer.select({
      message : 'Compiler Option: moduleResolution',
      choices : [
        'Classic',
        'Node',
        'Node16',
        'ES2022',
        'NodeNext',
        'Bundler',
      ],
      default : ['ES6', 'ES2015'].includes(tsconfig.compilerOptions.module)
        ? 'Classic'
        : ['Node16', 'NodeNext'].includes(tsconfig.compilerOptions.module)
          ? tsconfig.compilerOptions.module
          : 'Node'
    });

    tsconfig.compilerOptions.strict = await Inquirer.select({
      message : 'Compiler Option: enable strict mode?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.declaration = await Inquirer.select({
      message : 'Compiler Option: Generate declaration files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.declarationMap = await Inquirer.select({
      message : 'Compiler Option: Generate declaration map files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.sourceMap = await Inquirer.select({
      message : 'Compiler Option: Generate source map files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.esModuleInterop = await Inquirer.select({
      message : 'Compiler Option: esModuleInterop?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.resolveJsonModule = await Inquirer.select({
      message : 'Compiler Option: resolveJsonModule?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.skipLibCheck = await Inquirer.select({
      message : 'Compiler Option: skipLibCheck?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    tsconfig.compilerOptions.declarationDir = await Inquirer.input({
      message : 'Compiler Option: declarationDir',
      default : tsconfig.compilerOptions.declarationDir,
    });

    tsconfig.compilerOptions.outDir = await Inquirer.input({
      message : 'Compiler Option: outDir',
      default : tsconfig.compilerOptions.outDir,
    });

    tsconfig.exclude = tsconfig.exclude ?? await Inquirer.input({
      message : 'TSConfig Option: exclude',
      default : `[${DEFAULT_TS_CONFIG.exclude.join(', ')}]`,
    });

    tsconfig.include = tsconfig.include ?? await Inquirer.input({
      message : 'TSConfig Option: exclude',
      default : `[${DEFAULT_TS_CONFIG.include.join(', ')}]`,
    });

    return tsconfig;
  }


  /**
   * Check if a string is parsable JSON
   * @static
   * @param {string} str The string to check
   * @returns {boolean} A boolean indicating if the string is parsable JSON
   */
  static parsable(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load the tsconfig.json file
   * @static
   * @async
   * @param {?string} tsconfig A file path to the tsconfig.json file or an object with the tsconfig.json content
   * @returns {Promise<TsConfig>} A promise that resolves with the tsconfig.json content
   */
  static async loadTsConfig(tsconfig?: string): Promise<TsConfig> {
    // Return default tsconfig.json if no tsconfig is passed
    if(!tsconfig) return DEFAULT_TS_CONFIG;
    try {
      // Check if tsconfig is a parsable json string
      const data = this.parsable(tsconfig)
      // If tsconfig is a file path, set data to the file content
        ? JSON.parse(await readFile(tsconfig, 'utf-8'))
        // If tsconfig is a parsable json string, set data to the tsconfig
        : tsconfig;
        // Parse and return the tsconfig.json content
      return JSON.parse(data) as TsConfig;
    } catch (error: any) {
      // Log error message
      throw new Error(`Failed to load tsconfig from file, using default: ${error.message}`);
    }
  }

  /**
   * Get the content for the package.json file
   * @static
   * @returns {Record<string, any>} The content for the package.json file
   */
  static getPackageJson(): PackageJson {
    const {
      name,
      version,
      type,
      description,
      main,
      types,
      module,
      license,
      contributors,
      homepage,
      repository,
      bugs,
      keywords,
      packageJsonFile,
      packageManager
    } = this.projectDefaults;

    return {
      name,
      version,
      type,
      description,
      main,
      module,
      types,
      exports : {
        '.' : {
          types,
          import  : module,
          require : main
        }
      },
      license       : SOFTWARE_LICENSES.get(license ?? 'Unlicense') ?? 'The Unlicense',
      contributors,
      homepage,
      repository,
      bugs,
      publishConfig   : { access: 'public' },
      engines         : { node: '>=22.0.0' },
      keywords,
      scripts         : {
        wipe               : `rimraf node_modules ${packageJsonFile}`,
        start              : `node ${main}`,
        clean              : 'rimraf dist coverage tests/compiled',
        build              : `${packageManager} clean && ${packageManager} build:esm && ${packageManager} build:cjs`,
        'build:esm'        : `rimraf dist/esm dist/types && ${packageManager} tsc -p tsconfig.json`,
        'build:cjs'        : 'rimraf dist/cjs && tsc -p tsconfig.cjs.json && echo \'{"type": "commonjs"}\' > ./dist/cjs/package.json',
        'build:tests:node' : `rimraf tests/compiled && ${packageManager} tsc -p tests/tsconfig.json`,
        lint               : 'eslint . --max-warnings 0',
        'lint:fix'         : 'eslint . --fix',
        'test:node'        : `${packageManager} build:tests:node && ${packageManager} c8 mocha`,
        'build:test'       : `${packageManager} build && ${packageManager} build:tests:node && ${packageManager} test:node`,
        'build:lint:test'  : `${packageManager} build && ${packageManager} build:tests:node && ${packageManager} lint:fix`,
        prepublish         : `${packageManager} build`
      },
      dependencies    : {},
      devDependencies : DEFAULT_DEPENDENCIES,
      pnpm            : {
        onlyBuiltDependencies : [
          'esbuild'
        ]
      }
    };
  }


  /**
   * Generate the file and folder structure for a new TypeScript project
   * @static
   * @async
   * @param {Record<string, any>} packageJsonContent The content for the package.json file
   * @returns {Promise<void>} A promise that resolves when the file and folder structure has been generated
   */
  static async generateFileFolderStructure(packageJsonContent: Record<string, any>): Promise<void> {
    const { name, src, description, license, packageManager } = this.projectDefaults;
    // Create package directory
    const srcDir = src! ? `${name!}/src` : name!;
    await mkdir(srcDir, { recursive: true });

    // Write index.ts file
    await writeFile(`${srcDir}/index.ts`, 'export function helloWorld() { return \'Hello, World!\'; }');
    Logger.info('Generated index.ts');

    // Write package.json
    await writeFile(`${name}/package.json`, JSON.stringify(packageJsonContent, null, 2));
    Logger.info('Generated package.json');

    // Write tsconfig.json
    await writeFile(`${name}/tsconfig.json`, JSON.stringify(DEFAULT_TS_CONFIG, null, 2));
    Logger.info('Generated tsconfig.json');

    await writeFile(`${name}/tsconfig.cjs.json`, JSON.stringify(TSCONFIG_CJS_JSON, null, 2));
    Logger.info('Generated tsconfig.cjs.json');

    // Create tests directory
    await mkdir(`${name}/tests`, { recursive: true });
    Logger.info('Generated tests');

    // Write tests/tsconfig.json
    await writeFile(`${name}/tests/tsconfig.json`, JSON.stringify(TESTS_TSCONFIG_JSON, null, 2));
    Logger.info('Generated tests/tsconfig.json');

    // Write tests/index.spec.ts
    await writeFile(`${name}/tests/index.spec.ts`, INDEX_SPEC_TS);
    Logger.info('Generated tests/index.spec.ts');

    // Write .c8rc.json
    await writeFile(`${name}/.c8rc.json`, JSON.stringify(C8RC_JSON, null, 2));
    Logger.info('Generated .c8rc.json');

    // Write .mocharc.json
    await writeFile(`${name}/.mocharc.json`, JSON.stringify(MOCHA_ARC_JSON, null, 2));
    Logger.info('Generated .mocharc.json');

    // Write .gitignore
    await writeFile(`${name}/.gitignore`, GIT_IGNORE);
    Logger.info('Generated .gitignore');

    // Write README.md
    await writeFile(`${name}/README.md`, `# ${name}\n\n${description}`);
    Logger.info('Generated README.md');

    // Write LICENSE
    const licenses = await fetch('https://api.github.com/licenses');
    const data: Array<LicenseObject> = await licenses.json();
    const url = data.find((lo) => lo.key === license!.toLowerCase())?.url ?? 'https://api.github.com/licenses/unlicense';
    const licenseContentResponse = await fetch(url);
    const LICENSE = await licenseContentResponse.text();
    await writeFile(`${name}/LICENSE`, LICENSE);
    Logger.info('Generated LICENSE');

    // Install dependencies
    execSync(`cd ${name} && ${packageManager} install`, { stdio: 'inherit' });

    // Approve build scripts
    execSync(`cd ${name} && pnpm approve-builds`, { stdio: 'inherit' });

    // Install ESLint
    const eslint = await fetch('https://raw.githubusercontent.com/bnonni/init-ts-template/refs/heads/main/eslint.config.cjs');
    const ESLINT_CONFIG_CJS = await eslint.text();
    await writeFile(`${name}/eslint.config.cjs`, ESLINT_CONFIG_CJS);
    Logger.info('Generated eslint.config.cjs');
  }

  /**
   * Initialize a new TypeScript project skipping prompts and using defaults
   * @static
   * @async
   * @param {PackageInitOptions} params Options for initializing a new TypeScript project
   * @param {string} [params.name='TBD'] The name of the project
   * @param {string} [params.version='0.1.0'] The version of the project
   * @param {string} [params.description='TBD'] The description of the project
   * @param {string} [params.license='Unlicense'] The license of the project
   * @param {boolean} [params.src=true] Use src/ directory
   * @param {string} [params.type='module'] Build type
   * @param {string} [params.homepage='TBD'] The homepage URL of the project
   * @param {Array<Contributor>} [params.contributors=[{
   *       name  : 'TBD',
   *       email : 'TBD',
   *       url   : 'TBD'
   *     }]] The contributors to the project
   * @param {Array<string>} [params.keywords=[]] The keywords for the project
   * @returns {Promise<void>} A promise that resolves when the project has been initialized
   * @throws {Error} If the name and description are not provided
   */
  static async skip(): Promise<void> {
    try {
      // Log info message
      Logger.info('Skipping prompts, using defaults');
      // Get package.json content
      const packageJsonContent = this.getPackageJson();
      // Get project name
      const name = packageJsonContent.name;
      // Generate file and folder structure
      await this.generateFileFolderStructure(packageJsonContent);
      // Get git config user
      const { username } = await this.getGitConfigUser();
      // Build remote origin
      const remoteOrigin = `git@github.com:${username}/${name}.git`;
      // Initialize git repository
      execSync(`cd ${name} && git init && git remote add origin ${remoteOrigin}`, { stdio: 'inherit' });
      // Log info message
      Logger.info('Initialized git repo');
      // Log completions message
      Logger.info(`New TS template project ${name} successfully created!`);
    } catch (error: any) {
      Logger.error(error.message ?? 'Failed to init new TS project using skip flow');
      process.exit(1);
    }
  }


  /**
   * Initialize a new TypeScript project
   * @static
   * @async
   * @param {PackageInitOptions} params Options for initializing a new TypeScript project
   * @param {boolean} params.skip Skip prompts
   * @param {string} params.name The name of the project
   * @param {string} params.version The version of the project
   * @param {string} params.description The description of the project
   * @param {string} params.license The license of the project
   * @param {boolean} params.src Use src/ directory
   * @param {string} params.type Build type
   * @param {string} params.homepage The homepage URL of the project
   * @param {Array<Contributor>} params.contributors The contributors to the project
   * @param {Array<string>} params.keywords The keywords for the project
   * @param {TsConfig} params.tsconfig The tsconfig.json file
   * @returns {Promise<void>} A promise that resolves when the project has been initialized
   * @throws {Error} If skip is true and the name and description are not provided
   */
  static async init({
    skip,
    name,
    version,
    description,
    license,
    src,
    type,
    homepage,
    contributors,
    keywords,
    tsconfig,
  }: PackageInitOptions = {}): Promise<void> {
    try {
      // Check for required fields
      if(skip) {
        if(!name)
          throw new Error('Skipping prompts requires at least a project name');
        return await this.skip();
      }

      // Log welcome message
      Logger.info('Welcome to the init-ts-template');

      // Load tsconfig.json file
      tsconfig = await this.loadTsConfig(tsconfig as string);

      // Prompt project name
      name ??= await Inquirer.input({
        message     : 'Project Name:',
        required    : true,
        default     : 'my-ts-project'
      });

      // Log info message
      Logger.info(`Creating new TypeScript project: ${name}`);

      // Prompt project version
      version ??= await Inquirer.input({
        message  : 'Version:',
        required : true,
        default  : '0.1.0'
      });

      // Prompt project description
      description ??= await Inquirer.input({
        message  : 'Description:',
        required : true,
        default  : 'My TS Project'
      });

      // Prompt package manager
      const packageManager = await Inquirer.select({
        message : 'Package Manager:',
        choices : ['npm', 'yarn', 'pnpm'],
        default : 'pnpm'
      });

      // Build tsconfig.json
      const tsConfigTemplate = await this.buildTsConfig(tsconfig);

      // Prompt to use src/ directory
      src ??= await Inquirer.select({
        message : 'Use src/ directory?',
        choices : ['Yes', 'No'],
        default : 'Yes'
      }) === 'Yes';

      // Prompt project license
      license ??= await Inquirer.select({
        message : 'License:',
        choices : Array.from(SOFTWARE_LICENSES.keys()),
        default : 'Unlicense',
      }) ?? 'unlicense';

      // Prompt project build type
      type ??= await Inquirer.select({
        message : 'Build type:',
        choices : ['module', 'commonjs'],
        default : 'module'
      });

      // Prompt project homepage
      homepage ??= await Inquirer.input({
        message  : 'Project homepage URL:',
        required : true,
      });

      // Prompt project contributors
      contributors ??= [];
      const { useremail, username } = await this.getGitConfigUser();
      const numContributors = await Inquirer.input({
        message : 'Number of contributors:',
        default : '1',
      });
      while (contributors.length < Number(numContributors)) {
        const name = await Inquirer.input({
          message : `Contributor ${contributors.length + 1} Name:`,
          default : username,
        });
        const email = await Inquirer.input({
          message : `Contributor ${contributors.length + 1} Email:`,
          default : useremail
        });
        const url = await Inquirer.input({
          message : `Contributor ${contributors.length + 1} URL:`,
          default : `https://github.com/${username}`
        });
        contributors.push({ name, email, url });
      }

      // Prompt project keywords
      const addKeywords = await Inquirer.select({
        message : 'Add keywords?',
        choices : ['Yes', 'No'],
      });
      keywords ??= [name];
      while(addKeywords === 'Yes') {
        const keyword = await Inquirer.input({
          message : 'Keyword (press enter to skip):',
        });
        if(!keyword) break;
        keywords.push(keyword);
      }

      // Set packagejson defaults
      const main = './dist/cjs/index.js';
      const module = './dist/esm/index.js';
      const types = './dist/types/index.d.ts';
      const repository = {
        type : 'git',
        url  : `${
          homepage
            .replace('https://', 'git+ssh://git@')
            .replace('.com/', '.com:')
        }.git`
      };
      const bugs = `${homepage}/issues`;
      const packageJsonFile = packageManager === 'pnpm'
        ? 'pnpm-lock.yaml'
        : packageManager === 'npm'
          ? 'package-lock.json'
          : 'yarn.lock';

      // Create package.json content
      const packageJsonContent: Record<string | number | symbol, any> = {
        name,
        version,
        type,
        description,
        main,
        module,
        types,
        exports : {
          '.' : {
            types,
            import  : module,
            require : main
          }
        },
        license,
        homepage,
        repository,
        bugs,
        publishConfig   : { access: 'public' },
        engines         : { node: '>=22.0.0' },
        scripts         : {
          wipe               : `rimraf node_modules ${packageJsonFile}`,
          start              : `node ${main}`,
          clean              : 'rimraf dist coverage tests/compiled',
          build              : `${packageManager} clean && ${packageManager} build:esm && ${packageManager} build:cjs`,
          'build:esm'        : `rimraf dist/esm dist/types && ${packageManager} tsc -p tsconfig.json`,
          'build:cjs'        : 'rimraf dist/cjs && tsc -p tsconfig.cjs.json && echo \'{"type": "commonjs"}\' > ./dist/cjs/package.json',
          'build:tests:node' : `rimraf tests/compiled && ${packageManager} tsc -p tests/tsconfig.json`,
          lint               : 'eslint . --max-warnings 0',
          'lint:fix'         : 'eslint . --fix',
          'test:node'        : `${packageManager} build:tests:node && ${packageManager} c8 mocha`,
          'build:test'       : `${packageManager} build && ${packageManager} build:tests:node && ${packageManager} test:node`,
          'build:lint:test'  : `${packageManager} build && ${packageManager} build:tests:node && ${packageManager} lint:fix`,
          prepublish         : `${packageManager} build`,
          version            : `${packageManager} version`,
          'version:no-git'   : `${packageManager} version --no-commit-hooks --no-git-tag-version`
        },
        dependencies    : {},
        devDependencies : DEFAULT_DEPENDENCIES,
      };

      // Add pnpm onlyBuiltDependencies
      if(packageManager === 'pnpm') {
        packageJsonContent.pnpm = {
          onlyBuiltDependencies : [
            'esbuild'
          ]
        };
      }

      // Prompt to install dependencies
      const crossBuildSupport = await Inquirer.select({
        message : type === 'module' ? 'Support CommonJS build?' : 'Support ESM build?',
        choices : ['Yes', 'No'],
        default : 'Yes'
      }) === 'Yes';

      // Create package directory
      const srcDir = src ? `${name}/src` : name;
      await mkdir(srcDir, { recursive: true });

      // Write index.ts file
      await writeFile(`${srcDir}/index.ts`, 'export function helloWorld() { return \'Hello, World!\'; }');
      Logger.info('Generated index.ts');

      // Write package.json
      await writeFile(`${name}/package.json`, JSON.stringify(packageJsonContent, null, 2));
      Logger.info('Generated package.json');

      // Write tsconfig.json
      if (tsConfigTemplate) {
        await writeFile(`${name}/tsconfig.json`, JSON.stringify(tsConfigTemplate, null, 2));
        Logger.info('Generated tsconfig.json');
      }

      if (crossBuildSupport) {
        await writeFile(`${name}/tsconfig.cjs.json`, JSON.stringify(TSCONFIG_CJS_JSON, null, 2));
        Logger.info('Generated tsconfig.cjs.json');
      }

      // Create tests directory
      await mkdir(`${name}/tests`, { recursive: true });
      Logger.info('Generated tests');

      // Write tests/tsconfig.json
      await writeFile(`${name}/tests/tsconfig.json`, JSON.stringify(TESTS_TSCONFIG_JSON, null, 2));
      Logger.info('Generated tests/tsconfig.json');

      // Write tests/index.spec.ts
      await writeFile(`${name}/tests/index.spec.ts`, INDEX_SPEC_TS);
      Logger.info('Generated tests/index.spec.ts');

      // Write .c8rc.json
      await writeFile(`${name}/.c8rc.json`, JSON.stringify(C8RC_JSON, null, 2));
      Logger.info('Generated .c8rc.json');

      // Write .mocharc.json
      await writeFile(`${name}/.mocharc.json`, JSON.stringify(MOCHA_ARC_JSON, null, 2));
      Logger.info('Generated .mocharc.json');

      // Write .gitignore
      await writeFile(`${name}/.gitignore`, GIT_IGNORE);
      Logger.info('Generated .gitignore');

      // Write README.md
      await writeFile(`${name}/README.md`, `# ${name}\n\n${description}`);
      Logger.info('Generated README.md');

      // Write LICENSE
      const response = await fetch('https://api.github.com/licenses');
      const data: Array<LicenseObject> = await response.json();
      const url = data.find((lo: LicenseObject) => lo.key === license!.toLowerCase())?.url ?? 'https://api.github.com/licenses/unlicense';
      const licenseContentResponse = await fetch(url);
      const LICENSE = await licenseContentResponse.json();
      await writeFile(`${name}/LICENSE`, LICENSE);
      Logger.info('Generated LICENSE');

      // Prompt install dependencies
      let installDeps;
      do {
        installDeps =  await Inquirer.select({
          message : 'Install dependencies?',
          choices : ['Yes', 'No', 'Show'],
        });
        if (installDeps === 'Yes') {
          Logger.info('Installing dependencies ...');
          execSync(`cd ${name} && ${packageManager} install`, { stdio: 'inherit' });
        } else if (installDeps === 'Show') {
          Logger.info('devDependencies:', DEFAULT_DEPENDENCIES);
        }
      } while (installDeps === 'Show');

      // Prompt to approve build scripts
      if(packageManager === 'pnpm' && installDeps === 'Yes') {
        const approveBuilds = await Inquirer.select({
          message : 'Approve build scripts?',
          choices : ['Yes', 'No'],
        }) === 'Yes';
        if(approveBuilds) {
          Logger.info('Approving build scripts ...');
          execSync(`cd ${name} && pnpm approve-builds`, { stdio: 'inherit' });
        } else {
          Logger.warn('Run `pnpm approve-builds` to approve build scripts');
        }
      }

      // Prompt to install ESLint
      let useEslint;
      do {
        const response = await fetch('https://raw.githubusercontent.com/bnonni/init-ts-template/refs/heads/main/eslint.config.cjs');
        const ESLINT_CONFIG_CJS = await response.text();
        useEslint =  await Inquirer.select({
          message : 'Use ESLint?',
          choices : ['Yes', 'No', 'Show'],
        });
        if (useEslint === 'Yes') {
          Logger.info('Installing ESLint ...');
          await writeFile(`${name}/eslint.config.cjs`, ESLINT_CONFIG_CJS);
        } else if (useEslint === 'Show') {
          Logger.info('eslint.config.cjs\n', ESLINT_CONFIG_CJS);
        }
      } while (useEslint === 'Show');

      // Prompt to initialize git repository
      const initGitRepo = await Inquirer.select({
        message : 'Initialize git repository?',
        choices : ['Yes', 'No'],
      }) === 'Yes';

      // Initialize git repository
      if(initGitRepo) {
        Logger.info('Initializing git repository ...');
        const remoteOrigin = `git@github.com:${username}/${name}.git`;
        execSync(`cd ${name} && git init && git remote add origin ${remoteOrigin}`, { stdio: 'inherit' });
      }

      // Log completion message
      Logger.info(`New TS template project ${packageJsonContent.name} successfully created!`);
    } catch (error: any) {
      // Log error message
      Logger.error(error.message ?? 'Failed to init new TS project');
      process.exit(1);
    }
  }
}

export default TsTemplate;