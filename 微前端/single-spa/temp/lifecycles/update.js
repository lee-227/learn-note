'use strict';

import { MOUNTED, SKIP_BECAUSE_BROKEN, UPDATING } from "../applications/app.helper.js";
import { reasonableTime } from "../applications/timeouts.js";
import { getProps } from './helper.js';

export function toUpdatePromise(service) {
    if (service.status !== MOUNTED) {
        return Promise.resolve(service);
    }

    service.status = UPDATING;
    return reasonableTime(service.update(getProps(service)), `service: ${service.name} updating`, service.timeouts.mount).then(() => {
        service.status = MOUNTED;
        return service;
    }).catch(e => {
        console.log(e);
        service.status = SKIP_BECAUSE_BROKEN;
        return service;
    });
}
