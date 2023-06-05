import { getAppChanges, shouldBeActive } from '../applications/app.helpers.js';
import { toBootstrapPromise } from '../lifecycles/bootstrap.js';
import { toLoadPromise } from '../lifecycles/load.js';
import { toMountPromise } from '../lifecycles/mount.js';
import { toUnmoutPromise } from '../lifecycles/unmont.js';
import { started } from '../start.js';
import { callCapturedEventListeners } from './navigation-event.js';

let appChangeUnderway = false; // 用于标识是否正在调用performAppChanges
let peopleWaitingOnAppChange = []; // 存放用户得逻辑

export function reroute(eventArguments, pendingPromises = []) {
    // 获取app当前所有状态
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
    if (appChangeUnderway) {
        // 正在改就存起来
        return new Promise((resolve, reject) => {
            peopleWaitingOnAppChange.push({
                resolve,
                reject,
                eventArguments,
            });
        });
    }
    if (started) {
        appChangeUnderway = true;
        // 挂载应用及后续切换路由的逻辑
        return performAppChanges();
    } else {
        return loadApps();
    }

    function loadApps() {
        // 获取所有需要加载的app,调用加载逻辑
        return Promise.all(appsToLoad.map(toLoadPromise)).then(
            callAllEventListeners
        ); // 加载应用
    }
    function performAppChanges() {
        // 1.将需要卸载的应用进行卸载
        let unmountAllPromise = Promise.all(appsToUnmount.map(toUnmoutPromise));
        // 2.加载应用(可能已经加载过了，需要防止重新加载)-> 卸载之前的 -> 进行挂载
        const loadMountPromises = appsToLoad.map((app) =>
            toLoadPromise(app).then((app) =>
                tryToBootstrapAndMount(app, unmountAllPromise)
            )
        );
        // 3.如果已经加载完毕那么，直接启动和挂载
        const mountPromise = appsToMount.map((appToMount) =>
            tryToBootstrapAndMount(appToMount, unmountAllPromise)
        );
        return unmountAllPromise.then(() => {
            // 组件卸 载完毕调用事件
            callAllEventListeners();
            return Promise.all(loadMountPromises.concat(mountPromise)).then(
                () => {
                    appChangeUnderway = false;
                    if (peopleWaitingOnAppChange.length > 0) {
                        const nextPendingPromises = peopleWaitingOnAppChange;
                        peopleWaitingOnAppChange = [];
                        reroute(null, nextPendingPromises); // 再次发生跳转
                    }
                }
            );
        });
    }
    function tryToBootstrapAndMount(app, unmountAllPromise) {
        // 尝试启动和 挂载
        if (shouldBeActive(app)) {
            // 路径匹配去启动加载，保证卸载完毕再挂载最新的
            return toBootstrapPromise(app).then((app) =>
                unmountAllPromise.then(() => toMountPromise(app))
            );
        }
    }
    function callAllEventListeners() {
        pendingPromises.forEach((pendingPromise) =>
            callCapturedEventListeners(pendingPromise.eventArguments)
        );
        callCapturedEventListeners(eventArguments); // 调用捕获到的事件
    }
}
