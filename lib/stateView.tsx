import React, {Component, PureComponent} from 'react';
import {
    View,
    Text,
    Image,
} from '@tarojs/components';
import './stateView.scss';
import {AtActivityIndicator} from "taro-ui";
import {createReducerResult, LoadDataResultStates} from "./utils";
import {ReducerResult} from "../index";
const  NetworkErrorPng = require('./img/app_error_network.png').default;
const  ServerErrorPng = require('./img/app_error_server.png').default;
const NoContentPng = require('./img/app_nocontent.png').default;

export interface IProps {
    children?: any;
    loadDataResult: ReducerResult;
    containerStyle?: any,
    bodyStyle?: any,
    /* loading相关的 */
    loadingView?: any,
    loadingTitle?: string,
    loadingTitleStyle?: any,
    /* Placeholder相关的 */
    placeholderView?: any, // 整个替换placeholder
    placeholderImageRes?: number, // 替换图片原，格式为require('...')
    placeholderTitle?: string, // 替换标题
    placeholderImageStyle?: any, // 图片样式
    placeholderTitleStyle?: any, // 标题样式
    /* error相关的 */
    error?: any, // 服务器返回的状态码
    errorView?: any, // 整个替换placeholder
    errorImageRes?: number, // 替换图片原，格式为require('...')
    errorTitle?: string, // 替换标题
    errorImageStyle?: any // 图片样式
    errorTitleStyle?: any, // 标题样式
    errorButtonStyle?: any, // 标题样式
    errorButtonTextStyle?: any, // 标题样式
    errorButtonAction?: any; // 标题样式,
    isConnected?: boolean;
    emptyReloadDelay?: number; //空页面时重新加载时的延迟时间(单位:ms)，默认为500，防止出现一闪马上还原的现象
    errorReloadDelay?: number; //错误页面时重新加载时的延迟时间(单位:ms)
}

export interface IState {
    // 为了实现，点击刷新按钮自动刷新，将state从props移动到state
    dataState: LoadDataResultStates
}

//初始化时的状态
const initialLoadDataResultState = LoadDataResultStates.loading;

export default class StateView extends PureComponent<IProps, IState> {

    static defaultProps={
        loadDataResult: createReducerResult(),
        loadingTitle: '正在加载中…',
        isConnected: true,
        emptyReloadDelay: 0,
        errorReloadDelay: 0,
    };

    readonly state: IState = {
        dataState: initialLoadDataResultState,
    };

    componentDidMount () {
        // AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        const {isConnected, loadDataResult, errorButtonAction} = this.props;
        if (prevProps.isConnected !== this.props.isConnected) {
            //如果从无网变为有网，并且当前是网络错误的状态，则刷新界面
            if (
                isConnected &&
                loadDataResult.error &&
                !loadDataResult.error.status
            ) {
                errorButtonAction && errorButtonAction();
            }
        }
        if (prevProps.loadDataResult !== this.props.loadDataResult) {
            if (
                loadDataResult.state &&
                (prevProps.loadDataResult.state !== loadDataResult.state ||
                    loadDataResult.state !== initialLoadDataResultState ||
                    loadDataResult.forceUpdate)
            ) {
                this.setState({
                    dataState: loadDataResult.state,
                });
            }
        }
    }

