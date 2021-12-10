<!--
 * @Date         : 2021-11-24 17:17:39
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:48:02
 * @FilePath     : \src\components\pagination.vue
-->
<template>
  <el-pagination
    ref="pagination"
    :page-sizes="pageSizes"
    :page-size="pageConfig.pageSize"
    @size-change="handleSizeChange"
    :current-page="pageConfig.currentPage"
    @current-change="handleCurrentChange"
    layout="total, sizes, prev, pager, next, jumper"
    v-bind="$attrs"
    v-on="$listeners"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      pageSizes: [15, 30, 60],
      pageConfig: {
        pageSize: 15,
        currentPage: 1,
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageConfig.pageSize = val;
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      this.pageConfig.currentPage = val;
      this.emit();
    },
    resetPage() {
      this.handleCurrentChange(1);
    },
    emit() {
      this.$emit("change", this.pageConfig);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
