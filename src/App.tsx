
import { expandedText, attachAutoExpand, processInputText, handleInputBlur as handleBlur, resetTextareaHeight, focusAndExpandTextarea, attachRandomEyeMovement } from './APP'
import './App.css'
import { useState, useRef, useEffect } from 'react'



function App() {
  
  const [inputValue, setInputValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [promptHistory, setPromptHistory] = useState<string[]>([])
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
    // Use utility function to process input text
    const truncatedValue = processInputText(inputValue, 4)
    if (truncatedValue) {
      // Add the truncated input to history
      setPromptHistory(prev => [...prev, truncatedValue])
      // Clear the input
      setInputValue('')
      // Reset textarea height using utility function
      resetTextareaHeight(textareaRef)
      // Open sidebar to show history
      setSidebarOpen(true)
    }
  }

  const handleHistoryClick = (historyText: string) => {
    // Restore the clicked history text to the input
    setInputValue(historyText)
    // Close the sidebar
    setSidebarOpen(false)
    // Focus and expand textarea using utility function
    focusAndExpandTextarea(textareaRef)
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
                <div key={index} className="history-item" onClick={() => handleHistoryClick(prompt)}>
                  <span className="history-number">#{index + 1}</span>
                  <a className="history-text">{prompt}</a>
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
        <h2> I see everything </h2>

       
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
            <button onClick={handlePromptSubmit}>prompt</button>
            <button onClick={handlePromptSubmit}>existing Code</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
