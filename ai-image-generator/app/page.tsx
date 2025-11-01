'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              AI Image Generator
            </h1>
            <p className="text-gray-300 text-lg">
              Transform your ideas into stunning images with AI
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={generateImage} className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-300 text-lg">Creating your masterpiece...</p>
            </div>
          )}

          {/* Generated Image */}
          {imageUrl && !loading && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden bg-black/20">
                <Image
                  src={imageUrl}
                  alt="Generated image"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <button
                onClick={downloadImage}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Download Image
              </button>
            </div>
          )}

          {/* Empty State */}
          {!imageUrl && !loading && !error && (
            <div className="text-center py-20 text-gray-400">
              <svg
                className="w-24 h-24 mx-auto mb-6 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg">Enter a prompt above to generate your first image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
