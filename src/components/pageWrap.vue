<!--
 * @Date         : 2021-11-24 11:40:40
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:51:25
 * @FilePath     : \src\components\pageWrap.vue
-->
<template>
  <div class="page--wrap flex col bb">
    <slot name="filters"></slot>
    <slot name="btn"></slot>
    <div class="flex1 pr">
      <div class="table--wrap pa">
        <div class="table">
          <slot></slot>
        </div>
        <div class="pageSize--wrap flex ac">
          <slot name="page"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pageWrap",
};
</script>
<style lang="stylus" scoped>
.page--wrap {
  height: 100%;
  padding: 12px 24px 0;
  .table--wrap {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .table {
      height: calc(100% - 40px);
    }
    .pageSize--wrap {
      height: 40px;
      justify-content: flex-end;
    }
  }
}
</style>
