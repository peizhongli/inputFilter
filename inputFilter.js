/**
 *  实现功能
 *  1、处理中英文最大长度限制
 *  2、兼容目前大部分的移动端浏览器，ie9仿真情况下测试通过，chome测试通过，Firefox9.0以上测试通过(事件compositionend)
 */

//  获取字符串长度
const getLength = (val) => {
  let str = new String(val);
  let bytesCount = 0;
  for (let i = 0, n = str.length; i < n; i++) {
    let c = str.charCodeAt(i); // 返回字符的 Unicode 编码
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      bytesCount += 1; // 半角
    } else {
      bytesCount += 2; // 全角
    }
  }
  return bytesCount;
};
// 按照字节长度裁剪字符串
const cutStr = (str, len) => {

  let num = 0;
  let str1 = str;
  let newStr = '';
  for (let i = 0, lens = str1.length; i < lens; i++) {
    num += ((str1.charCodeAt(i) > 255) ? 2 : 1);
    if (num > len) {
      break;
    } else {
      newStr = str1.substring(0, i + 1);
    }
  }

  return newStr;
}

const addListener = function (el, type, fn) {
  el.addEventListener(type, fn, false)
}

const lengthFilter = function (el) {
  let maxLen = 0; // 初始时设置的最大长度
  let maxFlag = false; // 用于拦截检测到文字超长的标识
  let inputFlag = false; // 用于标识中文拼音的输入
  addListener(el, 'focus', () => {
    maxLen = el.getAttribute('maxlength')
    el.setAttribute('maxlength', maxLen * 2)
  })
  addListener(el, 'keydown', () => {
    let curLen = getLength(el.value)
    if (curLen >= maxLen * 2) {
      maxFlag = true;
    } else {
      maxFlag = false;
    }
  })
  addListener(el, 'compositionstart', () => {
    inputFlag = true;
  })
  addListener(el, 'compositionend', () => {
    inputFlag = false;
    if (maxFlag) {
      el.value = cutStr(el.value, maxLen * 2)
    }
  })
  addListener(el, 'input', () => {
    if (maxFlag && !inputFlag) {
      el.value = cutStr(el.value, maxLen * 2)
    }
  })
  addListener(el, 'blur', () => {
    el.setAttribute('maxlength', maxLen)
  })
  
}
export default {
  bind(el, binding) {
    if (el.tagName.toLowerCase() !== 'input') {
      el = el.getElementsByTagName('input')[0]
    }
    lengthFilter(el)
  }
}
