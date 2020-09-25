# taro-state-view

[![npm version](http://img.shields.io/npm/v/@yz1311/react-native-state-view.svg?style=flat-square)](https://npmjs.org/package/@yz1311/react-native-state-view "View this project on npm")
[![npm version](http://img.shields.io/npm/dm/@yz1311/react-native-state-view.svg?style=flat-square)](https://npmjs.org/package/@yz1311/react-native-state-view "View this project on npm")


## 背景


## 功能
占位组件，根据loading、content、error、empty等状态显示不同的内容

## 开始
- [安装](#安装)
- [基础用法](#基础用法)
- [进阶用法](#进阶用法)
- [属性](#属性)
- [截图](#截图)

## 安装

```
$ npm i @yz1311/taro-state-view --save

或者 

$ yarn add @yz1311/taro-state-view
```

~~由于里面包含几个大图，所以需要将小程序的编译限制改为15KB(默认为1KB)~~
```json
mini: {
    ...
    url: {
        enable: true,
        config: {
          limit: 15400 // 加大转换尺寸上限
        }
      },
}
```

上面的方法不用了，代码中直接使用的硬编码的base64文件

## 基础用法



## 属性

### CodePushHandler options

| 属性           |     默认值     |   类型   | 描述   | 
| :---------- | :-------------: | :------: | :---------------------------------------------------------------------------------------------------------- |
|checkFrequency|ON_APP_RESUME|ennum|检查频率,默认为resume时更新|
|isDebugMode|false|boolean|是否为调试模式|
|willDownload|无|(packageInfo: myRemotePackage)=>boolean|将要下载事件，返回值，true代表继续更新，false终止更新，默认为true<br/>譬如可以根据网络状态来控制是否更新|
|newestAlertInfo|已是最新版本|string|当前是最新版本的提示信息|
|~~successAlertInfo~~|~~安装成功，点击[确定]后App将自动重启，重启后即更新成功！~~|~~string~~|~~下载安装成功后的提示信息~~|
|updateView|无|(props)=>Element|替换默认的更新对话框,必须实现IUpdateViewProps相关属性|
|successBtnText|立即重启APP|string|下载安装成功后，按钮的文字|
|successDelay|5|number|//下载成功后，延迟重启的时间(单位:s)|


## 开发计划


## 截图

