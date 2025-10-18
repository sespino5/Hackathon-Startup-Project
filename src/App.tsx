
import { expandedText, attachAutoExpand, processInputText, handleInputBlur as handleBlur, resetTextareaHeight, attachRandomEyeMovement, formatTextForDisplay, formatCodeWithLineNumbers } from './APP'
import './App.css'
import { useState, useRef, useEffect } from 'react'



// CodeBlock component for displaying code with proper formatting
interface CodeBlockProps {
  text: string;
  onClick?: () => void;
  isResponse?: boolean; // New prop to distinguish AI response display
}

function CodeBlock({ text, onClick, isResponse = false }: CodeBlockProps) {
  const formatted = formatTextForDisplay(text);
  
  if (formatted.isCode && isResponse) {
    // For response display, add line numbers
    const { lines, maxLineNumber } = formatCodeWithLineNumbers(formatted.content);
    const lineNumberWidth = maxLineNumber.toString().length;
    
    return (
      <div className={`code-block-container response-code`} onClick={onClick}>
        <div className="code-block-with-lines response-code-block">
          <div className="line-numbers">
            {lines.map((_, index) => (
              <span key={index} className="line-number" style={{ width: `${lineNumberWidth}ch` }}>
                {index + 1}
              </span>
            ))}
          </div>
          <pre className="code-content">
            <code>
              {lines.map((line, index) => (
                <div key={index} className="code-line">
                  {line || ' '}
                </div>
              ))}
            </code>
          </pre>
        </div>
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

function App() {
  
  const [inputValue, setInputValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [promptHistory, setPromptHistory] = useState<{full: string, truncated: string}[]>([])
  const [displayedContent, setDisplayedContent] = useState<string>('')
  const [showDisplay, setShowDisplay] = useState(false)
  const [hideInput, setHideInput] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const eyeIrisRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      attachAutoExpand(textareaRef.current)
    }
  }, [])

  useEffect(() => {
    if (eyeIrisRef.current) {
      attachRandomEyeMovement(eyeIrisRef.current)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    if (textareaRef.current) {
      expandedText(textareaRef.current)
    }
  }

  const handleInputBlur = () => {
    // Use utility function from APP.ts
    handleBlur(inputValue, setInputValue)
  }

  const handlePromptSubmit = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      // Add both full and truncated versions to history
      const truncatedValue = processInputText(inputValue, 4)
      setPromptHistory(prev => [...prev, { full: trimmedValue, truncated: truncatedValue }])
      
      // Show the full input text (without trimming) in the display area
      setDisplayedContent(trimmedValue)
      setShowDisplay(true)
      setHideInput(true)
      
      // Clear the input
      setInputValue('')
      // Reset textarea height using utility function
      resetTextareaHeight(textareaRef)
      // Open sidebar to show history
      setSidebarOpen(true)
    }
  }

  const handleHistoryClick = (historyItem: {full: string, truncated: string}) => {
    // Show the full clicked history text in the display area
    setDisplayedContent(historyItem.full)
    setShowDisplay(true)
    setHideInput(true)
    // Close the sidebar
    setSidebarOpen(false)
  }

  const handleNewPrompt = () => {
    setShowDisplay(false)
    setHideInput(false)
    setDisplayedContent('')
  }

  return (
    <>
      <div>

         {/* Hamburger Menu Icon */}
        <div className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>

         <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}> 
          <p> History </p>
          <div className="history-list">
            {promptHistory.length === 0 ? (
              <p className="no-history">No prompts submitted yet</p>
            ) : (
              promptHistory.map((prompt, index) => (
                <div key={index} className="history-item">
                  <span className="history-number">#{index + 1}</span>
                  <div className="history-text">
                    <CodeBlock text={prompt.truncated} onClick={() => handleHistoryClick(prompt)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <h1 className="app-title">
          Arg
          <span className="animated-eye-inline">
            <div className="eye-white">
              <div className="iris" ref={eyeIrisRef}>
                <div className="pupil"></div>
              </div>
            </div>
          </span>
          s
        </h1>
        <h2> Security at a Glance </h2>

       
        {!hideInput && (
          <div className="card">
            <textarea 
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="inputBox" 
              placeholder="Type your code/prompt here"
              rows={3}
            />

            <div className="button-container">
              <button onClick={handlePromptSubmit}>Submit Prompt</button>
            </div>
          </div>
        )}

        {/* AI-style Response Display Area */}
        {showDisplay && (
          <div className="response-container">
            <div className="response-header">
              <span className="ai-label">Argos</span>
              <div className="header-buttons">
                <button 
                  className="new-prompt-btn" 
                  onClick={handleNewPrompt}
                  title="New Prompt"
                >
                  New Prompt
                </button>
                <button 
                  className="close-response" 
                  onClick={handleNewPrompt}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="response-content">
              <CodeBlock text={displayedContent} isResponse={true} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
