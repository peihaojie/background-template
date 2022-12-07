<!--
 * @Date         : 2021-11-24 09:02:35
 * @LastEditors: HaoJie
 * @LastEditTime: 2022-12-07 13:49:17
 * @FilePath: \background-template\src\components\filters.vue
-->
<template>
  <div>
    <div
      :class="[{ maxH: fold }, 'searchList--wrap flex oh']"
      @keyup.enter="emit('search')"
    >
      <div class="searchList flex1 flex">
        <div
          :class="[
            'flex search--item',
            { 'search--item__date': item.type === 'date' },
          ]"
          v-for="(item, index) in searchList"
          :style="{ width: 100 / filterNum + '%' }"
          :key="index"
        >
          <div class="search--item__label flex ac">{{ item.label }}:</div>
          <div class="flex1">
            <template v-if="item.type === 'select'">
              <el-select
                v-model="searchConfig[item.key]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :clearable="item.clearable | defaultClearable"
                @change="clearValue(item.clear)"
              >
                <el-option
                  v-for="(item, index) in item.options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>

            <template v-else-if="item.type === 'date'">
              <el-date-picker
                v-model="searchConfig[item.key]"
                type="daterange"
                :picker-options="item.pickerOptions || datePickerOptions"
                :start-placeholder="item.startPlaceholder || '开始时间'"
                :end-placeholder="item.endPlaceholder || '结束时间'"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :clearable="item.clearable | defaultClearable"
                @change="emit('search')"
              ></el-date-picker>
            </template>

            <template v-else-if="item.type === 'month'">
              <el-date-picker
                v-model="searchConfig[item.key]"
                type="month"
                :picker-options="item.pickerOptions || monthPickerOptions"
                :placeholder="item.placeholder"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :clearable="item.clearable | defaultClearable"
                @change="emit('search')"
              >
              </el-date-picker>
            </template>

            <template v-else-if="item.type === 'year'">
              <el-date-picker
                v-model="searchConfig[item.key]"
                type="year"
                :picker-options="item.pickerOptions || yearPickerOptions"
                :placeholder="item.placeholder"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :clearable="item.clearable | defaultClearable"
                @change="emit('search')"
              >
              </el-date-picker>
            </template>

            <template v-else>
              <el-input
                v-model="searchConfig[item.key]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :clearable="item.clearable | defaultClearable"
              ></el-input>
            </template>
          </div>
        </div>
      </div>
      <div class="btn--wrap flex ac">
        <el-button
          v-if="download"
          icon="el-icon-download"
          type="primary"
          plain
          size="mini"
          :loading="loading"
          @click="emit('download')"
          >导出</el-button
        >
        <el-button size="mini" type="primary" plain @click="resetAll"
          >重置</el-button
        >
        <el-button
          icon="el-icon-search"
          type="primary"
          size="mini"
          @click="emit('search')"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="fold--btn pr" v-if="showFold">
      <div
        :class="[
          {
            open: fold,
            closed: !fold,
          },
          'hand pa flex center',
        ]"
        @click="changeFold"
      >
        <i
          :class="{
            'el-icon-caret-bottom': fold,
            'el-icon-caret-top': !fold,
          }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
/**
 * @description: 获取时间段
 * @param {number} 日期类型
 * @return: [start, end]
 */
function getShortcuts(day) {
  const DAY = 3600 * 1000 * 24;
  const end = moment().endOf("day").toDate();
  const start = moment().startOf("day");
  return [moment(start.valueOf() - DAY * day).toDate(), end];
}

function getEndTime(date, type) {
  if (!date) return "";
  return moment(date).endOf(type).format("YYYY-MM-DD HH:mm:ss");
}

function verifyFilterOption(options) {
  if (!options.label) {
    throw new Error("label 为必填项!");
  }

  if (!options.key) {
    throw new Error("key 为必填项!");
  }

  options.type = options.type || "input";
  switch (options.type) {
    case "input": {
      break;
    }

    case "select": {
      if (!options.options) {
        throw new Error("options 为必填项!");
      }
      if (!options.options.length) {
        throw new Error("options 不可为空 Array!");
      }
      if (options.clear && !Array.isArray(options.clear)) {
        throw new Error("clear 必须为 Array!");
      }
      break;
    }

    case "date":
    case "year":
    case "month": {
      if (options.valueType && options.valueType !== "array") {
        throw new Error("valueType 仅支持 array 和 undefined!");
      }
      break;
    }

    default: {
      throw new Error("type 有误!");
    }
  }
  return options;
}

