/**
 * @typedef {Object} TelegramUser
 * @property {number} id - Unique identifier for this user or bot
 * @property {boolean} is_bot - True, if this user is a bot
 * @property {string} first_name - User's or bot's first name
 * @property {string} [last_name] - Optional. User's or bot's last name
 * @property {string} [username] - Optional. User's or bot's username
 * @property {string} [language_code] - Optional. IETF language tag of the user's language
 * @property {boolean} [is_premium] - Optional. True, if this user is a Telegram Premium user
 * @property {boolean} [added_to_attachment_menu] - Optional. True, if this user added the bot to the attachment menu
 * @property {boolean} [can_join_groups] - Optional. True, if the bot can be invited to groups
 * @property {boolean} [can_read_all_group_messages] - Optional. True, if privacy mode is disabled for the bot
 * @property {boolean} [supports_inline_queries] - Optional. True, if the bot supports inline queries
 * @property {boolean} [can_connect_to_business] - Optional. True, if the bot can be connected to a Telegram Business account
 * @property {boolean} [has_main_web_app] - Optional. True, if the bot has a main Web App
 */

/**
 * @typedef {Object} TelegramChat
 * @property {number} id - Unique identifier for this chat
 * @property {string} type - Type of the chat, can be either "private", "group", "supergroup" or "channel"
 * @property {string} [title] - Optional. Title, for supergroups, channels and group chats
 * @property {string} [username] - Optional. Username, for private chats, supergroups and channels if available
 * @property {string} [first_name] - Optional. First name of the other party in a private chat
 * @property {string} [last_name] - Optional. Last name of the other party in a private chat
 * @property {boolean} [is_forum] - Optional. True, if the supergroup chat is a forum
 */

/**
 * @typedef {Object} MessageEntity
 * @property {string} type - Type of the entity
 * @property {number} offset - Offset in UTF-16 code units to the start of the entity
 * @property {number} length - Length of the entity in UTF-16 code units
 * @property {string} [url] - Optional. For "text_link" only, URL that will be opened after user taps on the text
 * @property {TelegramUser} [user] - Optional. For "text_mention" only, the mentioned user
 * @property {string} [language] - Optional. For "pre" only, the programming language of the entity text
 * @property {string} [custom_emoji_id] - Optional. For "custom_emoji" only, unique identifier of the custom emoji
 */

