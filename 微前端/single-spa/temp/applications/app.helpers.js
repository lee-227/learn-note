import { apps } from "./app.js";

// App statuses
export const NOT_LOADED = 'NOT_LOADED'; // 应用没 有加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 加载资源代码
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 没有启动
export const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 启动中

export const NOT_MOUNTED = 'NOT_MOUNTED'; // 没有 挂载
export const MOUNTING = 'MOUNTING'; // 挂载中
export const MOUNTED = "MOUNTED"; // 挂载完毕
export const UPDATING = "UPDATING"; // 更新中
export const UNMOUNTING = "UNMOUNTING"; // 回到未 挂载状态
export const UNLOADING = 'UNLOADING'; // 完全卸 载
export const LOAD_ERROR = 'LOAD_ERROR'; // 资源 加载失败
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'; // 出错
// 当前应用是否被激活
export function isActive(app) {
    return (app.status = MOUNTED);
}
// 当前应用是否应该被激活
export function shouldBeActive(app) {
    return app.activeWhen(window.location);
}

export function getAppChanges() {
    const appsToLoad = []; // 需要加载的应用
    const appsToMount = []; // 需要挂载的应用
    const appsToUnmount = []; // 需要去卸载的应用
    apps.forEach((app) => {
        const appShouldBeActive = shouldBeActive(app);
        switch (app.status) {
            case NOT_LOADED:
            case LOADING_SOURCE_CODE: // 还没加载需要加载的
                if (appShouldBeActive) {
                    appsToLoad.push(app);
                }
                break;
            case NOT_BOOTSTRAPPED:
            case NOT_MOUNTED: // 还没挂载，要挂载
                if (appShouldBeActive) {
                    appsToMount.push(app);
                }
                break;
            case MOUNTED: // 已经挂载了，但是路径不匹配
                if (!appShouldBeActive) {
                    appsToUnmount.push(app);
                }
            default:
                break;
        }
    });
    return { appsToLoad, appsToMount, appsToUnmount };
}
