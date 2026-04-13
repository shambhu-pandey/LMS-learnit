import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/Terminal.css';

const Terminal = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('python');
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultCode = (lang) => {
    switch(lang) {
      case 'python':
        return 'print("Hello, World!")';
      case 'javascript':
        return 'console.log("Hello, World!");';
      case 'java':
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
      default:
        return '';
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
    setOutput('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post('/api/terminal/execute', {
        code,
        language
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setOutput(response.data.output);
        if (response.data.output) {
          toast.success('Code executed successfully!');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
      setOutput(error.response?.data?.output || '');
      toast.error('Code execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-container">
      <h2 className="terminal-title">Code Terminal</h2>
      
      <div className="language-selector">
        <label htmlFor="language">Programming Language:</label>
        <select 
          id="language"
          value={language} 
          onChange={handleLanguageChange}
          className="language-select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <div className="editor-section">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="code-editor"
          spellCheck="false"
        />
      </div>

      <button 
        onClick={handleSubmit}
        disabled={isLoading || !code.trim()}
        className="run-button"
      >
        {isLoading ? 'Running...' : 'Run Code'}
      </button>

      <div className="output-section">
        <h3>Output:</h3>
        <pre className={`output-display ${error ? 'error' : ''}`}>
          {error ? `Error: ${error}\n\n${output}` : output || 'Code output will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default Terminal;