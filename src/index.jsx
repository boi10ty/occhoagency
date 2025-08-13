import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import '@/index.css';
import Home from '@/page/home';
import FormInput from '@/page/form-input';
import Verify from '@/page/verify';
import Favicon from '@/assets/facebook-logo.webp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <link rel='shortcut icon' href={Favicon} />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/form-input' element={<FormInput />} />
                <Route path='/verify' element={<Verify />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
