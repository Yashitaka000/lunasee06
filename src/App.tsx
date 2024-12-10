import React from 'react';
import { Header } from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { MainContent } from './components/MainContent';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Header />
          <MainContent />
        </div>
      </div>
    </AuthProvider>
  );
}