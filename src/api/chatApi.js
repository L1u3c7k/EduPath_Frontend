import api from "./api";

export const fetchInitializeChatApi = async (message) => {
  const response = await api.post("/chat/", { message });
  return response.data;
};


export const fetchSendMessageApi = async (chatId, message) => {
  const response = await api.post(`/chat/${chatId}/msg`, { message });
  return response.data;
};


export const fetchGetChatHistoryApi = async (chatId) => {
  const response = await api.get(`/chat/${chatId}`);
  return response.data;
};
export const fetchGetChatSessions=async()=>{
  const response = await api.get("chat/")
  console.log (response)
  return response.data
}

export const fetchGetLatestUserMessagesApi = async (chatId) => {
  const response = await api.get(`/chat/${chatId}/latest_user_messages`);
  return response.data;
};

/**
 * 5. Update chat title
 * PATCH /api/v1/chats/{chat_id}
 */
export const updateChatTitleApi = async (chatId, title) => {
  const response = await api.patch(`/chat/${chatId}`, { title });
  return response.data;
};

/**
 * 6. Delete chat session
 * DELETE /api/v1/chats/{chat_id}
 */
export const deleteChatApi = async (chatId) => {
  await api.delete(`/chat/${chatId}`);
};

/**
 * 7. Update an edited user message and regenerate response
 * PATCH /api/v1/chats/{chat_id}/{message_id}
 */
export const updateMessageApi = async (chatId, messageId, newText) => {
  const response = await api.patch(`/chat/${chatId}/${messageId}`, {
    message: newText,
  });
  return response.data;
};