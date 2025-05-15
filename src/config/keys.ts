// Key code configuration
export const TRIAL_KEY_CODES = [
  'AIRABLE2024',  // Default trial key
  'BETA2024',     // Beta tester key
  'EARLY2024'     // Early access key
];

// Validate a key code
export const validateKeyCode = (code: string): boolean => {
  return TRIAL_KEY_CODES.includes(code.toUpperCase());
};

// Check if a key code has been used
export const hasUsedKeyCode = (): boolean => {
  return localStorage.getItem('airAbleKeyVerified') === 'true';
};

// Mark a key code as used
export const markKeyCodeAsUsed = (): void => {
  localStorage.setItem('airAbleKeyVerified', 'true');
};

// Function to add a new key code
export const addKeyCode = (newCode: string): void => {
  if (!TRIAL_KEY_CODES.includes(newCode.toUpperCase())) {
    TRIAL_KEY_CODES.push(newCode.toUpperCase());
  }
};

// Function to remove a key code
export const removeKeyCode = (codeToRemove: string): void => {
  const index = TRIAL_KEY_CODES.indexOf(codeToRemove.toUpperCase());
  if (index > -1) {
    TRIAL_KEY_CODES.splice(index, 1);
  }
};

// Function to get all valid key codes
export const getAllKeyCodes = (): string[] => {
  return [...TRIAL_KEY_CODES];
}; 