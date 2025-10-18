import { expandedText, attachAutoExpand, processInputText, handleInputBlur as handleBlur, resetTextareaHeight, attachRandomEyeMovement } from './APP'
import { CodeBlock } from './code.tsx'
import './App.css'
import { useState, useRef, useEffect } from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import { Generation, Validation } from './api/api.ts'


function App() {

    const [inputValue, setInputValue] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [promptHistory, setPromptHistory] = useState<{ full: string, truncated: string }[]>([])
    const [displayedContent, setDisplayedContent] = useState<string>('')
    const [validationResults, setValidationResults] = useState<any[]>([])
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
            setSidebarOpen(false)

            Generation.post(trimmedValue).then(res => {
                setDisplayedContent(res.content);
                Validation.post(res.content).then((data) => {
                    setValidationResults(data);
                });
            });



        }
    }

    const handleHistoryClick = (historyItem: { full: string, truncated: string }) => {
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

                <main>
                    <div className="logo">
                        <h1 className="app-title">
                            Arg
                            <span className="animated-eye-inline">
                                <div className="eye-white">
                                    <div id="iris" className="iris" ref={eyeIrisRef}>
                                        <div id="pupil" className="pupil"></div>
                                    </div>
                                </div>
                            </span>
                            s
                        </h1>
                        <h2>Secure Code at a Glance</h2>
                    </div>


                    {!hideInput && (
                        <div className="card">
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className="inputBox"
                                placeholder="(Put a code snippet here)"
                                rows={3}
                            />

                            <div className="button-container">
                                <button onClick={handlePromptSubmit}>Submit</button>
                            </div>
                        </div>
                    )}

                    {/* AI-style Response Display Area */}
                    {showDisplay && (
                        <div className="response-container">
                            <div className="response-header">
                                <div className="header-buttons">
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

                                {/* Display Original Prompt */}
                                <div className="original-prompt-section">
                                    <CodeBlock
                                        text={displayedContent}
                                        isResponse={true}
                                        highlightLines={validationResults}
                                    />
                                </div>





                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

export default App
