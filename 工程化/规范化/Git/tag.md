发布一个版本时，我们通常先在版本库中打一个标签，这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。

## 列出标签
列出当前仓库的所有标签：git tag
列出所有标签及说明：git tag -n
搜索符合条件的标签：git tag -l "1.0.*"
查看标签信息：git show v1.0.1

## 创建标签
创建标签：git tag "指定标签名"
创建带有说明的标签：git tag -a "指定标签名" -m "指定说明文字"
找历史提交的commit id: git log --pretty=oneline --abbrev-commit
给指定的commit打标签：git tag -a "指定标签名" commitID

## 删除标签
删除标签：git tag -d 标签名
删除远程标签：git push origin --delete tag <tagname>

## 本地标签推送到远程
推送指定标签：git push origin v1.0.0
一次性推送全部尚未推送到远程的本地标签：git push origin --tags

## 重命名tag
删除原有tag，重新添加 1. git tag -d <old-tag>  2. git tag -a <new-tag> -m"information"  

## 获取指定tag代码
1. 切换到指定标签，提示你当前处于一个“detached HEAD" 状态，因为 tag 相当于是一个快照，是不能更改它的代码的
```js
git checkout v1.0.0
```
2. 如果要在 tag 代码的基础上做修改，你需要一个分支
```js
git checkout -b branch_name tag_name
```