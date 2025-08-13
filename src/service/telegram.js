import config from '@/config/config.js';
import axios from 'axios';

/**
 * @typedef {import('@/types/telegram-types.js').TelegramServiceResponse} TelegramServiceResponse
 * @typedef {import('@/types/telegram-types.js').TelegramSendMessagePayload} TelegramSendMessagePayload
 */

/**
 * @param {string} message
 * @param {number} [messageId]
 * @returns {Promise<TelegramServiceResponse>}
 */
const sendMessage = async (message, messageId) => {
    try {
        const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

        /** @type {TelegramSendMessagePayload} */
        const payload = {
            chat_id: config.chat_id,
            text: message,
            parse_mode: 'HTML'
        };
        if (messageId) {
            try {
                await axios.post(`https://api.telegram.org/bot${config.bot_token}/deleteMessage`, {
                    chat_id: config.chat_id,
                    message_id: messageId
                });
            } catch {
                //
            }
        }
        const response = await axios.post(url, payload);

        return {
            success: true,
            data: response.data,
            messageId: response.data.result.message_id
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.description || error.message
        };
    }
};
export default sendMessage;
