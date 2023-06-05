import { MOUNTED, NOT_MOUNTED } from '../applications/app.helpers.js';
export function toMountPromise(app) {
    return Promise.resolve().then(() => {
        if (app.status !== NOT_MOUNTED) {
            // 不是未 挂载状态 直接返回
            return app;
        }
        return app.mount(app.customProps).then(() => {
            app.status = MOUNTED;
            return app;
        });
    });
}
