/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Scanner } from './pages/Scanner';
import { Result } from './pages/Result';
import { Saved } from './pages/Saved';
import { About } from './pages/About';
import { Explore } from './pages/Explore';
import { Passport } from './pages/Passport';
import { SiteGuide } from './pages/SiteGuide';
import { NearbyPage } from './pages/NearbyPage';
import { DailyHeritage } from './pages/DailyHeritage';
import { AudioWalk } from './pages/AudioWalk';
import { useEffect, useState } from 'react';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('hasOnboarded') === 'true';
    setHasOnboarded(onboarded);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setHasOnboarded(true);
  };

  if (hasOnboarded === null) return null;

  return (
    <BrowserRouter>
      {!hasOnboarded ? (
        <Routes>
          <Route path="*" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Scanner />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/result" element={<Result />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/guide" element={<SiteGuide />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/daily" element={<DailyHeritage />} />
            <Route path="/walk" element={<AudioWalk />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}
