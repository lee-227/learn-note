### commit message工具
- Commitizen 
```js
// 安装
yarn add commitizen -D
// 1. 安装cz-conventional-changelog保存其依赖到package.json中 2. 添加config.commitizen key到package.json中
yarn commitizen init cz-conventional-changelog --save-dev --save-exact

// yarn git-cz 代替 git commit -m '' 生成符合规范的git提交信息

```

- 生成change log文件
```js
yarn add conventional-changelog-cli -D
conventional-changelog -p angular -i CHANGELOG.md -s -r 0 // 生成changelog文件
```

- 强制验证提交信息
```js
yarn add husky validate-commit-msg -D
yarn husky install
yarn husky husky add .husky/pre-commit "yarn validate-commit-msg"
```