import { reroute } from './reroute.js';
export const routingEventsListeningTo = ['hashchange', 'popstate'];
function urlReroute() {
    reroute(arguments);
}
const capturedEventListeners = {
    // 捕获的事件
    hashchange: [],
    popstate: [],
};
const originalAddEventListener = window.addEventListener; // 保留原来的方法
const originalRemoveEventListener = window.removeEventListener;
window.addEventListener = function (eventName, fn) {
    if (
        routingEventsListeningTo.includes(eventName) &&
        !capturedEventListeners[eventName].some((listener) => listener == fn)
    ) {
        return capturedEventListeners[eventName].push(fn);
    }
    return originalAddEventListener.apply(this, arguments);
};
window.removeEventListener = function (eventName, listenerFn) {
    if (routingEventsListeningTo.includes(eventName)) {
        capturedEventListeners[eventName] = capturedEventListeners[
            eventName
        ].filter((fn) => fn !== listenerFn);
        return;
    }
    return originalRemoveEventListener.apply(this, arguments);
};

window.addEventListener('hashchange', urlReroute);
window.addEventListener('popstate', urlReroute);

export function callCapturedEventListeners(eventArguments) {
    if (eventArguments) {
        const eventType = eventArguments[0].type;
        if (routingEventsListeningTo.indexOf(eventType) >= 0) {
            capturedEventListeners[eventType].forEach((listener) => {
                try {
                    listener.apply(this, eventArguments);
                } catch (e) {
                    throw e;
                }
            });
        }
    }
}

function patchedUpdateState(updateState, methodName) {
    return function () {
        // 例如 vue-router内部会通过pushState() 不改路径改状态，所以还是要 处理下
        const urlBefore = window.location.href;
        const result = updateState.apply(this, arguments);
        const urlAfter = window.location.href;
        if (urlBefore !== urlAfter) {
            window.dispatchEvent(new PopStateEvent(methodName)); // 触发事件
        }
        return result;
    };
}
window.history.pushState = patchedUpdateState(
    window.history.pushState,
    'pushState'
);
window.history.replaceState = patchedUpdateState(
    window.history.replaceState,
    'replaceState'
);
