import {
    BOOTSTRAPPING,
    NOT_BOOTSTRAPPED,
    NOT_MOUNTED,
} from '../applications/app.helpers.js';
export function toBootstrapPromise(app) {
    return Promise.resolve().then(() => {
        if (app.status !== NOT_BOOTSTRAPPED) {
            // 不是未启动直接返回
            return app;
        }
        app.status = BOOTSTRAPPING; // 启动中
        return app.bootstrap(app.customProps).then(() => {
            app.status = NOT_MOUNTED; // 启动完毕后标记没有挂载;
            return app;
        });
    });
}
