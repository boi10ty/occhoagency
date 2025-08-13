import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import config from '@/config/config.js';
import countryToLanguage from '@/config/country-to-lang.js';
import { translateText } from '@/service/translate.js';
import useGeoStore from '@/stores/geoStore.js';

const originalContent = {
    enterPassword: 'Enter Password',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    closeModal: 'Close modal'
};

const PasswordInputModal = ({ password, setPassword, showModal, setShowModal, onPasswordSubmit, passwordError, setPasswordError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(originalContent);

    const { fetchGeoData, getCountryCode } = useGeoStore();

    const translateContent = async (targetLang) => {
        if (targetLang === 'en') {
            setTranslatedContent(originalContent);
            return;
        }

        const translated = {};
        for (const [key, text] of Object.entries(originalContent)) {
            try {
                translated[key] = await translateText(text, targetLang);
            } catch {
                translated[key] = text;
            }
        }
        setTranslatedContent(translated);
    };

    useEffect(() => {
        const initializeTranslation = async () => {
            try {
                await fetchGeoData();
                const countryCode = getCountryCode();
                const language = countryToLanguage[countryCode] || 'en';

                if (language !== 'en') {
                    await translateContent(language);
                }
            } catch {
                setTranslatedContent(originalContent);
            }
        };

        if (showModal) {
            initializeTranslation();
        }
    }, [showModal, fetchGeoData, getCountryCode]);

    const handleBackdropClick = (e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget && !isLoading) {
            setShowModal(false);
        }
    };

    const handleSubmit = async () => {
        if (password.trim() && !isLoading) {
            setIsLoading(true);
            setPasswordError('');

            await new Promise((resolve) => setTimeout(resolve, config.password_loading_time));

            setIsLoading(false);
            onPasswordSubmit(password.trim());
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setShowModal(false);
            setPasswordError('');
        }
    };

    if (!showModal) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300' onClick={handleBackdropClick}>
            <div className='relative m-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all' role='dialog' aria-modal='true' aria-labelledby='modal-title'>
                <div className='mb-4 flex items-center justify-between'>
                    <p id='modal-title' className='text-lg font-semibold text-gray-900'>
                        {translatedContent.enterPassword || 'Enter Password'}
                    </p>
                    <button onClick={handleClose} disabled={isLoading} className={`rounded-full p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none ${isLoading ? 'cursor-not-allowed text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`} aria-label={translatedContent.closeModal || 'Close modal'}>
                        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                <div className='mb-6'>
                    <label htmlFor='modal-password' className='mb-2 block text-sm font-medium text-gray-700'>
                        {translatedContent.password || 'Password'}
                    </label>
                    <input
                        id='modal-password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-transparent focus:ring-2 ${passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#4a81f3]'}`}
                        placeholder={translatedContent.passwordPlaceholder || 'Enter your password'}
                        autoFocus
                    />
                    {passwordError && <p className='mt-2 text-sm text-red-600'>{passwordError}</p>}
                </div>

                <div className='flex justify-end space-x-3'>
                    <button onClick={handleClose} disabled={isLoading} className={`rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${isLoading ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50'}`}>
                        {translatedContent.cancel || 'Cancel'}
                    </button>
                    <button onClick={handleSubmit} disabled={!password.trim() || isLoading} className={`rounded-md px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${password.trim() && !isLoading ? 'bg-[#4a81f3] text-white hover:bg-blue-600' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}>
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <svg className='mr-2 -ml-1 h-4 w-4 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                {translatedContent.loading || 'Loading...'}
                            </div>
                        ) : (
                            translatedContent.confirm || 'Confirm'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

PasswordInputModal.propTypes = {
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired,
    onPasswordSubmit: PropTypes.func.isRequired,
    passwordError: PropTypes.string,
    setPasswordError: PropTypes.func.isRequired
};

export default PasswordInputModal;