/**
 * @typedef {Object} TelegramMessage
 * @property {number} message_id - Unique message identifier inside this chat
 * @property {number} [message_thread_id] - Optional. Unique identifier of a message thread to which the message belongs; for supergroups only
 * @property {TelegramUser} [from] - Optional. Sender of the message; may be empty for messages sent to channels
 * @property {TelegramChat} [sender_chat] - Optional. Sender of the message when sent on behalf of a chat
 * @property {number} [sender_boost_count] - Optional. If the sender of the message boosted the chat, the number of boosts added by the user
 * @property {TelegramUser} [sender_business_bot] - Optional. The bot that actually sent the message on behalf of the business account
 * @property {number} date - Date the message was sent in Unix time
 * @property {string} [business_connection_id] - Optional. Unique identifier of the business connection from which the message was received
 * @property {TelegramChat} chat - Chat the message belongs to
 * @property {Object} [forward_origin] - Optional. Information about the original message for forwarded messages
 * @property {boolean} [is_topic_message] - Optional. True, if the message is sent to a forum topic
 * @property {boolean} [is_automatic_forward] - Optional. True, if the message is a channel post that was automatically forwarded
 * @property {TelegramMessage} [reply_to_message] - Optional. For replies in the same chat and message thread, the original message
 * @property {Object} [external_reply] - Optional. Information about the message that is being replied to
 * @property {Object} [quote] - Optional. For replies that quote part of the original message, the quoted part of the message
 * @property {Object} [reply_to_story] - Optional. For replies to a story, the original story
 * @property {TelegramUser} [via_bot] - Optional. Bot through which the message was sent
 * @property {number} [edit_date] - Optional. Date the message was last edited in Unix time
 * @property {boolean} [has_protected_content] - Optional. True, if the message can't be forwarded
 * @property {boolean} [is_from_offline] - Optional. True, if the message was sent by an implicit action
 * @property {string} [media_group_id] - Optional. The unique identifier of a media message group this message belongs to
 * @property {string} [author_signature] - Optional. Signature of the post author for messages in channels
 * @property {number} [paid_star_count] - Optional. The number of Telegram Stars that were paid by the sender
 * @property {string} [text] - Optional. For text messages, the actual UTF-8 text of the message
 * @property {MessageEntity[]} [entities] - Optional. For text messages, special entities like usernames, URLs, bot commands, etc.
 * @property {Object} [link_preview_options] - Optional. Options used for link preview generation for the message
 * @property {string} [effect_id] - Optional. Unique identifier of the message effect added to the message
 * @property {Object} [animation] - Optional. Message is an animation, information about the animation
 * @property {Object} [audio] - Optional. Message is an audio file, information about the file
 * @property {Object} [document] - Optional. Message is a general file, information about the file
 * @property {Object} [paid_media] - Optional. Message contains paid media; information about the paid media
 * @property {Object[]} [photo] - Optional. Message is a photo, available sizes of the photo
 * @property {Object} [sticker] - Optional. Message is a sticker, information about the sticker
 * @property {Object} [story] - Optional. Message is a forwarded story
 * @property {Object} [video] - Optional. Message is a video, information about the video
 * @property {Object} [video_note] - Optional. Message is a video note, information about the video message
 * @property {Object} [voice] - Optional. Message is a voice message, information about the file
 * @property {string} [caption] - Optional. Caption for the animation, audio, document, paid media, photo, video or voice
 * @property {MessageEntity[]} [caption_entities] - Optional. For messages with a caption, special entities
 * @property {boolean} [show_caption_above_media] - Optional. True, if the caption must be shown above the message media
 * @property {boolean} [has_media_spoiler] - Optional. True, if the message media is covered by a spoiler animation
 * @property {Object} [contact] - Optional. Message is a shared contact, information about the contact
 * @property {Object} [dice] - Optional. Message is a dice with random value
 * @property {Object} [game] - Optional. Message is a game, information about the game
 * @property {Object} [poll] - Optional. Message is a native poll, information about the poll
 * @property {Object} [venue] - Optional. Message is a venue, information about the venue
 * @property {Object} [location] - Optional. Message is a shared location, information about the location
 * @property {TelegramUser[]} [new_chat_members] - Optional. New members that were added to the group or supergroup
 * @property {TelegramUser} [left_chat_member] - Optional. A member was removed from the group
 * @property {string} [new_chat_title] - Optional. A chat title was changed to this value
 * @property {Object[]} [new_chat_photo] - Optional. A chat photo was change to this value
 * @property {boolean} [delete_chat_photo] - Optional. Service message: the chat photo was deleted
 * @property {boolean} [group_chat_created] - Optional. Service message: the group has been created
 * @property {boolean} [supergroup_chat_created] - Optional. Service message: the supergroup has been created
 * @property {boolean} [channel_chat_created] - Optional. Service message: the channel has been created
 * @property {Object} [reply_markup] - Optional. Inline keyboard attached to the message
 */

/**
 * @typedef {Object} TelegramApiResponse
 * @property {boolean} ok - True if the request was successful
 * @property {string} [description] - Optional. Human-readable description of the result
 * @property {number} [error_code] - Optional. Error code returned by the API
 * @property {Object} [parameters] - Optional. Additional parameters, like retry_after
 */

/**
 * @typedef {TelegramApiResponse} SendMessageResponse
 * @property {TelegramMessage} [result] - Optional. The sent message object if successful
 */

/**
 * @typedef {Object} TelegramSendMessagePayload
 * @property {string|number} chat_id - Unique identifier for the target chat or username of the target channel
 * @property {string} text - Text of the message to be sent, 1-4096 characters after entities parsing
 * @property {string} [parse_mode] - Optional. Mode for parsing entities in the message text
 * @property {MessageEntity[]} [entities] - Optional. A JSON-serialized list of special entities
 * @property {Object} [link_preview_options] - Optional. Link preview generation options for the message
 * @property {boolean} [disable_notification] - Optional. Sends the message silently
 * @property {boolean} [protect_content] - Optional. Protects the contents of the sent message from forwarding and saving
 * @property {boolean} [allow_paid_broadcast] - Optional. Pass True to allow up to 1000 messages per second
 * @property {string} [message_effect_id] - Optional. Unique identifier of the message effect to be added to the message
 * @property {Object} [reply_parameters] - Optional. Description of the message to reply to
 * @property {Object} [reply_markup] - Optional. Additional interface options
 */

/**
 * @typedef {Object} TelegramServiceResponse
 * @property {boolean} success - Indicates if the operation was successful
 * @property {SendMessageResponse} [data] - Optional. The full Telegram API response if successful
 * @property {string} [error] - Optional. Error message if the operation failed
 */

export { TelegramUser, TelegramChat, MessageEntity, TelegramMessage, TelegramApiResponse, SendMessageResponse, TelegramSendMessagePayload, TelegramServiceResponse };
