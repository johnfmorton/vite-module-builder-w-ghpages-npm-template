const readline = require('readline')
const fs = require('fs')
const url = require('url')
const path = require('path')

const colours = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
        crimson: '\x1b[38m', // Scarlet
    },
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        gray: '\x1b[100m',
        crimson: '\x1b[48m',
    },
}

const REPLACE_ME = 'vite-module-builder-w-ghpages-npm-template'
const GIT_URL =
    'https://github.com/johnfmorton/vite-module-builder-w-ghpages-npm-template'

// Parse the package.json to get default author info
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const authorRegex = /^(.*?)\s*(?:<([^>]+)>)?\s*(?:\((.*?)\))?$/
const authorMatch = authorRegex.exec(packageJson.author || '')
const defaultAuthor = {
    name: authorMatch ? authorMatch[1].trim() : '',
    email: authorMatch ? authorMatch[2] || '' : '',
    website: authorMatch ? authorMatch[3] || '' : ''
}

// Validation functions for author information
function validateEmail(email) {
    if (!email) return true // Allow empty email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        console.log(colours.bg.red + colours.fg.white + 'ERROR: Invalid email format.')
        return false
    }
    return true
}

function validateWebsite(website) {
    if (!website) return true // Allow empty website
    try {
        new URL(website)
        return true
    } catch {
        console.log(colours.bg.red + colours.fg.white + 'ERROR: Invalid website URL.')
        return false
    }
    return true
}

// Array of file paths to search and replace
const files = [
    'index.html',
    'package.json',
    'README.md',
    'vite.config.js',
    'vite.demo.config.js',
    'demo-page-assets/demo.ts',
    // 'lib/vite-module-builder-w-ghpages-npm-template.ts',
]

// Create a readline interface to prompt the user for input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Define a function to validate the replacement text
function validateReplacementText(replacementText) {
    // Check if the replacement text is lowercase
    if (replacementText !== replacementText.toLowerCase()) {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Replacement text must be lowercase.'
        )
        return false
    }

    // Check if the replacement text contains any spaces
    if (replacementText.includes(' ')) {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Replacement text cannot contain spaces.'
        )
        return false
    }

    // Check if the replacement text includes at least one hyphen
    if (!replacementText.includes('-')) {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Replacement text must include at least one hyphen.'
        )
        return false
    }

    // Check if the replacement text starts with a letter
    if (!/^[a-z]/.test(replacementText)) {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Replacement text must start with a letter.'
        )
        return false
    }

    // If all validation checks pass, return true
    return true
}

// Define a function to validate the Git repo URL
function validateGitRepoUrl(gitRepoUrl) {
    // Parse the URL using Node.js' built-in `url` module
    const parsedUrl = url.parse(gitRepoUrl)

    // Check if the protocol is `http` or `https`
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Invalid Git repo URL: must use HTTP or HTTPS protocol.'
        )
        return false
    }

    // Check if the hostname is present
    if (!parsedUrl.hostname) {
        console.log(
            colours.bg.red +
                colours.fg.white +
                'ERROR: Invalid Git repo URL: missing hostname.'
        )
        return false
    }

    // If all validation checks pass, return true
    return true
}

// Create a function to handle the module name prompt
function promptForModuleName() {
    rl.question(
        'Enter your project name: (lowercase, no spaces, at least one hyphen, may include numbers, must start with a letter): ',
        (replacementText) => {
            // Validate the replacement text
            const valid = validateReplacementText(replacementText)
            if (!valid) {
                console.log(colours.fg.yellow + 'Please try again.' + colours.reset)
                // Instead of exiting, recursively prompt again
                promptForModuleName()
                return
            }
            // If valid, proceed to git URL prompt
            promptForGitUrl(replacementText)
        }
    )
}

// Create a function to handle the author name prompt
function promptForAuthorName(replacementText, gitRepoUrl) {
    rl.question(`Enter your name (press Enter to use default: ${defaultAuthor.name}): `, (name) => {
        const authorName = name.trim() || defaultAuthor.name
        promptForAuthorEmail(replacementText, gitRepoUrl, authorName)
    })
}

