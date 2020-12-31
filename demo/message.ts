import { message } from 'ant-design-vue'

message.config({
  duration: 1,
  maxCount: 1
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: any;
  }
}

export default message;