    componentWillUnmount () {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = appState => {
        const {loadDataResult, errorButtonAction} = this.props;
        // 从后台进入到前台的时候,如果是调用超时的错误，重新调取一次接口
        if (appState === 'active') {
            if (
                loadDataResult.state === LoadDataResultStates.error &&
                loadDataResult.error &&
                !loadDataResult.error.status
            ) {
                errorButtonAction && errorButtonAction();
            }
        }
    }

    render () {
        const {
            containerStyle, bodyStyle,
            loadDataResult,
            loadingView, loadingTitle, loadingTitleStyle,
            placeholderImageRes, placeholderTitle, placeholderImageStyle, placeholderView,
            placeholderTitleStyle, errorTitle, error, errorImageStyle, errorTitleStyle, errorButtonStyle, errorButtonTextStyle,
            errorButtonAction,
            emptyReloadDelay,
            errorReloadDelay,
        } = this.props;
        const {dataState} = this.state;
        // 从外部调用静态属性可以，但是组件内部调用的话为undefined,不知道为啥
        // 所以用常量代替
        switch (dataState) {
            // 由于有全局loading的存在，现在不显示
            case LoadDataResultStates.loading:
                return (
                    <View className='state-view-container' style={`${containerStyle}`}>
                        <View className='state-view-container-loading' style={`${loadingTitleStyle && loadingTitleStyle}`}>
                            {loadingView || [
                                <AtActivityIndicator key={0} size={45}></AtActivityIndicator>
                                ,
                                <Text key={1} className='state-view-container-title' >{loadingTitle || '正在加载中…'}</Text>
                            ]
                            }
                        </View>
                    </View>
                );
            // 显示placeholder
            case LoadDataResultStates.empty:
                // 为了将界面撑起来，并且为后面的下拉刷新作准备
                // 不能使用数组，必须使用view将两个对象套起来
                // TouchableOpacity外层还包裹一层view是为了不让点击的时候，看到底部的内容
                return (
                    <View className='state-view-container' style={`${containerStyle}`}>
                        {this.props.children}
                        <View className='container'
                              onClick={(args) => {
                                  if (errorButtonAction) {
                                      let lastTimestamp = loadDataResult.timestamp;
                                      errorButtonAction(args);
                                      if (emptyReloadDelay > 0) {
                                          setTimeout(() => {
                                              //判断数据是否已经发生变化
                                              if (loadDataResult.timestamp === lastTimestamp) {
                                                  this.setState({
                                                      dataState: initialLoadDataResultState,
                                                  });
                                              }
                                          }, emptyReloadDelay);
                                      } else {
                                          this.setState({
                                              dataState: initialLoadDataResultState,
                                          });
                                      }
                                  }
                              }}
                              style={`position:absolute;left:0;right:0;top:0;bottom:0;${containerStyle}`}
                        >
                            {placeholderView || <View className='state-view-container-body' style={`${bodyStyle}`}>
                                <Image src={placeholderImageRes || NoContentPng}
                                       className='state-view-container-placeholder-img'
                                       style={`${placeholderImageStyle}`} mode='aspectFit'
                                />
                                <Text style={`color:#666;font-size: 32rpx;${placeholderTitleStyle}`}>
                                    {placeholderTitle || '暂时没有数据'}
                                </Text>
                            </View>}
                        </View>
                    </View>);
            // 显示placeholder
            case LoadDataResultStates.error:
                let tempErrorTitle = '服务器开小差了，请等等再试吧...';
                let detailTitle = tempErrorTitle;
                if (error) {
                    tempErrorTitle = error.message;
                } else if (errorTitle) {
                    tempErrorTitle = errorTitle;
                }
                let imageRes;
                if (!error.status) {
                    imageRes = NetworkErrorPng;
                    // 分为无网络和服务器挂了
                    if (!this.props.isConnected) {
                        detailTitle = '网络连接失败，请检查网络';
                    }
                }
                // 此时是逻辑错误
                else if (error.state >= 200 && error.state < 300) {
                    detailTitle = '';
                }
                // 此时是服务器错误 status = 300+
                else {
                    imageRes = ServerErrorPng;
                    // 不同时显示默认值
                    if (detailTitle == tempErrorTitle) {
                        detailTitle = '';
                    }
                }
                return (
                    // 为了将界面撑起来，并且为后面的下拉刷新作准备
                    <View className='state-view-container'
                          onClick={(args) => {
                              let lastTimestamp = loadDataResult.timestamp;
                              errorButtonAction(args);
                              if (errorReloadDelay > 0) {
                                  setTimeout(() => {
                                      //判断数据是否已经发生变化
                                      if (loadDataResult.timestamp === lastTimestamp) {
                                          this.setState({
                                              dataState: initialLoadDataResultState,
                                          });
                                      }
                                  }, errorReloadDelay);
                              } else {
                                  this.setState({
                                      dataState: initialLoadDataResultState,
                                  });
                              }
                          }}
                          style={`${containerStyle}`}>
                        <View className='state-view-container-body' style={`${bodyStyle}`}>
                            <Image
                                className='state-view-container-placeholder-img'
                                mode='aspectFit'
                                src={imageRes}
                            />
                            <Text style={`color:#333;font-size: 32rpx;${placeholderTitleStyle}`}>
                                {tempErrorTitle}
                            </Text>
                            <Text style={`color:#999;margin-top:36rpx;font-size: 32rpx;${placeholderTitleStyle}`}>
                                {detailTitle}
                            </Text>
                            {/* 没经过服务器的提供刷新按钮 */}
                            <View
                                className='state-view-container-errorButton'
                                style={`${errorButtonStyle}`}
                            >
                                <Text style={`color:#999;font-size:32rpx;${errorButtonTextStyle}`}>点击刷新</Text>
                            </View>
                        </View>
                    </View>
                );
            case LoadDataResultStates.none:
            //有数据，则直接显示
            case LoadDataResultStates.content:
            default:
                return (
                    <View className='state-view-container' style={`${containerStyle}`}>
                        {this.props.children}
                    </View>
                );
                break;
        }
    }
}
