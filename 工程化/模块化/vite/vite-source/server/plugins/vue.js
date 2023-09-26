const {
  parse,
  compileScript,
  rewriteDefault,
  compileTemplate,
  compileStyleAsync,
} = require('vue/compiler-sfc');
const fs = require('fs');
const hash = require('hash-sum');
const descriptorCache = new Map();
function vue() {
  let root;
  return {
    name: 'vue',
    config(config) {
      root = config.root;
      return {
        // config 中的 define 会经过 define 插件将其替换掉
        // 这是实现的是支持环境变量的功能
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        },
      };
    },
    async load(id) {
      const { filename, query } = parseVueRequest(id);
      if (query.has('vue')) {
        const descriptor = await getDescriptor(filename, root);
        if (query.get('type') === 'style') {
          let block = descriptor.styles[Number(query.get('index'))];
          if (block) {
            return { code: block.content };
          }
        }
      }
    },
    async transform(code, id) {
      // 32. 处理 vue 文件请求
      const { filename, query } = parseVueRequest(id);
      if (filename.endsWith('.vue')) {
        // 38. 对于 css 会再次发出一个 css 请求
        if (query.get('type') === 'style') {
          const descriptor = await getDescriptor(filename, root);
          // 39. 将 css 转成 js 返回值客户端
          let result = await transformStyle(
            code,
            descriptor,
            query.get('index')
          );
          return result;
        } else {
          // 33. 使用 vue/compiler-sfc 对 vue 单文件组件进行编译
          let result = await transformMain(code, filename);
          return result;
        }
      }
      return null;
    },
  };
}

async function transformStyle(code, descriptor, index) {
  const block = descriptor.styles[index];
  //如果是CSS，其实翻译之后和翻译之前内容是一样的
  const result = await compileStyleAsync({
    filename: descriptor.filename,
    source: code,
    id: `data-v-${descriptor.id}`, //必须传递，不然报错
    scoped: block.scoped,
  });
  let styleCode = result.code;
  const injectCode =
    `\nvar  style = document.createElement('style');` +
    `\nstyle.innerHTML = ${JSON.stringify(styleCode)};` +
    `\ndocument.head.appendChild(style);`;
  return {
    code: injectCode,
  };
}
function genStyleCode(descriptor, filename) {
  let styleCode = '';
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style, index) => {
      const query = `?vue&type=style&index=${index}&lang=css`;
      const styleRequest = (filename + query).replace(/\\/g, '/');
      styleCode += `\nimport ${JSON.stringify(styleRequest)}`;
    });
    return styleCode;
  }
}
async function getDescriptor(filename, root) {
  let descriptor = descriptorCache.get(filename);
  if (descriptor) return descriptor;
  const content = await fs.promises.readFile(filename, 'utf8');
  const result = parse(content, { filename });
  descriptor = result.descriptor;
  descriptor.id = hash(path.relative(root, filename));
  descriptorCache.set(filename, descriptor);
  return descriptor;
}
async function transformMain(source, filename) {
  const descriptor = await getDescriptor(filename);
  // 34. 处理 js
  const scriptCode = genScriptCode(descriptor, filename);
  // 35. 处理 html
  const templateCode = genTemplateCode(descriptor, filename);
  // 36. 处理 css
  const stylesCode = genStyleCode(descriptor, filename);
  // 37. 将编译后的所有内容 拼接成 js 字符串 返回到客户端
  let resolvedCode = [
    stylesCode,
    templateCode,
    scriptCode,
    `_sfc_main['render'] = render`,
    `export default _sfc_main`,
  ].join('\n');
  return { code: resolvedCode };
}

function genScriptCode(descriptor, id) {
  let scriptCode = '';
  let script = compileScript(descriptor, { id });
  if (!script.lang) {
    scriptCode = rewriteDefault(script.content, '_sfc_main');
  }
  return scriptCode;
}
function genTemplateCode(descriptor, id) {
  let content = descriptor.template.content;
  const result = compileTemplate({ source: content, id });
  return result.code;
}
function parseVueRequest(id) {
  const [filename, querystring = ''] = id.split('?');
  let query = new URLSearchParams(querystring);
  return {
    filename,
    query,
  };
}
module.exports = vue;
