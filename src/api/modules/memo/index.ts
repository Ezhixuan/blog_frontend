// 记忆卡相关API
import request from '../../../utils/core/request';
import type {
  MemoCardSubmitData,
  MemoCardOperateData,
  MemoQueryParams,
  MemoCardListResponse,
  MemoDeckListResponse,
  BooleanResponse,
  OperationById
} from '../../../types';

// ============= 记忆卡组相关 =============
/**
 * 获取记忆卡组列表
 */
export function getDeckList(): Promise<MemoDeckListResponse> {
  return request.get('/api/memo/deck/list');
}

/**
 * 创建记忆卡组
 */
export function createDeck(name: string): Promise<BooleanResponse> {
  return request.post('/api/memo/deck/create', { name });
}

/**
 * 更新记忆卡组
 */
export function updateDeck(id: number, name: string): Promise<BooleanResponse> {
  return request.put('/api/memo/deck/update', { id, name });
}

/**
 * 删除记忆卡组
 */
export function deleteDeck(data: OperationById): Promise<BooleanResponse> {
  return request.delete('/api/memo/deck/delete', { data });
}

// ============= 记忆卡相关 =============
/**
 * 获取记忆卡列表
 */
export function getCardList(params: MemoQueryParams): Promise<MemoCardListResponse> {
  return request.get('/api/memo/card/list', { params });
}

/**
 * 创建记忆卡
 */
export function createCard(data: MemoCardSubmitData): Promise<BooleanResponse> {
  return request.post('/api/memo/card/submit', data);
}

/**
 * 更新记忆卡
 */
export function updateCard(data: MemoCardSubmitData): Promise<BooleanResponse> {
  return request.post(`/api/memo/card/submit`, data);
}

/**
 * 删除记忆卡
 */
export function deleteCard(data: OperationById): Promise<BooleanResponse> {
  return request.delete('/api/memo/card', { data });
}

/**
 * 记忆卡操作（学习、复习等）
 */
export function operateCard(data: MemoCardOperateData): Promise<BooleanResponse> {
  return request.post('/api/memo/card/operate', data);
}

/**
 * 获取学习测试
 */
export function getStudyTest(deckId?: number): Promise<MemoCardListResponse> {
  const params = deckId ? { deckId } : {};
  return request.get('/api/memo/card/test', { params });
} 