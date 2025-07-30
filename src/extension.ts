import * as vscode from 'vscode';
import OpenAI from 'openai';

let openai: OpenAI | undefined;

export function activate(context: vscode.ExtensionContext): void {
	console.log('VS Code JSDoc Generator is now active!');

	const key = vscode.workspace.getConfiguration("docgen").get<string>("openaiApiKey");
	if (!key) {
		vscode.window.showErrorMessage("Please set docgen.openaiApiKey in your VS Code settings");
		return;
	}

	openai = new OpenAI({ apiKey: key });

	const disposable = vscode.commands.registerCommand('extension.generateDocs', async () => {
		if (!openai) {
			vscode.window.showErrorMessage('OpenAI client not initialized. Please check your API key.');
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor found.');
			return;
		}

		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		if (!selectedText.trim()) {
			vscode.window.showErrorMessage('Please select a function to generate JSDoc for.');
			return;
		}

		try {
			// Show progress indicator
			await vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Notification,
					title: 'Generating JSDoc...',
					cancellable: false,
				},
				async (progress) => {
					progress.report({ increment: 0 });

					const systemPrompt = `You are a code documentation assistant. Generate a JSDoc comment for this JavaScript/TypeScript function. 
					
					Requirements:
					- Generate only the JSDoc comment, no other text
					- Use proper JSDoc syntax with @param, @returns, @throws tags as appropriate
					- Make the description clear and concise
					- Include type information for parameters and return values
					- Do not include the function code itself, only the JSDoc comment
					
					Function to document:
					${selectedText}`;

					const completion = await openai!.chat.completions.create({
						model: 'gpt-3.5-turbo',
						messages: [
							{
								role: 'system',
								content: systemPrompt,
							},
						],
						max_tokens: 500,
						temperature: 0.3,
					});

					progress.report({ increment: 100 });

					const jsdocComment = completion.choices[0]?.message?.content?.trim();
					if (!jsdocComment) {
						throw new Error('No response received from OpenAI');
					}

					// Insert the JSDoc comment above the selected code
					await editor.edit((editBuilder) => {
						const position = new vscode.Position(selection.start.line, 0);
						editBuilder.insert(position, jsdocComment + '\n');
					});

					vscode.window.showInformationMessage('JSDoc comment generated successfully!');
				}
			);
		} catch (error) {
			console.error('Error generating JSDoc:', error);
			vscode.window.showErrorMessage(
				`Failed to generate JSDoc: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate(): void {
	// Cleanup if needed
} 