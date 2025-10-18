import React from 'react';

export function expandedText(element: HTMLTextAreaElement | HTMLInputElement) {
    // Auto-expand function for text inputs and textareas
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

export function attachAutoExpand(element: HTMLTextAreaElement | HTMLInputElement) {
    element.addEventListener('input', () => expandedText(element));
}

// Utility function to process input text (trim and truncate)
export function processInputText(inputValue: string, maxLength: number = 4): string {
    const trimmedValue = inputValue.trim();
    return trimmedValue.substring(0, maxLength);
}

// Utility function to handle input blur (trim whitespace)
export function handleInputBlur(inputValue: string, setInputValue: (value: string) => void) {
    if (inputValue !== inputValue.trim()) {
        setInputValue(inputValue.trim());
    }
}

// Utility function to reset textarea height
export function resetTextareaHeight(textareaRef: React.RefObject<HTMLTextAreaElement | null>) {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
}

// Utility function to focus and expand textarea
export function focusAndExpandTextarea(textareaRef: React.RefObject<HTMLTextAreaElement | null>) {
    if (textareaRef.current) {
        textareaRef.current.focus();
        expandedText(textareaRef.current);
    }
}

// Random eye movement function
export function attachRandomEyeMovement(eyeElement: HTMLElement) {
    const animations = [
        'moveIrisRandom1',
        'moveIrisRandom2', 
        'moveIrisRandom3',
        'moveIrisRandom4',
        'moveIrisRandom5'
    ];
    
    function randomizeAnimation() {
        // Generate random values similar to random(min, max)
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        const randomDuration = Math.random() * 4 + 3; // random between 3-7 seconds
        const randomDelay = Math.random() * 2; // random delay 0-2 seconds
        
        eyeElement.style.animation = `${randomAnimation} ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
    }
    
    // Initial randomization
    randomizeAnimation();
    
    // Change animation every 6-12 seconds for true randomness
    setInterval(() => {
        randomizeAnimation();
    }, Math.random() * 6000 + 6000); // random interval between 6-12 seconds
}

// Code detection function
export function detectCodeInText(text: string): boolean {
    const codePatterns = [
        // Programming language keywords
        /\b(function|const|let|var|if|else|for|while|return|import|export|class|interface|type)\b/,
        // Common symbols in code
        /[{}();[\]]/,
        // HTML/XML tags
        /<\/?[a-zA-Z][^>]*>/,
        // Common programming patterns
        /\w+\s*[=:]\s*[\w"'`]/,
        // CSS selectors and properties
        /\.[a-zA-Z-]+\s*{|\w+\s*:\s*[\w#-]+;/,
        // SQL keywords
        /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE)\b/i,
        // Function calls
        /\w+\s*\([^)]*\)/,
        // Arrow functions
        /=>\s*{?/,
        // Console/log statements
        /console\.(log|error|warn|info)/,
        // Common file extensions in text
        /\.(js|ts|jsx|tsx|html|css|py|java|cpp|c|php|rb|go|rs)\b/
    ];

    return codePatterns.some(pattern => pattern.test(text));
}

// Format text for display (preserve code blocks)
export function formatTextForDisplay(text: string): { isCode: boolean, content: string } {
    const isCode = detectCodeInText(text);
    return {
        isCode,
        content: text
    };
}

// Format code with line numbers
export function formatCodeWithLineNumbers(text: string): { lines: string[], maxLineNumber: number } {
    const lines = text.split('\n');
    const maxLineNumber = lines.length;
    
    return {
        lines,
        maxLineNumber
    };
}

