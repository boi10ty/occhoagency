/**
 * @param {string} text
 * @param {string} targetLang
 * @returns {Promise<string>}
 */
export const translateText = async (text, targetLang) => {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0][0][0];
    } catch {
        return text;
    }
};
