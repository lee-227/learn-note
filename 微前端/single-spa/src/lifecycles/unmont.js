import {
    MOUNTED,
    NOT_MOUNTED,
    UNMOUNTING,
} from '../applications/app.helpers.js';
export function toUnmoutPromise(app) {
    return Promise.resolve().then(() => {
        if (app.status !== MOUNTED) {
            // 如果不是 挂载直接跳出
            return app;
        }
        app.status = UNMOUNTING;
        return app
            .unmount(app.customProps) // 调用卸载钩子
            .then(() => {
                app.status = NOT_MOUNTED;
            });
    });
}
