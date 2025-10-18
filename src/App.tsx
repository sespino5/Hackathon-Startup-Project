
import './App.css'

function App() {
  

  return (
    <>
      <div>
        <h1> Check to see if your code is malicious</h1>
        <h2> Use the input box below to type your code </h2>
        <div className="card">
          <textarea 
            placeholder="Type your code here..." 
            rows={10}
            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
          />
          <button>Submit</button>
        </div>
      </div>
    </>
  )
}

export default App
