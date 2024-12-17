import React, { useState, useCallback, useEffect } from 'react';
import { Share2, Clock, File, Youtube, Copy, AlertCircle } from 'lucide-react';

// URL validation regex
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

// Constants for rate limiting and security
const MAX_REQUESTS_PER_MINUTE = 10;
const REQUEST_TIMEOUT_MS = 10000;

// Custom hook for rate limiting
const useRateLimit = (limit, timeWindow) => {
  const [requests, setRequests] = useState([]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - timeWindow;
    const recentRequests = requests.filter(time => time > windowStart);
    return recentRequests.length < limit;
  }, [requests, limit, timeWindow]);

  const addRequest = useCallback(() => {
    const now = Date.now();
    setRequests(prev => [...prev, now]);
  }, []);

  // Clean up old requests
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const windowStart = now - timeWindow;
      setRequests(prev => prev.filter(time => time > windowStart));
    }, timeWindow);
    return () => clearInterval(cleanup);
  }, [timeWindow]);

  return { checkRateLimit, addRequest };
};

// Main transcript viewer component
const YouTubeTranscriptViewer = () => {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // Rate limiting hook
  const { checkRateLimit, addRequest } = useRateLimit(MAX_REQUESTS_PER_MINUTE, 60000);

  // URL validation
  const isValidUrl = useCallback((url) => {
    try {
      if (!YOUTUBE_URL_REGEX.test(url)) return false;
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // Extract video ID from URL
  const getVideoId = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
      return videoId;
    } catch {
      return null;
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCopyStatus('');

    // Validate URL
    if (!isValidUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Check rate limit
    if (!checkRateLimit()) {
      setError('Too many requests. Please try again later.');
      return;
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }

    setLoading(true);
    addRequest();

    try {
      // Set up request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      // This is a mock API call - replace with your actual backend endpoint
      const mockTranscript = `This is a sample transcript.
It would contain the actual YouTube video transcript.
Multiple lines of text would appear here.
Retrieved from your Python backend using youtube-transcript-api.`;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranscript(mockTranscript);

      clearTimeout(timeoutId);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to fetch transcript. Please try again later.');
        console.error('Transcript fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Copy failed');
      console.error('Copy error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
            aria-label="YouTube URL"
            pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+"
            title="Please enter a valid YouTube URL"
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
          aria-busy={loading}
        >
          {loading ? 'Getting Transcript...' : 'Get Transcript'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
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
              aria-label="Copy transcript"
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
  );
};

// Landing page component
const YouTubeTranscriptPage = () => {
  // Track page views for analytics
  useEffect(() => {
    try {
      // Add your analytics code here
      // Example: gtag('event', 'page_view')
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Youtube className="h-8 w-8 text-red-600" aria-hidden="true" />
              <span className="ml-2 text-xl font-bold">YouTube Transcript Tool</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get YouTube Video Transcripts Instantly
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Convert any YouTube video into text format. Perfect for content creators, students, and professionals.
            </p>
          </div>
          
          {/* Ad Space - Top */}
          {/* Uncomment and replace with your ad code when ready */}
          {/* <div id="top-ad" className="w-full h-32 mb-8" aria-label="Advertisement">
            <div data-ad-slot="your-ad-slot-id"></div>
          </div> */}

          {/* Main Tool */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <YouTubeTranscriptViewer />
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same but with added accessibility attributes */}
      {/* Features Section */}
      <section id="features" aria-labelledby="features-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-12">Key Features</h2>
          {/* ... rest of the features section ... */}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-16 bg-gray-50">
        {/* ... rest of the how it works section ... */}
      </section>

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-heading" className="py-16 bg-white">
        {/* ... rest of the FAQ section ... */}
      </section>

      {/* Bottom Ad Space */}
      {/* Uncomment and replace with your ad code when ready */}
      {/* <div id="bottom-ad" className="w-full h-32" aria-label="Advertisement">
        <div data-ad-slot="your-ad-slot-id"></div>
      </div> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        {/* ... rest of the footer ... */}
      </footer>
    </div>
  );
};

// Helper Components (same as before but with added accessibility attributes)
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
    <div className="w-12 h-12 mx-auto mb-4 text-blue-500" aria-hidden="true">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4" aria-hidden="true">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }) => (
  <div className="border-b border-gray-200 pb-6">
    <h3 className="text-lg font-semibold mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default YouTubeTranscriptPage;