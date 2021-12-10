<!--
 * @Date         : 2021-11-24 13:55:30
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:47:51
 * @FilePath     : \src\components\btnWrap.vue
-->
<template>
  <div class="btn--wrap tl" v-if="btnList.length">
    <el-button
      v-for="(btn, index) in btnList"
      :key="index"
      :type="btn.primary"
      :icon="btn.icon"
      :loading="btn.loading"
      :disabled="btn.disabled"
      size="mini"
      @click="emit(btn.events)"
      >{{ btn.label }}</el-button
    >
  </div>
</template>

<script>
function getDefaultBtnList() {
  const btnList = [
    {
      id: "downloadTemplate",
      label: "下载模板",
      icon: "el-icon-download",
      primary: "primary",
    },
    {
      id: "upload",
      label: "导入",
      icon: "el-icon-upload2",
      primary: "primary",
    },
    {
      id: "add",
      label: "新增",
      icon: "el-icon-plus",
      primary: "primary",
    },
    {
      id: "edit",
      label: "编辑",
      icon: "el-icon-edit",
      primary: "primary",
    },
    {
      id: "del",
      label: "删除",
      icon: "el-icon-delete",
      primary: "danger",
    },
  ];

  btnList.forEach((btn) => {
    btn.events = `${btn.id}`;
    btn.loading = false;
    btn.disable = false;
  });
  return btnList;
}
export default {
  name: "btnWrap",
  props: {
    /**
     * 按钮列表
     * id 唯一标识
     */
    eventsList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      btnList: [],
    };
  },
  mounted() {
    this.btnList = getDefaultBtnList().filter((a) =>
      this.eventsList.includes(a.id)
    );
  },
  methods: {
    emit(type) {
      switch (type) {
        case "downloadTemplate":
          this.btnList.find((a) => a.events === type).loading = true;
          break;
      }
      this.$emit(type);
    },
    changeLoading(type, loading = false) {
      this.btnList.find((a) => a.events === type).loading = loading;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn--wrap {
  padding: 5px 0 15px 0;
}
</style>
