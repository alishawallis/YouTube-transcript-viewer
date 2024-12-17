import React, { useState, useCallback } from 'react';
import { Share2, Clock, File, Youtube, Copy, AlertCircle } from 'lucide-react';

// Types
interface TranscriptResponse {
  success: boolean;
  transcript?: string;
  error?: string;
}

const YouTubeTranscriptPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      
      const data: TranscriptResponse = await response.json();
      
      if (!data.success || !data.transcript) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }
      
      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Copy failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Youtube className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold">YouTube Transcript Tool</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get YouTube Video Transcripts Instantly
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Convert any YouTube video into text format. Perfect for content creators, students, and professionals.
            </p>
          </div>

          {/* Main Tool */}
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }`}
              >
                {loading ? 'Getting Transcript...' : 'Get Transcript'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {transcript && (
              <div className="relative mt-8">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <span className={`text-sm ${copyStatus ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    {copyStatus}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Copy transcript"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {transcript}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} YouTube Transcript Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default YouTubeTranscriptPage;