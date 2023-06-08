'use strict';

import { MOUNTED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN, UNMOUNTING } from "../applications/app.helper.js";
import { reasonableTime } from "../applications/timeouts.js";
import { getProps } from "./helper.js";

export function toUnmountPromise(app) {
    if (app.status !== MOUNTED) {
        return Promise.resolve(app);
    }
    app.status = UNMOUNTING;

    function unmountThisApp(serviceUnmountError) {
        return reasonableTime(app.unmount(getProps(app)), `app: ${app.name} unmounting`, app.timeouts.unmount).catch(e => {
            console.log(e);
            app.status = SKIP_BECAUSE_BROKEN;
        }).then(() => {
            if (app.status !== SKIP_BECAUSE_BROKEN) {
                app.status = serviceUnmountError === true ? SKIP_BECAUSE_BROKEN : NOT_MOUNTED;
            }
            return app;
        });
    }

    // 优先卸载当前app中的service，如果存在的话
    let unmountServicePromise = Promise.all(Object.keys(app.services).map(name => app.services[name].unmountSelf()));

    return unmountServicePromise.catch(e => {
        console.log(e);
        return true;
    }).then(unmountThisApp);
}
