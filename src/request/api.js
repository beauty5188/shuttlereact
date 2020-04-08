import {post} from './http';
// 定制班线

//获取线路分类
export const lineClassify = param => post('/ccl/selectLineClassify', param);
//默认线路
export const defaultLine = param => post('/ccl/selectByLineClassifyId', param);