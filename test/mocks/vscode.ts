// Mock VS Code module for testing
export const commands = {
  registerCommand: jest.fn(),
};

export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: jest.fn(() => 'test-api-key'),
  })),
};

export const window = {
  showErrorMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  activeTextEditor: {
    document: {
      getText: jest.fn(() => 'test function'),
    },
    selection: {
      start: { line: 0 },
      end: { line: 1 },
    },
    edit: jest.fn(),
  },
  withProgress: jest.fn(),
};

export const ProgressLocation = {
  Notification: 'notification',
};

export const Position = jest.fn();

export const ExtensionContext = {
  subscriptions: {
    push: jest.fn(),
  },
}; 