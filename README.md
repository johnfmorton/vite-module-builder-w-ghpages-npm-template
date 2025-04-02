# Vite module builder template with automated GitHub Pages and npm publishing

This is a repo serves as a template workflow that uses Vite to help you create a module, exported as a Common JS module and an ES module.

It features a development page to easily test your module during development. The development page is preconfigured with Tailwind CSS. Note that Tailwind CSS is _not_ included in the published module. If you are developing a web componet, for example, and want to use Tailwind CSS, you will need to include it in your project.

Two preconfigured GitHub Actions are also included. The first will plubish a demo page to GitHub pages every time you upload your changes to the `main` branch. The second workflow allows you to publish your module to NPM every time you push a commit to GitHub with a new version number in your package.json file.

You write your module in Typescript and your published module will include an automatically generated type definition file.

## Installation

You can use it as a template to create your own repo. You can do this by clicking the "Use this template" button on the repo's home page.

This will create a new repo in your GitHub account. You can then clone the repo to your local machine and start working on your module.

## Video walk through

You can read about this repo on [my blog, SuperGeekery.com](https://supergeekery.com/blog/make-javascript-module-creation-easier-with-vite-and-automated-github-pages-and-npm-publishing). Below is a link to the video walk through that's part of the blog post.

[![Watch the video](https://img.youtube.com/vi/fqL4Td5hYY0/maxresdefault.jpg)](https://youtu.be/fqL4Td5hYY0)

## Run the configuration script

This repo includes a configuration script that will help you update the name of your module and other settings. To run the script, you will need to have Node installed on your machine. You can download it from https://nodejs.org/en/download/.

Once you have Node installed, you can run the script by opening a terminal window and navigating to the root of the repo.

You will need to have two pieces of information to run the script:

1. The name of your module. This needs to be a valid name for a web componet. It can only contain lowercase letters, numbers, and dashes. It must start with a letter. It cannot contain spaces or any other characters.
2. The name of the GitHub repo URL. This is the URL of the repo you are working on. It should be in the format of `https://<USERNAME>.github.io/<REPO>/`.


Then run the following command:

```bash
npm run project-setup
```

This will replace all the instances of "vite-module-builder-w-ghpages-npm-template" with the name of your module. It will also update the `package.json` and `vite.demo.config.js` files with the git repository URL.

The script will also run `npm install` to install the dependencies for the repo. There is [additional information about the files](#additional-information-about-the-files) at the end of the document.

In your `package.json` file, the name of your module will be set to the name you provided. You can change this to whatever you want. The default is `vite-module-builder-w-ghpages-npm-template`. If you are publishing to an organization, you will need to set the name to `@<ORG_NAME>/<MODULE_NAME>`. For example, if your organization is called "my-org" and your module is called "my-module", you would set the name to `@my-org/my-module`.

You can also set the version number to whatever you want. The default is "1.0.0". During development, I set this to "1.0.0-beta.1" or something similar. You can change this to whatever you want. See the "Tagging releases" section below for more information about publishing `latest` and `beta` releases.

The version number is used to determine if the module has changed and needs to be published to NPM. If you change the version number in the `package.json` file, the workflow will publish the module to NPM.

## How to work on your module

### Development

Once your files are updated, you can run `npm run dev` to start the development server for the demo page and get to work on your module by editing the typescript file in the `/lib` directory.

The demo page is the `index.html` file at the root of the project. It imports your module from the `/lib` directory so you can test it as you work on it. The script for your demo page is in the `/demo-page-assets` directory, `demo.ts`.

The `public` directory is where static assets are stored for the demo site. Think images, fonts, etc. This is where the `vite.config.ts` file will look for static assets to include in the build process. You can reference them in your HTML file using the `/` prefix. For example, if you have an image in the `public` directory called `image.png`, you can reference it in your HTML file like this:

```html
<img src="/image.png" alt="My image">
```

### Testing your npm package

To test your npm package before publishing it, you can use the `npm pack` command. This will create a tarball of your package that you can use to test the package before publishing it to NPM.

```sh
npm pack --dry-run

npm notice
npm notice 📦  my-module@1.0.0
npm notice === Tarball Contents ===
npm notice 1.2kB  package.json
npm notice 1.1kB  README.md
npm notice 3.4kB  dist/my-module.umd.js
npm notice 3.3kB  dist/my-module.es.js
npm notice 0.6kB  dist/my-module.d.ts
npm notice === Tarball Details ===
npm notice name:          my-module
npm notice version:       1.0.0
npm notice total files:   5
npm notice
```

To view the contents of the package that will be published, run the following command:

```sh
npm pack
```

This will create a .tgz file in the current directory. You can then extract this file to see the contents of the package.

### Organizational repos

Organizational packages default to private. If you want them public, you need to add an additional `--access public` flag to the publish command. You can do this by adding the following line to your `package.json` file:

```json
"publishConfig": {
  "access": "public"
}
```

### Publishing your module to NPM

```
npm publish --access public
```

### GitHub Pages

The `.github/workflows/ghpages.yml` file is the workflow that will get your demo page published as the repo's demo page. You *must* set this up in your repo for it to work. You can do this by going to the repo's settings, then to the "Pages" section. Click the "Source" dropdown and select "GitHub Actions" as shown below.

![GitHub Pages settings](./docs/gh-pages-settings.png)

### NPM publishing

In your GitHub repo, you will need a key from your NPM repository that will allow you to publish. This will be stored in your GitHub secrets for the repo. In the `.github/workflows/build.yml` file, you will need a reference to it, `secrets.NPM_TOKEN`. If you choose a different name for your secret, you will need to update the workflow file.

![NPM Access Tokens](./docs/npm-access-tokens.png)

In the repo's settings, you will need to add the secret to the repo. You can do this by going to the repo's settings, then to the "Secrets and variables" section and then select the "Actions" section. Click the "New repository secret" button and add the secret as shown below.

#### Tagging releases

In the build.yml file, you will see a line that looks like this:

```yaml
tag: latest # or can be set to 'next' for pre-release, or 'beta' for beta release
```

This is the tag that will be used when you publish your module to NPM. You can change this to whatever you want. The default is "latest". You can also set it to "next" for pre-release or "beta" for beta release.

#### Github Secrets

![Github Secrets](./docs/gh-secrets.png)

This script only attempts to run when you change the version number in the `package.json` file. During early development, I don't set this up immediately. This means the intial push to GitHub will cause this script to fail. You can ignore this failure. Once you have set up NPM publishing, you can then update the version number in the `package.json` file and push the commit to GitHub. This will cause the script to run and publish your module to NPM.

The variable name `NPM_TOKEN` is the name of the secret you created in the previous step. You can change this to whatever you want, but you will need to update the workflow file to match.

### How to disable the GitHub Pages and NPM publishing

If you don't want to publish your demo page to GitHub Pages or your module to NPM, you can disable the workflows. I do this early in development to keep these processes running before I'm at that stage of development. You can do this by going to the repo's settings, then to the "Actions" section. Click the "Disable Actions" button as shown below.

![Disable Actions](./docs/gh-action-disable-workflow.png)

You can re-enable the workflows by clicking the "Enable Actions" button on this same screen when you are ready.


## Additional information about the files

The configuration script should have updated all the files in the repo with the name of your module, but it is important to understand what is in the repo and how it works, keep reading.

The most important file in this repo is the `lib/vite-module-builder-w-ghpages-npm-template.ts` file.

The name of the file is important. It is the name of the module you are creating. You will need to update the name of the file and the name of the module in the file.

* index.html - The demo page for your module. Use it to test your module. It will also serve as the demo page for your module when you publish it to GitHub Pages.
* package.json - The package.json file for your module. You will need to update the name of the module in the file.
* README.md - The README.md file for your module. You will need to update the name of the module in the file plus create documentation for your module.
* vite.config.ts - The Vite configuration file for your module build process.
* vite.demo.config.js - The Vite configuration file for your demo page build process for GitHub Pages.
* lib/vite-module-builder-w-ghpages-npm-template.ts - The demo page imports this file to test your module. You will need to update the name of the module in the file.

For a working example, check out this repo: https://github.com/johnfmorton/progressive-share-button

You will see how I use "progressive-share-button" as the name of the module and the name of the file. I also use it in the `package.json` file.

`lib/vite-module-builder-w-ghpages-npm-template.ts` is where you create the module you are working on. For this demo, it is a simple function that looks for an HTML element with the id of "messageOutput" and then sets the text of that element to the message you pass in. The file serves as a starting point for you to build your module. Ultimately, you will use Vite to create a Command JS module and a ESM module. See the `package.json` file for references to both of these.

The other imporatnt page is the `index.html` file. This is the demo page for your module. It includes the `demo-page-assets/demo.ts` file which is where you will write the code to test your module. This page is using Vite for development and the build process.

You can see the demo page for this repo at:

https://johnfmorton.github.io/vite-module-builder-w-ghpages-npm-template/

## License

This repo is licensed under the MIT license. You can use it for any purpose you want. You can also modify it and use it in your own projects. If you do, I would appreciate a link back to this repo so others can find it.
