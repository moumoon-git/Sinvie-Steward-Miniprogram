# tooltip 文字提示

### 介绍

在组件中以气泡的形式展示需要的文字，一般使用详细说明

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](#/quickstart#yin-ru-zu-jian)。

```json
"usingComponents": {
  "van-tooltip": "@vant/weapp/tooltip/index"
}
```

## 代码演示

### 基础用法

通过`value`绑定值显示需要展示的文字。

```html
<van-tooltip value="{{ value }}">
  <template #default>
    基本用法
  </template>
</van-radio-group>
```

## API

### Tooltip Props

| 参数      | 说明                                                | 类型     | 默认值   |
| --------- | --------------------------------------------------- | -------- | -------- |
| value     | 显示需要展示的文字                                  | _string_ | -        |
| placement | Tooltip 的出现位置 可选值为 `bottom/top/left/right` | _string_ | `bottom` |
| theme     | 主题风格，可选值为 `dark/light`                     | _string_ | `dark`   |
