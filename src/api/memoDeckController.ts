// 临时向后兼容文件 - 重新导出新API模块中的函数
export { 
  getDeckList as list,
  getDeckList as listAll,
  createDeck as add,
  createDeck as add1,
  updateDeck as edit,
  deleteDeck as del,
  deleteDeck as del1
} from './modules/memo'; 