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

