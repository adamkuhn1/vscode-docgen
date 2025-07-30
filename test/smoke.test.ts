import * as vscode from 'vscode';

// Mock vscode module
jest.mock('vscode', () => ({
  commands: {
    registerCommand: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => 'test-api-key'),
    })),
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  ProgressLocation: {
    Notification: 'notification',
  },
  Position: jest.fn(),
}));

describe('VS Code JSDoc Generator Extension', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register extension.generateDocs command', () => {
    // Mock the extension context
    const mockContext = {
      subscriptions: {
        push: jest.fn(),
      },
    };

    // Import and activate the extension
    const { activate } = require('../src/extension');
    activate(mockContext);
    
    // Verify that registerCommand was called with the correct command
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      'extension.generateDocs',
      expect.any(Function)
    );
  });

  test('should only register the main command', () => {
    // Mock the extension context
    const mockContext = {
      subscriptions: {
        push: jest.fn(),
      },
    };

    // Import and activate the extension
    const { activate } = require('../src/extension');
    activate(mockContext);
    
    // Verify that registerCommand was called exactly once
    expect(vscode.commands.registerCommand).toHaveBeenCalledTimes(1);
    
    // Verify it was called with the correct command name
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      'extension.generateDocs',
      expect.any(Function)
    );
  });
}); 