export default {
  name: "Filters",
  props: {
    /**
     * 是否在初始化完成后触发第一个请求
     */
    sendSearchOnload: {
      type: Boolean,
      default: true,
    },
    /**
     * 导出列表
     */
    download: {
      type: Boolean,
      default: false,
    },
    /**
     * 导出的loading
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示折叠按钮
     */
    showFold: {
      type: Boolean,
      default: false,
    },
    /**
     * 单行展示几个筛选条件
     * 默认是 4 个
     */
    filterNum: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      /**
       * 搜索列表
       *
       * type = input
       * label、key、placeholder
       * defaultValue (默认：undefined) 默认展示的数据
       *
       * type = select
       * label、key、placeholder、options
       * options = [{ label: '', value: '' }]
       * clear 触发change需要清除的数据 string[]
       *
       * type = date
       * label
       * startPlaceholder、endPlaceholder (默认：开始时间 - 结束时间)
       * clearable (默认：true)
       * valueType (默认：undefined) 为array时，value为数组
       *
       */
      searchList: [],
      searchConfig: {},
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > moment().endOf("day").valueOf();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              picker.$emit("pick", getShortcuts(7));
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              picker.$emit("pick", getShortcuts(30));
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              picker.$emit("pick", getShortcuts(90));
            },
          },
          {
            text: "全部",
            onClick(picker) {
              picker.$emit("pick", [
                moment(0).toDate(),
                moment().endOf("day").toDate(),
              ]);
            },
          },
        ],
      },
      monthPickerOptions: {
        disabledDate(time) {
          return time.getTime() > moment().endOf("day").valueOf();
        },
      },
      yearPickerOptions: {
        disabledDate(time) {
          return time.getTime() > moment().endOf("day").valueOf();
        },
      },
      fold: false,
    };
  },
  filters: {
    defaultClearable(bool) {
      if (bool === undefined) {
        return true;
      }
      return bool;
    },
  },
  watch: {
    searchList: {
      handler(val) {
        val.forEach((item) => {
          const { defaultValue = null, key } = item;
          this.$set(this.searchConfig, key, defaultValue);
        });
      },
      immediate: true,
    },
  },
  methods: {
    getQuery() {
      const query = JSON.parse(JSON.stringify(this.searchConfig));
      for (const key in query) {
        const val = query[key];
        !val && val !== 0 && delete query[key];
        const { type, valueType } = this.searchList.find((a) => a.key === key);
        if (valueType === "array") {
          switch (type) {
            case "month":
              query[key] = [val, getEndTime(val, "month")];
              break;
            case "year":
              query[key] = [val, getEndTime(val, "year")];
              break;

            default:
              break;
          }
        }
      }
      return query;
    },
    emit(type) {
      this.$emit(type, this.getQuery());
    },
    clearValue(keyList = []) {
      keyList.forEach((key) => {
        if (this.searchConfig[key]) {
          this.$set(this.searchConfig, key, null);
        }
      });
      this.emit("search");
    },
    changeFold() {
      this.fold = !this.fold;
    },
    resetAll() {
      this.searchList.forEach((item) => {
        const { defaultValue = null, key } = item;
        this.$set(this.searchConfig, key, defaultValue);
      });
      this.emit("search");
    },
    initSearchList(optionList) {
      if (!Array.isArray(optionList)) {
        throw new Error("optionList 必须为Array!");
      }
      this.searchList = optionList.map(verifyFilterOption);
      this.sendSearchOnload && this.$nextTick(() => this.emit("search"));
    },
  },
};
</script>

<style lang="stylus" scoped>
.searchList--wrap
  max-height 1000px
  transition max-height 0.3s
  .searchList
    margin-right 24px
    flex-wrap wrap
    .search--item
      box-sizing border-box
      padding 10px 12px 10px 0
      .search--item__label
        white-space nowrap
        padding-right 5px
      .el-select
        width 100%
    .search--item__date
      .el-input__inner
        width 100%
  .btn--wrap
    flex-wrap nowrap
    height 52px
.maxH
  max-height 45px
.fold--btn
  margin 10px 0
  border-bottom 1px solid #e1e0e0
  > div
    left 50%
    transform translateX(-50%)
    width 30px
    border 1px solid #e1e0e0
    &hove
      box-shadow 0px 1px 2px 0px #e1e0e0
  .open
    top 0
    border-radius 0 0 5px 5px
    border-top none
  .closed
    bottom 0
    border-radius 5px 5px 0 0
    border-bottom none
.el-date-editor
  width 100%
</style>
