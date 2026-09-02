import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { LightboxProvider } from './context/LightboxContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';

import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Lazy Loaded Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const JourneyPage = lazy(() => import('./pages/public/JourneyPage').then((m) => ({ default: m.JourneyPage })));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const VideosPage = lazy(() => import('./pages/public/VideosPage').then((m) => ({ default: m.VideosPage })));
const FriendsPage = lazy(() => import('./pages/public/FriendsPage').then((m) => ({ default: m.FriendsPage })));
const MemoryDetailPage = lazy(() => import('./pages/public/MemoryDetailPage').then((m) => ({ default: m.MemoryDetailPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy Loaded Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminMemoriesPage = lazy(() => import('./pages/admin/AdminMemoriesPage').then((m) => ({ default: m.AdminMemoriesPage })));
const AdminMemoryEditorPage = lazy(() => import('./pages/admin/AdminMemoryEditorPage').then((m) => ({ default: m.AdminMemoryEditorPage })));
const AdminChaptersPage = lazy(() => import('./pages/admin/AdminChaptersPage').then((m) => ({ default: m.AdminChaptersPage })));
const AdminChapterEditorPage = lazy(() => import('./pages/admin/AdminChapterEditorPage').then((m) => ({ default: m.AdminChapterEditorPage })));
const AdminFriendsPage = lazy(() => import('./pages/admin/AdminFriendsPage').then((m) => ({ default: m.AdminFriendsPage })));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage').then((m) => ({ default: m.AdminMessagesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LightboxProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner message="Opening the memory vault..." />}>
                <Routes>
                  {/* Public Scrapbook Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/journey" element={<JourneyPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/videos" element={<VideosPage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/memory/:id" element={<MemoryDetailPage />} />
                    <Route path="/memory/slug/:slug" element={<MemoryDetailPage />} />
                  </Route>

                  {/* Admin Auth Route */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="memories" element={<AdminMemoriesPage />} />
                    <Route path="memories/create" element={<AdminMemoryEditorPage />} />
                    <Route path="memories/:id/edit" element={<AdminMemoryEditorPage />} />
                    
                    <Route path="chapters" element={<AdminChaptersPage />} />
                    <Route path="chapters/create" element={<AdminChapterEditorPage />} />
                    <Route path="chapters/:id/edit" element={<AdminChapterEditorPage />} />
                    
                    <Route path="friends" element={<AdminFriendsPage />} />
                    <Route path="messages" element={<AdminMessagesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
          </LightboxProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
