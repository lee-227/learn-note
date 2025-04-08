const axios = require("axios");
const ora = require("ora"); //loading的样式
const inquirer = require("inquirer"); //选择模板
console.log("--->");
let { promisify } = require("util");
let path = require("path");
let fs = require("fs");

let downloadGit = require("download-git-repo"); //拉取模板
//可以把异步的api转换成promise形式
downloadGit = promisify(downloadGit);

let { downLoadDirectory } = require("./constants");

let MetalSmith = require("metalsmith"); //遍历文件夹，找需不需要渲染

//consolidate 统一所有的模板引擎
let { render } = require("consolidate").ejs;
render = promisify(render);
let ncp = require("ncp");
ncp = promisify(ncp);

//create的功能是创建项目
//拉取你自己的所有的项目列出来 让用户选 安装哪个项目 projectName
//选择完成后，在显示所有的版本号 1.0
//可能还需要用户配置一些数据来结合来渲染项目
//获取项目列表
const fetchRepoList = async () => {
  let { data } = await axios.get("https://api.github.com/orgs/zhu-cli/repos");
  return data;
};

//封装loading

const waitFnloading = (fn, message) => async (...args) => {
  let spinner = ora(message);
  spinner.start();
  let result = await fn(...args);
  spinner.succeed();
  return result;
};
//抓取tag列表
const fetchTagList = async (repo) => {
  let { data } = await axios.get(
    `https://api.github.com/repos/zhu-cli/${repo}/tags`
  );
  return data;
};

let download = async (repo, tag) => {
  let api = `zhu-cli/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  let dest = `${downLoadDirectory}/${repo}`;
  console.log("dest", dest);
  await downloadGit(api, dest);
  return dest; //显示下载的最终目录
};

module.exports = async (projectName) => {
  console.log("projectName", projectName);
  try {
    let repos = await waitFnloading(fetchRepoList, "fetch template ....")();

    repos = repos.map((item) => item.name);
    // console.log("repos", repos);
    // let repos = ["easy-webpack-demo"];
    //选择模板 inquirer
    let { repo } = await inquirer.prompt({
      //在命令行中询问客户问题
      name: "repo", //获取选择后的结果
      type: "list",
      message: "please choise a template to create project",
      choices: repos,
    });

    console.log("repo", repo);
    //   return;

    //通过当前选择的项目，拉取对应的版本
    //获取对应的版本号
    let tags = await waitFnloading(fetchTagList, "fetch tags ....")(repo);
    console.log("tags", tags);

    tags = tags.map((item) => item.name);
    console.log(tags);
    let { tag } = await inquirer.prompt({
      name: "tag",
      type: "list",
      message: "please choise tags to create project",
      choices: tags,
    });
    //把模板放到一个临时目录里存好，以备后期使用
    let result = await waitFnloading(download, "download template")(repo, tag);
    console.log(result); //下载的目录

    //拿到下载的目录 直接拷贝当前执行的目录下即可 ncp

    //有的时候用户可以定制下载模板中的内容，拿package.json文件为例，用户可以根据提示给项目命名、
    //设置描述等，生成最终的package.json文件 ask.json网址：https://github.com/zhu-cli/vue-template/blob/master/ask.js
    //如果有ask.js文件直接下载
    if (!fs.existsSync(path.join(result, "ask.js"))) {
      //复杂的需要模板熏染 渲染后再拷贝
      //把template下的文件 拷贝到执行命令的目录下
      //在这个目录下 项目名字是否已经存在 如果存在示当前已经存在
      await ncp(result, path.resolve(projectName));
    } else {
      //复杂的模板  把git上的项目下载下来，如果有ask文件就是一个复杂的模板，我们需要用户选择，选择后编译模板
      // metalsmith--模板编译需要这个包
      //需要渲染模板的接口：https://github.com/zhu-cli/vue-template/blob/master/package.json
      //1.让用户填信息
      await new Promise((resolve, reject) => {
        MetalSmith(__dirname) //如果你传入路径，默认遍历当前路径下的src文件夹
          .source(result)
          .destination(path.resolve(projectName))
          .use(async (files, metal, done) => {
            // console.log(files)
            let args = require(path.join(result, "ask.js"));
            let obj = await inquirer.prompt(args);
            // console.log(obj);//用户填写的结果
            let meta = metal.metadata();
            Object.assign(meta, obj);
            delete files["ask.js"];
            done();
          })
          .use((files, metal, done) => {
            let obj = metal.metadata();
            Reflect.ownKeys(files).forEach(async (file) => {
              //是要处理的文件
              if (file.includes("js") || file.includes("json")) {
                let content = files[file].contents.toString(); //文件的内容
                if (content.includes("<%")) {
                  conteny = await render(content, obj);
                  files[file].contents = Buffer.from(content); //渲染结果
                }
              }
            });
            //2.让用户填写的信息取渲染模板
            //根据用户新的输入 下载模板
            // console.log(metal.metadata())
            done();
          })
          .build((err) => {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
      });
    }
  } catch (err) {
    console.log(err.code);
    console.log(err);
    process.exit();
  }
};