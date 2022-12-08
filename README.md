# background-template 后台模板页面

> - 组件是基于 Element-UI 的二次封装
> - 包含 pageWrap filters btnWrap pagination dialogs 五个组件
> - 其中 pageWrap 用于样式布局，其他组件以插槽的形式使用（也可单独使用）

## 安装

使用 npm:

```node
npm install background-template
```

使用 yarn:

```node
yarn add background-template
```

## 引入

在 main.js 中加入以下内容：

```js
import backgroundTemplate from "background-template";
import "background-template/lib/background-template.css";

Vue.use(backgroundTemplate);
```

在 App.vue 中加入以下内容（请勿在 style 中添加 scoped）：

```html
<style>
  html,
  body,
  #app {
    height: 100% !important;
  }
</style>
```

## 使用

### PageWrap 用于样式布局

![pageWrap](./images/homePage.png)

#### PageWrap Slot

| name    | 说明                           |
| ------- | ------------------------------ |
| filters | 过滤器                         |
| btn     | 按钮栏                         |
| default | 默认的 slot(用于插入 el-table) |
| page    | 翻页器                         |

举个例子

```html
<template>
  <pageWrap>
    <template v-slot:filters>
      <filters ref="filters" download reset showFold @search="search"></filters>
    </template>

    <template v-slot:btn>
      <btnWrap
        ref="btnWrap"
        :eventsList="['downloadTemplate', 'upload']"
        @downloadTemplate="download"
        @upload="upload"
      ></btnWrap>
    </template>

    <template>
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        stripe
        height="100%"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">
            <span>{{ getIndex(scope.$index + 1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="分类" align="center">
        </el-table-column>
      </el-table>
    </template>

    <template v-slot:page>
      <pagination ref="pagination" :total="total" @change="handlePage">
      </pagination>
    </template>

    <dialogs
      :visible="visible"
      title="弹窗名称"
      fullScreen
      :dialogConfig="{ width: '600px' }"
    >
      <div class="dialog--body">弹窗的内容</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 认</el-button>
      </div>
    </dialogs>
  </pageWrap>
</template>
```

```js
import moment from "moment";

const tempList = [
  {
    label: "下拉筛选",
    key: "fls",
    placeholder: "请下拉选择数据",
    type: "select",
    options: [
      {
        label: "牛哇",
        value: "牛哇",
      },
      {
        label: "确实",
        value: "确实",
      },
    ],
  },
  {
    label: "日期",
    key: "date",
    placeholder: "请选择日期",
    type: "date",
  },
  {
    label: "日期2",
    key: "date2",
    placeholder: "请选择日期",
    type: "date",
  },
  {
    label: "输入框",
    key: "input",
    placeholder: "请输入数据",
    type: "input",
  },
  {
    label: "时间",
    key: "time",
    placeholder: "请选择月份",
    type: "month",
    clearable: false,
    valueType: "array",
    defaultValue: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
  },
];

export default {
  data() {
    return {
      searchConfig: {},
      tableData: [],
      total: 0,
      tableLoading: false,
      visible: true,
    };
  },
  mounted() {
    this.$refs.filters.initSearchList(tempList);
  },
  methods: {
    search(query) {
      console.log("query", query);
      this.searchConfig = query;
      this.$refs.pagination.resetPage();
    },
    async download() {},
    async upload() {
      try {
        this.$refs.btnWrap.changeLoading("upload", true);
      } finally {
        this.$refs.btnWrap.changeLoading("upload");
        this.$refs.pagination.resetPage();
      }
    },
    getQuery() {
      const { time = null, ...others } = this.searchConfig;
      const params = { ...others };
      if (time) {
        params.beginTime = time[0];
        params.endTime = time[1];
      }
      return params;
    },
    handlePage() {
      const { pageSize, currentPage } = this.$refs.pagination.pageConfig;
      console.log({ pageSize, currentPage });
      // 发送请求
    },
    getIndex(num) {
      const { pageSize, currentPage } = this.$refs.pagination.pageConfig;
      return num + pageSize * (currentPage - 1);
    },
  },
};
```

### Filters 筛选器组件

![pageWrap](./images/filters.png)

> 通过 ref 使用 initSearchList 进行初始化；
> 通过 sendSearchOnload 来配置是否在加载完成之后触发 search 事件；

#### Filters Attributes

| 参数             | 说明                                      | 可选值 |  类型   | 默认值 |
| ---------------- | ----------------------------------------- | :----: | :-----: | :----: |
| sendSearchOnload | 是否在初始化完成后触发第一个请求          |   -    | Boolean |  true  |
| download         | 导出按钮                                  |   -    | Boolean | false  |
| loading          | 导出按钮的 loading 状态，使用 refs 来修改 |   -    | Boolean | false  |
| showFold         | 是否展示折叠按钮                          |   -    | Boolean | false  |
| filterNum        | 单行展示几个筛选条件                      |   -    | Number  |   4    |

#### Filters Events

| 事件名称 | 说明               | 回调参数       |
| -------- | ------------------ | -------------- |
| search   | 点击搜索或回车触发 | searchList.key |
| download | 点击导出触发       | searchList.key |

#### Filters Methods

