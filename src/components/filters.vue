<!--
 * @Date         : 2021-11-24 09:02:35
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:40:09
 * @FilePath     : \src\components\filters.vue
-->
<template>
  <div class="searchList--wrap flex" @keyup.enter="emit('search')">
    <div class="searchList flex1 flex">
      <div
        :class="[
          'flex search--item',
          { 'search--item__date': item.type === 'date' },
        ]"
        v-for="(item, index) in searchList"
        :key="index"
      >
        <div class="search--item__label flex ac">{{ item.label }}:</div>
        <div class="flex1">
          <template v-if="item.type === 'select'">
            <el-select
              v-model="searchConfig[item.key]"
              :placeholder="item.placeholder"
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
            >
            </el-date-picker>
          </template>

          <template v-else>
            <el-input
              v-model="searchConfig[item.key]"
              :placeholder="item.placeholder"
              clearable
            ></el-input>
          </template>
        </div>
      </div>
    </div>
    <div class="btn--wrap flex ac">
      <el-button
        v-if="download"
        icon="el-icon-download"
        type="info"
        size="mini"
        :loading="loading"
        @click="emit('download')"
        >导出</el-button
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
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - DAY * day);
  return [start, end];
}

function getEndTime(date, type) {
  if (!date) return "";
  return moment(date).endOf(type).format("YYYY-MM-DD HH:mm:ss");
}

export default {
  name: "filters",
  props: {
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
    searchList: {
      type: Array,
      default: () => [],
      required: true,
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
  },
  data() {
    return {
      searchConfig: {},
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
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
        ],
      },
      monthPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      yearPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
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
  mounted() {
    this.searchList.forEach((item) => {
      this.$set(this.searchConfig, item.key, item.defaultValue || null);
    });
  },
  methods: {
    getQuery() {
      const query = JSON.parse(JSON.stringify(this.searchConfig));
      for (const key in query) {
        const val = query[key];
        !val && delete query[key];
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
    },
  },
};
</script>

<style lang="stylus" scoped>
.searchList--wrap {
  .searchList {
    padding-right: 24px;
    flex-wrap: wrap;
    .search--item {
      width: 300px;
      padding: 10px 12px 10px 0;
      .search--item__label {
        white-space: nowrap;
        padding-right: 5px;
      }
      .el-select {
        width: 100%;
      }
    }
    .search--item__date {
      width: 400px !important;
      .el-input__inner {
        width: 100%;
      }
    }
  }
  .btn--wrap {
    flex-wrap: nowrap;
    height: 52px;
  }
}
</style>
