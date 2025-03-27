import request from '../utils/request'
import { ApiResponse, Friend } from './types'

// 获取友链列表
export function getFriendList() {
  return request<ApiResponse<Friend[]>>({
    url: '/api/friends',
    method: 'get',
  })
}

// 申请添加友链
export function applyFriend(data: Omit<Friend, 'id'>) {
  return request<ApiResponse<null>>({
    url: '/api/friends/apply',
    method: 'post',
    data,
  })
}