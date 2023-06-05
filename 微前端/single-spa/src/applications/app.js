import { reroute } from "../navigation/reroute.js";
import { NOT_LOADED } from "./app.helpers.js";
import '../navigation/navigation-event.js';

export const apps = [];
export function registerApplication(appName, loadApp, activeWhen, customProps) {
    const registeration = {
        name: appName, // app的名字
        loadApp, // 要加载的app
        activeWhen, // 何时加载
        customProps, // 自定义属性
        status: NOT_LOADED
    };
    apps.push(registeration);
    reroute(); // 根据路径进行加载路由
}
