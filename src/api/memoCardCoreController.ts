// 临时向后兼容文件 - 重新导出新API模块中的函数
export { 
  getCardList as list,
  operateCard as operate,
  getStudyTest as test
} from './modules/memo'; 