// Create a function to handle the author email prompt
function promptForAuthorEmail(replacementText, gitRepoUrl, authorName) {
    rl.question(`Enter your email (press Enter to use default: ${defaultAuthor.email}): `, (email) => {
        const authorEmail = email.trim() || defaultAuthor.email
        if (!validateEmail(authorEmail)) {
            promptForAuthorEmail(replacementText, gitRepoUrl, authorName)
            return
        }
        promptForAuthorWebsite(replacementText, gitRepoUrl, authorName, authorEmail)
    })
}

// Create a function to handle the author website prompt
function promptForAuthorWebsite(replacementText, gitRepoUrl, authorName, authorEmail) {
    rl.question(`Enter your website (press Enter to use default: ${defaultAuthor.website}): `, (website) => {
        const authorWebsite = website.trim() || defaultAuthor.website
        if (!validateWebsite(authorWebsite)) {
            promptForAuthorWebsite(replacementText, gitRepoUrl, authorName, authorEmail)
            return
        }
        const authorString = `${authorName}${authorEmail ? ` <${authorEmail}>` : ''}${authorWebsite ? ` (${authorWebsite})` : ''}`
        processFiles(replacementText, gitRepoUrl, authorString)
    })
}

// Modify the promptForGitUrl function to chain to the new author prompts
function promptForGitUrl(replacementText) {
    rl.question('Enter your Git repo URL: ', (gitRepoUrl) => {
        // Validate the Git repo URL
        const valid = validateGitRepoUrl(gitRepoUrl)
        if (!valid) {
            console.log(colours.fg.yellow + 'Please try again.' + colours.reset)
            // Instead of exiting, recursively prompt again
            promptForGitUrl(replacementText)
            return
        }

        // If valid, proceed with author information prompts
        promptForAuthorName(replacementText, gitRepoUrl)
    })
}

// Create a function to handle file processing
function processFiles(replacementText, gitRepoUrl, authorString) {
    // Loop through each file in the files array
    files.forEach((file) => {
        try {
            // Read the contents of the file
            const content = fs.readFileSync(file, 'utf8')

            // create a regex to match the replacement text
            const fileNameRegex = new RegExp(REPLACE_ME, 'g')
            const gitRepoRegex = new RegExp(GIT_URL, 'g')

            // Replace all instances of 'REPLACE_ME' with the user-supplied replacement text
            let updatedContent = content.replace(fileNameRegex, replacementText)

            // Check if this is the package.json file
            if (file === 'package.json') {
                updatedContent = updatedContent.replace(
                    /("version":\s*")([^"]+)(",)/,
                    '$1' + '1.0.0' + '$3'
                )
                // Update the author field
                updatedContent = updatedContent.replace(
                    /("author":\s*")([^"]+)(",)/,
                    '$1' + authorString + '$3'
                )
            }

            // Replace all instances of 'GIT_URL' with the user-supplied Git repo URL
            const finalContent = updatedContent.replace(gitRepoRegex, gitRepoUrl)

            // Write the final content back to the file
            fs.writeFileSync(file, finalContent, 'utf8')

            console.log(
                colours.bg.green,
                colours.fg.white,
                `Updated ${file} `
            )
        } catch (error) {
            console.error(
                colours.bg.red,
                colours.fg.white,
                `Error processing ${file}: ${error.message}`
            )
        }
    })

    // Handle file renaming
    const fileDirecotry = 'lib/'
    const fileToRename = `${REPLACE_ME}.ts`
    const extname = path.extname(fileToRename)
    const oldFilePath = path.join(fileDirecotry, fileToRename)
    const newFilePath = path.join(fileDirecotry, replacementText + extname)

    fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) {
            console.error(
                colours.bg.red,
                colours.fg.white,
                `Error renaming file: ${err.message}`
            )
        }
        rl.close()

        const successMessage = `
****************************************************
* Setup complete. Happy coding!                     *
* To get started, run the following command:        *
*                                                   *
* npm run dev                                       *
*                                                   *
* Reminder: Update the README.md file with your     *
* project details. Also review the package.json     *
****************************************************
`
        console.log('')
        console.log(
            colours.bg.blue +
                colours.fg.white +
                successMessage +
                colours.reset
        )
    })
}

// Start the prompt chain
promptForModuleName()
