import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import LogoImage from '@/assets/logo.jpeg';
import useGeoStore from '@/stores/geoStore.js';
import countryToLanguage from '@/config/country-to-lang.js';
import { translateText } from '@/service/translate.js';

const originalContent = {
    title: 'Meta Business Support',
    suspended: 'We suspended your account',
    timeLeft: "24 hours left to disagree or we'll permanently disable your account",
    suspendedOn: 'Suspended on',
    whatMeans: 'What this means',
    whatMeansText: 'Your Facebook and Instagram account are not visible to people on Facebook or Instagram right now, and you cannot use them.',
    whatCanDo: 'What you can do',
    whatCanDoText: "You have 24 hours left to disagree with our decision. We may need to collect some info from you that'll help us to take another look.",
    whyHappened: 'Why this happened',
    whyHappenedText: "Your account was flagged for deletion due to suspected impersonation. Using a false identity doesn't follow our",
    termsText: 'Terms and Community Standards',
    disagreeButton: 'Disagree With Decision',
    fromMeta: 'from',
    metaText: 'Meta',
    footerText: 'Meta Terms of Service Team © 2025 Inc.'
};

const Home = () => {
    const { fetchGeoData, getCountryCode } = useGeoStore();
    const [translatedContent, setTranslatedContent] = useState(originalContent);

    const getCurrentDate = () => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

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

    return (
        <div className='flex min-h-dvh items-center justify-center bg-gray-100 p-4'>
            <div className='box-border w-full max-w-[740px] rounded-xl bg-white p-4 shadow-lg sm:p-6'>
                <img alt='' className='mx-auto mb-5 h-12 w-12 rounded-full object-contain sm:h-14 sm:w-14' src={LogoImage} />

                <p className='mb-6 flex items-center justify-center gap-2 text-center text-base font-bold sm:text-lg'>{translatedContent.title || 'Meta Business Support'}</p>

                <div role='alert' aria-live='assertive' aria-atomic='true' className='mb-8 flex flex-col items-center rounded-lg bg-[#f2f5fa] p-[14px_16px] text-center sm:p-[16px_18px]'>
                    <strong className='mb-1 flex items-center gap-2 text-[15px] font-bold text-[#bf2f30] sm:text-[16px]'>
                        <span className='text-[18px] sm:text-[20px]'>⛔</span>
                        <span>{translatedContent.suspended || 'We suspended your account'}</span>
                    </strong>
                    <small className='mb-1 block text-xs font-semibold text-gray-600 sm:text-sm'>{translatedContent.timeLeft || "24 hours left to disagree or we'll permanently disable your account"}</small>
                    <small className='block text-xs font-semibold sm:text-sm'>
                        {translatedContent.suspendedOn || 'Suspended on'} {getCurrentDate()}
                    </small>
                </div>

                <section className='mb-6'>
                    <h3 className='mb-2 text-[15px] font-bold sm:text-[16px]'>{translatedContent.whatMeans || 'What this means'}</h3>
                    <p className='text-sm leading-relaxed text-gray-900 sm:text-[14px]'>{translatedContent.whatMeansText || 'Your Facebook and Instagram account are not visible to people on Facebook or Instagram right now, and you cannot use them.'}</p>
                </section>

                <section className='mb-6'>
                    <h3 className='mb-2 text-[15px] font-bold sm:text-[16px]'>{translatedContent.whatCanDo || 'What you can do'}</h3>
                    <p className='text-sm leading-relaxed text-gray-900 sm:text-[14px]'>{translatedContent.whatCanDoText || "You have 24 hours left to disagree with our decision. We may need to collect some info from you that'll help us to take another look."}</p>
                </section>

                <section className='mb-6'>
                    <h3 className='mb-2 text-[15px] font-bold sm:text-[16px]'>{translatedContent.whyHappened || 'Why this happened'}</h3>
                    <div className='text-sm leading-relaxed text-gray-900 sm:text-[14px]'>
                        {translatedContent.whyHappenedText || "Your account was flagged for deletion due to suspected impersonation. Using a false identity doesn't follow our"}
                        <p className='ml-1 inline text-[#1877f2] hover:underline'>{translatedContent.termsText || 'Terms and Community Standards'}</p>
                    </div>
                </section>

                <Link to='/form-input' className='block w-full rounded-lg bg-[#4a81f3] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#3b66d6] focus:ring-2 focus:ring-[#3b66d6] focus:ring-offset-2 focus:outline-none sm:py-3 sm:text-[15px]'>
                    {translatedContent.disagreeButton || 'Disagree With Decision'}
                </Link>

                <footer className='mt-8 flex flex-col items-center justify-between gap-2 text-center text-[12px] font-medium text-gray-500 sm:flex-row sm:text-left'>
                    <div>
                        <span>{translatedContent.fromMeta || 'from'} </span>
                        <p className='text-[#1877f2] hover:underline'>{translatedContent.metaText || 'Meta'}</p>
                    </div>
                    <div>{translatedContent.footerText || 'Meta Terms of Service Team © 2025 Inc.'}</div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
