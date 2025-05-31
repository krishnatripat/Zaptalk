export const HOST="https://zaptalk-2.onrender.com";
const AUTH_ROUTE=`${HOST}/api/auth`;
const MESSAGES_ROUTE=`${HOST}/api/messages`;
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;

export const ONBOARD_USER_ROUTE=`${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS=`${AUTH_ROUTE}/get-contacts`;
export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-messages`;
export const GET_MESSAGES_ROUTE=`${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE=`${MESSAGES_ROUTE}/get-initial-contacts`;
// export const GETR_CALL_TOKEN=`${AUTH_ROUTE}/generate-token`;
export const GETR_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`;  // No query params here
