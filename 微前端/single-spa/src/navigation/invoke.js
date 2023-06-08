'use strict';

import { getAppsToLoad, getAppsToMount, getAppsToUnmount, getMountedApps } from '../applications/apps.js';
import { toLoadPromise } from '../lifecycles/load.js';
import { toBootstrapPromise } from '../lifecycles/bootstrap.js';
import { toMountPromise } from '../lifecycles/mount.js';
import { toUnmountPromise } from '../lifecycles/unmount.js';
import { isStarted } from '../start.js';
import { callCapturedEvents } from './hijackLocations.js';

let loadAppsUnderway = false;
let pendingPromises = [];

export function invoke(pendings, eventArgs) {
    if (loadAppsUnderway) {
        return new Promise((resolve, reject) => {
            pendingPromises.push({ success: resolve, failure: reject, eventArgs });
        });
    }

    loadAppsUnderway = true;
    if (isStarted()) {
        return performAppChanges();
    }
    return loadApps();


    // 找到需要load的app
    function loadApps() {
        let loadPromises = getAppsToLoad().map(toLoadPromise);

        return Promise.all(loadPromises).then(() => {
            callAllLocationEvents();
            return finish();
        }).catch(e => {
            callAllLocationEvents();
            console.log(e);
        });
    }


    // 启动app
    function performAppChanges() {
        // getAppsToUnmount
        let unmountApps = getAppsToUnmount();
        let unmountPromises = Promise.all(unmountApps.map(toUnmountPromise));

        // getAppsToLoad
        let loadApps = getAppsToLoad();
        let loadPromises = loadApps.map(app => {
            return toLoadPromise(app).then(app => toBootstrapPromise(app))
                .then(() => unmountPromises).then(() => toMountPromise(app))
        });

        let mountApps = getAppsToMount().filter(app => loadApps.indexOf(app) === -1);
        let mountPromises = mountApps.map(app => {
            return toBootstrapPromise(app).then(() => unmountPromises).then(() => toMountPromise(app));
        });

        return unmountPromises.then(() => {
            callAllLocationEvents();
            let loadAndMountPromises = loadPromises.concat(mountPromises);
            return Promise.all(loadAndMountPromises).then(finish, ex => {
                pendings.forEach(item => item.reject(ex));
                throw ex;
            });
        }, e => {
            callAllLocationEvents();
            console.log(e);
            throw e;
        });
    }


    function finish() {
        let resolveValue = getMountedApps();
        if (pendings) {
            pendings.forEach(item => item.success(resolveValue));
        }

        loadAppsUnderway = false;

        if (pendingPromises.length) {
            const backup = pendingPromises;
            pendingPromises = [];
            return invoke(backup);
        }

        return resolveValue;
    }

    function callAllLocationEvents() {
        pendings && pendings.length && pendings.filter(item => item.eventArgs).forEach(item => callCapturedEvents(item.eventArgs));
        eventArgs && callCapturedEvents(eventArgs);
    }
}
