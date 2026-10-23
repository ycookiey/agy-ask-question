# Antigravity Ask User Question

An extension for [Antigravity](https://antigravity.google/) that lets an AI agent ask you a multiple-choice question in the sidebar. The agent writes the question to `.agy/question.json` in the workspace, you click an option, and the extension writes your choice to `.agy/answer.json` for the agent to read.

The exchange goes through files only, so any agent that can write and read files in the workspace can use it.

## Installation

The extension is not published to a marketplace. Build the VSIX and install it (Node.js 22 or later):

```sh
git clone https://github.com/ycookiey/agy-ask-question.git
cd agy-ask-question
npm ci
npx @vscode/vsce package
antigravity --install-extension agy-ask-extension-0.0.1.vsix
```

You can also run **Extensions: Install from VSIX...** from the Command Palette and pick the file.

## Usage

1. Open a folder, then open **Ask Agy** in the activity bar to show the **Questions** view. Keep the view visible while the agent may ask.
2. Tell the agent how to ask, for example in its instructions: "When you need me to choose, delete `.agy/answer.json`, write the question to `.agy/question.json`, then wait until `.agy/answer.json` exists and read it."
3. The agent writes a question like this:

   ```json
   {
     "text": "Which database should I use?",
     "options": [
       { "label": "PostgreSQL", "description": "Runs as a server", "value": "postgres" },
       { "label": "SQLite", "description": "A single file, no server", "value": "sqlite" },
       "Let me decide later"
     ]
   }
   ```

   Each option is a string, or an object with `label` and optional `description` and `value`.
4. Click an option. The extension writes its `value` (or its `label`, or the string itself) as JSON to `.agy/answer.json` in the first workspace folder, for example `"sqlite"`, and shows the answer in a notification.

Add `.agy/` to your `.gitignore` to keep these files out of your repository.

## Known limitations

- A question is shown only if the Questions view is visible when the file is written. A question written while the view is closed, collapsed or behind another view is not shown. Write the file again after showing the view.
- After the view is hidden and shown again, it shows the last question again, even if it was already answered. Clicking an option then writes an answer to that question.
- The extension never deletes `question.json` or `answer.json`. The previous answer stays until the next one overwrites it.
- Questions are read from any `.agy/question.json` in the workspace, including ones in subfolders, but the answer is always written to `.agy/answer.json` at the top of the first workspace folder. With no folder open, the answer is not saved.
- A question file that is not valid JSON is ignored.

## Uninstallation

Uninstall the extension from the Extensions view, or run:

```sh
antigravity --uninstall-extension undefined_publisher.agy-ask-extension
```

Then delete the `.agy/` folders from your workspaces.

## Build

```sh
npm ci
npm run compile
```

The compiled files go to `out/`.

## License

[MIT](LICENSE)
