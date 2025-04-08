const program = require("commander");
const { version } = require("./constants");
const path = require("path");

const mapAction = {
  create: {
    //创建模板
    alias: "c", //配置命令的别称
    description: "create a project", //命令相对应的描述
    examples: ["ml-cli-create create <project-name>"],
  },
  config: {
    //配置文件
    alias: "conf",
    description: "config project variable",
    examples: ["ml-cli-create config set <k> <v>", "zj-cli config get <k>"],
  },
  "*": {
    //根据自己的情况配置别的命令
    alias: "",
    description: "command not found",
    examples: [],
  },
};

Reflect.ownKeys(mapAction).forEach((action) => {
  program
    .command(action) //配置命令的名字
    .alias(mapAction[action].alias) //命令别的名称
    .description(mapAction[action].description) //命令对应的描述
    .action((a) => {
      if (action === "*") {
        //访问不到对应的命令 就打印找不到命令
        console.log(mapAction[action].description);
      } else {
        //运行zhu-cli create xxx  解析后是[node , zhu-cli  , create  , xxx]
        // require(path.resolve(__dirname, action));
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

program.on("--help", () => {
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach((example) => {
      console.log("   " + example);
    });
  });
});

program.version(version);
program.parse(process.argv);