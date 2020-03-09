/**
 * Created by lidy on 2019/12/13.
 */
import defaultConfirm from "./confirm.vue";

export default {
  install: function(Vue) {
    const defaultConfirmComponent = Vue.extend(defaultConfirm);
    let defaultConfirmInit;
    const initInstance = () => {
      // 实例化vue实例
      defaultConfirmInit = new defaultConfirmComponent();
      let defaultConfirmEl = defaultConfirmInit.$mount().$el;
      document.body.appendChild(defaultConfirmEl);
    };
    Vue.prototype.$dialog = {
      confirm(options) {
        if (defaultConfirmInit) {
          //如果有有先删除
          document.body.removeChild(defaultConfirmInit.$mount().$el);
        }
        initInstance(); //初始化confirm
        return new Promise((resolve, reject) => {
          defaultConfirmInit.show(options);
          defaultConfirmInit.confirm = () => {
            defaultConfirmInit.dialogVisible = false;
            resolve();
          };
          defaultConfirmInit.cancel = () => {
            defaultConfirmInit.dialogVisible = false;
            reject();
          };
        });
      },
      alert(options, callback) {
        if (!defaultConfirmInit) {
          initInstance();
        }
        defaultConfirmInit.isCancel = false;
        defaultConfirmInit.show(options);
        if (callback) {
          //执行回调
          defaultConfirmInit.confirm = () => {
            defaultConfirmInit.dialogVisible = false;
            callback();
          };
        }
      }
    };
  }
};