| 方法名         | 说明                      | 参数              |
| -------------- | ------------------------- | ----------------- |
| initSearchList | 初始化 Filters 的过滤条件 | [Search]          |
| emit           | 触发搜索或导出            | search / download |

#### Search Attributes

| 参数             | 说明                                                    |                                              可选值                                               |          类型          |                                       默认值                                        |
| ---------------- | ------------------------------------------------------- | :-----------------------------------------------------------------------------------------------: | :--------------------: | :---------------------------------------------------------------------------------: |
| type             | 类型                                                    |                                 input、select、date、month、year                                  |         String         |                                        input                                        |
| label            | 名称                                                    |                                                 -                                                 |         String         |                                          -                                          |
| key              | 名称对应的 key                                          |                                                 -                                                 |         String         |                                          -                                          |
| defaultValue     | 默认填充数据（重置的时候恢复的数据）                    |                                                 -                                                 |  不同 type 的类型不同  |                                          -                                          |
| clearable        | 是否展示清空按钮                                        |                                                 -                                                 |        Boolean         |                                        true                                         |
| placeholder      | type 为 input、select 时有效，对应 input placeholder    |                                                 -                                                 |         String         |                                          -                                          |
| clear            | 触发 clear 事件需要清除的 keyList                       |                                                 -                                                 |        [String]        |                                          -                                          |
| options          | type 为 select 时有效                                   |                                                 -                                                 | [{label:"", value:""}] |                                          -                                          |
| startPlaceholder | type 为 date 时有效                                     |                                                 -                                                 |         String         |                                      开始时间                                       |
| endPlaceholder   | type 为 date 时有效                                     |                                                 -                                                 |         String         |                                      结束时间                                       |
| valueType        | date 的数据类型                                         |                                               array                                               |         String         |                                          -                                          |
| pickerOptions    | type 为 date、month、year 时有效，禁用时间/增加快捷按钮 | [Element-UI pickerOptions](https://element.eleme.cn/#/zh-CN/component/date-picker#picker-options) |           -            | 默认禁用当前时间之后的全部，type 为 date 时的快捷键为最近一周、一个月、三个月、全部 |

### BtnWrap 按纽栏组件

![pageWrap](./images/btnWrap.png)

> 该组件设计的初衷是为了在不同页面展示相同的 button
> 相同的 顺序、文案、icon、type 等

#### BtnWrap Attributes

| 参数       | 说明       | 可选值                                                                     |  类型  | 默认值 |
| ---------- | ---------- | -------------------------------------------------------------------------- | :----: | :----: |
| eventsList | 展示的按钮 | downloadTemplate(下载模板)、upload(导入)、add(新增)、edit(编辑)、del(删除) | String |   -    |

#### BtnWrap Events

| 事件名称         | 说明     | 回调参数 |
| ---------------- | -------- | -------- |
| downloadTemplate | 下载模板 | -        |
| upload           | 导入     | -        |
| add              | 新增     | -        |
| edit             | 编辑     | -        |
| del              | 删除     | -        |

#### BtnWrap Methods

| 方法名        | 说明               | 参数        | 默认参数        |
| ------------- | ------------------ | ----------- | --------------- |
| changeLoading | 修改按钮的 loading | id, loading | loading = false |

### Pagination 翻页器

![pageWrap](./images/page.png)

> - pageSizes: [15, 30, 60]

#### Pagination Events

| 事件名称 | 说明               | 回调参数                        |
| -------- | ------------------ | ------------------------------- |
| change   | 翻页/修改 pageSize | { pageSize: 1, currentPage: 1 } |

#### Pagination Methods

| 方法名    | 说明                   | 参数 |
| --------- | ---------------------- | ---- |
| resetPage | 重置页码(pageSize = 1) | -    |

> - 这里对 el-pagination 也进行了兼容 [Element-UI pagination 的默认事件](https://element.eleme.cn/#/zh-CN/component/pagination)

### Dialogs 弹窗

![pageWrap](./images/dialog.png)

#### Dialogs Attributes

| 参数         | 说明                 | 可选值 |                类型                | 默认值 |
| ------------ | -------------------- | ------ | :--------------------------------: | :----: |
| title        | 弹窗的名称           | -      |               String               |   -    |
| fullScreen   | 是否展示全屏按钮     | -      |              Boolean               | false  |
| dialogConfig | 对窗口的大小进行设置 | -      | {width: "", height(maxHeight): ""} |   -    |

> - 这里对 el-dialog 也进行了兼容 [Element-UI dialog 的默认事件](https://element.eleme.cn/#/zh-CN/component/dialog)

## 目录结构

```markdown
|-- src
|-- App.vue
|-- index.js
|-- main.js
|-- assets
| |-- logo.png
| |-- styles
| |-- class.styl
| |-- index.styl
|-- components
| |-- btnWrap.vue // 按钮组件
| |-- dialogs.vue // 弹窗组件
| |-- filters.vue // 筛选器组件
| |-- init.js
| |-- pageWrap.vue // page 组件(所有的组件都以 slot 的方式实现)
| |-- pagination.vue // 翻页组件
|-- router
| |-- index.js
|-- store
| |-- index.js
|-- utils
| |-- initCss.js
| |-- initElement.js
|-- views
|-- About.vue
|-- Home.vue
```
