"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
// URL validation regex
var YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
// Constants for rate limiting and security
var MAX_REQUESTS_PER_MINUTE = 10;
var REQUEST_TIMEOUT_MS = 10000;
// Custom hook for rate limiting
var useRateLimit = function (limit, timeWindow) {
    var _a = (0, react_1.useState)([]), requests = _a[0], setRequests = _a[1];
    var checkRateLimit = (0, react_1.useCallback)(function () {
        var now = Date.now();
        var windowStart = now - timeWindow;
        var recentRequests = requests.filter(function (time) { return time > windowStart; });
        return recentRequests.length < limit;
    }, [requests, limit, timeWindow]);
    var addRequest = (0, react_1.useCallback)(function () {
        var now = Date.now();
        setRequests(function (prev) { return __spreadArray(__spreadArray([], prev, true), [now], false); });
    }, []);
    // Clean up old requests
    (0, react_1.useEffect)(function () {
        var cleanup = setInterval(function () {
            var now = Date.now();
            var windowStart = now - timeWindow;
            setRequests(function (prev) { return prev.filter(function (time) { return time > windowStart; }); });
        }, timeWindow);
        return function () { return clearInterval(cleanup); };
    }, [timeWindow]);
    return { checkRateLimit: checkRateLimit, addRequest: addRequest };
};
// Main transcript viewer component
var YouTubeTranscriptViewer = function () {
    var _a = (0, react_1.useState)(''), url = _a[0], setUrl = _a[1];
    var _b = (0, react_1.useState)(''), transcript = _b[0], setTranscript = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(''), copyStatus = _e[0], setCopyStatus = _e[1];
    // Rate limiting hook
    var _f = useRateLimit(MAX_REQUESTS_PER_MINUTE, 60000), checkRateLimit = _f.checkRateLimit, addRequest = _f.addRequest;
    // URL validation
    var isValidUrl = (0, react_1.useCallback)(function (url) {
        try {
            if (!YOUTUBE_URL_REGEX.test(url))
                return false;
            var urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        }
        catch (_a) {
            return false;
        }
    }, []);
    // Extract video ID from URL
    var getVideoId = (0, react_1.useCallback)(function (url) {
        try {
            var urlObj = new URL(url);
            var videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            return videoId;
        }
        catch (_a) {
            return null;
        }
    }, []);
    // Handle form submission
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var videoId, controller_1, timeoutId, mockTranscript, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError('');
                    setCopyStatus('');
                    // Validate URL
                    if (!isValidUrl(url)) {
                        setError('Please enter a valid YouTube URL');
                        return [2 /*return*/];
                    }
                    // Check rate limit
                    if (!checkRateLimit()) {
                        setError('Too many requests. Please try again later.');
                        return [2 /*return*/];
                    }
                    videoId = getVideoId(url);
                    if (!videoId) {
                        setError('Could not extract video ID from URL');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    addRequest();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    controller_1 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_1.abort(); }, REQUEST_TIMEOUT_MS);
                    mockTranscript = "This is a sample transcript.\nIt would contain the actual YouTube video transcript.\nMultiple lines of text would appear here.\nRetrieved from your Python backend using youtube-transcript-api.";
                    // Simulate API delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Simulate API delay
                    _a.sent();
                    setTranscript(mockTranscript);
                    clearTimeout(timeoutId);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    if (err_1.name === 'AbortError') {
                        setError('Request timed out. Please try again.');
                    }
                    else {
                        setError('Failed to fetch transcript. Please try again later.');
                        console.error('Transcript fetch error:', err_1);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Handle copy to clipboard
    var copyToClipboard = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(transcript)];
                case 1:
                    _a.sent();
                    setCopyStatus('Copied!');
                    setTimeout(function () { return setCopyStatus(''); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setCopyStatus('Copy failed');
                    console.error('Copy error:', err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input type="url" value={url} onChange={function (e) { return setUrl(e.target.value); }} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required aria-label="YouTube URL" pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+" title="Please enter a valid YouTube URL"/>
        </div>
        <button type="submit" disabled={loading} className={"w-full py-3 px-4 rounded-lg text-white font-medium transition-all\n            ".concat(loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700')} aria-busy={loading}>
          {loading ? 'Getting Transcript...' : 'Get Transcript'}
        </button>
      </form>

      {error && (<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
          <lucide_react_1.AlertCircle className="w-5 h-5"/>
          <span>{error}</span>
        </div>)}

      {transcript && (<div className="relative mt-8">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className={"text-sm ".concat(copyStatus ? 'opacity-100' : 'opacity-0', " transition-opacity duration-200")}>
              {copyStatus}
            </span>
            <button onClick={copyToClipboard} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Copy transcript" aria-label="Copy transcript">
              <lucide_react_1.Copy className="w-5 h-5 text-gray-600"/>
            </button>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <pre className="whitespace-pre-wrap font-sans text-gray-700">
              {transcript}
            </pre>
          </div>
        </div>)}
    </div>);
};
// Landing page component
var YouTubeTranscriptPage = function () {
    // Track page views for analytics
    (0, react_1.useEffect)(function () {
        try {
            // Add your analytics code here
            // Example: gtag('event', 'page_view')
        }
        catch (error) {
            console.error('Analytics error:', error);
        }
    }, []);
    return (<div className="min-h-screen flex flex-col">
      {/* Header/Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <lucide_react_1.Youtube className="h-8 w-8 text-red-600" aria-hidden="true"/>
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
    </div>);
};
// Helper Components (same as before but with added accessibility attributes)
var FeatureCard = function (_a) {
    var icon = _a.icon, title = _a.title, description = _a.description;
    return (<div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
    <div className="w-12 h-12 mx-auto mb-4 text-blue-500" aria-hidden="true">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>);
};
var Step = function (_a) {
    var number = _a.number, title = _a.title, description = _a.description;
    return (<div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4" aria-hidden="true">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>);
};
var FAQItem = function (_a) {
    var question = _a.question, answer = _a.answer;
    return (<div className="border-b border-gray-200 pb-6">
    <h3 className="text-lg font-semibold mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>);
};
exports.default = YouTubeTranscriptPage;
