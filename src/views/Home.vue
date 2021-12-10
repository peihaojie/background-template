<!--
 * @Date         : 2021-12-10 08:45:32
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:27:24
 * @FilePath     : \src\views\Home.vue
-->
<template>
  <pageWrap>
    <template v-slot:filters>
      <filters
        ref="filters"
        :searchList="searchList"
        @search="search"
      ></filters>
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
        <el-table-column prop="flmc" label="分类" align="center">
        </el-table-column>
        <el-table-column prop="name" label="基地" align="center">
        </el-table-column>
        <el-table-column label="本月批次合格率数据" align="center">
          <el-table-column prop="rkpc" label="入库批次" align="center">
          </el-table-column>
          <el-table-column prop="hgpc" label="合格批次" align="center">
          </el-table-column>
          <el-table-column prop="bhgpc" label="不合格批次" align="center">
          </el-table-column>
          <el-table-column prop="djpc" label="冻结批次" align="center">
          </el-table-column>
          <el-table-column prop="pchgl" label="批次合格率" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="sypchgl" label="上月批次合格率" align="center">
        </el-table-column>
        <el-table-column
          prop="tqpchgl"
          label="去年同期批次合格率"
          align="center"
        >
        </el-table-column>
      </el-table>
    </template>

    <template v-slot:page>
      <pagination ref="pagination" :total="total" @change="handlePage">
      </pagination>
    </template>

    <dialogs :visible="false" title="牛哇" fullScreen></dialogs>
  </pageWrap>
</template>

<script>
// @ is an alias to /src
import moment from "moment";

export default {
  name: "Home",

  data() {
    return {
      searchList: [
        {
          label: "寻源物料组",
          key: "fls",
          placeholder: "请选择寻源物料组",
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
          label: "时间",
          key: "time",
          placeholder: "请选择月份",
          type: "month",
          clearable: false,
          valueType: "array",
          defaultValue: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
        },
      ],
      searchConfig: {},
      tableData: [],
      total: 0,
      tableLoading: false,
    };
  },
  mounted() {
    this.$refs.filters.emit("search");
  },
  methods: {
    search(query) {
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
      // this.tableLoading = true;
    },
    getIndex(num) {
      const { pageSize, currentPage } = this.$refs.pagination.pageConfig;
      return num + pageSize * (currentPage - 1);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
