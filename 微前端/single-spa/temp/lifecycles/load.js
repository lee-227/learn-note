import {
    LOADING_SOURCE_CODE,
    NOT_BOOTSTRAPPED,
    NOT_LOADED,
} from '../applications/app.helpers.js';
function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns]; // 包装成数组，进行组合
    return function (props) {
        return fns.reduce(
            (resultPromise, fn) => resultPromise.then(() => fn(props)),
            Promise.resolve()
        );
    };
}
export function toLoadPromise(app) {
    return Promise.resolve().then(() => {
        if (app.status !== NOT_LOADED) {
            // 状态 必须是NOT_LOADED才加载
            return app;
        }
        app.status = LOADING_SOURCE_CODE;
        return app.loadApp(app.customProps).then((val) => {
            let { bootstrap, mount, unmount } = val; // 获取接口协议
            app.status = NOT_BOOTSTRAPPED;
            app.bootstrap = flattenFnArray(bootstrap);
            app.mount = flattenFnArray(mount);
            app.unmount = flattenFnArray(unmount);
            return app; // 返回应用
        });
    });
}
