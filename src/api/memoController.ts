// 临时向后兼容文件 - 重新导出新API模块中的函数
export { 
  getCardList as list,
  createCard as add,
  updateCard as update,
  deleteCard as del,
  operateCard
} from './modules/memo'; 