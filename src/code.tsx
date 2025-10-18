import { Tooltip } from 'react-tooltip';
import { formatTextForDisplay, formatCodeWithLineNumbers } from './Code.ts';


interface CodeBlockProps {
  text: string;
  onClick?: () => void;
  isResponse?: boolean; // New prop to distinguish AI response display
  highlightLines?: Array<{start_line: number, end_line: number, suggestion: string}>; // New prop for validation highlights
}

export function CodeBlock({ text, onClick, isResponse = false, highlightLines = [] }: CodeBlockProps) {
  const formatted = formatTextForDisplay(text);
  
  if (formatted.isCode && isResponse) {
    // For response display, add line numbers
    const { lines, maxLineNumber } = formatCodeWithLineNumbers(formatted.content);
    const lineNumberWidth = maxLineNumber.toString().length;
    
    // Create a function to check if a line should be highlighted
    const isLineHighlighted = (lineNumber: number) => {
      return highlightLines.some(highlight => 
        lineNumber >= highlight.start_line && lineNumber <= highlight.end_line
      );
    };

    // Get suggestion for a specific line
    const getLineSuggestion = (lineNumber: number) => {
      const highlight = highlightLines.find(h => 
        lineNumber >= h.start_line && lineNumber <= h.end_line
      );
      return highlight?.suggestion || '';
    };
    
    return (
      <div className={`code-block-container response-code`} onClick={onClick}>
        <div className="code-block-with-lines response-code-block">
          <div className="line-numbers">
            {lines.map((_, index) => {
              const lineNumber = index + 1;
              const highlighted = isLineHighlighted(lineNumber);
              return (
                <span 
                  key={index} 
                  className={`line-number ${highlighted ? 'highlighted-line-number' : ''}`} 
                  style={{ width: `${lineNumberWidth}ch` }}
                >
                  {lineNumber}
                </span>
              );
            })}
          </div>
          <pre className="code-content">
            <code>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const highlighted = isLineHighlighted(lineNumber);
                const suggestion = getLineSuggestion(lineNumber);
                
                return (
                  <div 
                    key={index} 
                    className={`code-line ${highlighted ? 'highlighted-code-line' : ''}`}
                    data-tooltip-id="validation-tooltip"
                    data-tooltip-content={suggestion}
                    data-tooltip-place="left"
                  >
                    {line || ' '}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
        <Tooltip id="validation-tooltip" />
      </div>
    );
  } else if (formatted.isCode) {
    // For sidebar/history display, keep simple format
    return (
      <div className={`code-block-container`} onClick={onClick}>
        <pre className={`code-block`}>
          <code>{formatted.content}</code>
        </pre>
      </div>
    );
  }
  
  return (
    <div className={`text-content ${isResponse ? 'response-text' : ''}`} onClick={onClick}>
      {formatted.content}
    </div>
  );
}