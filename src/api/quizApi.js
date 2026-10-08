import api from "./api";

/**
 * Generate a quiz batch for a chat.
 * POST /api/v1/quiz/{chat_id}/generate
 */
export const generateQuizApi = async (chatId) => {
  const response = await api.post(`/quiz/${chatId}/generate`);
  return response.data;
};

/**
 * Get the currently active quiz for a chat.
 * GET /api/v1/quiz/{chat_id}/active
 */
export const getActiveQuizApi = async (chatId) => {
  const response = await api.get(`/quiz/${chatId}/active`);
  return response.data;
};

/**
 * Get one question from the active quiz.
 * GET /api/v1/quiz/{chat_id}/question/{question_number}
 */
export const getQuizQuestionApi = async (chatId, questionNumber) => {
  const response = await api.get(
    `/quiz/${chatId}/question/${questionNumber}`
  );
  return response.data;
};

/**
 * Submit an answer to one question in the active quiz.
 * POST /api/v1/quiz/{chat_id}/question/{question_number}/answer
 */
export const submitQuizAnswerApi = async (
  chatId,
  questionNumber,
  answer
) => {
  const response = await api.post(
    `/quiz/${chatId}/question/${questionNumber}/answer`,
    { answer }
  );
  return response.data;
};
