<!--
 * @Date         : 2021-11-25 09:10:32
 * @LastEditors: HaoJie
 * @LastEditTime: 2021-12-21 15:57:19
 * @FilePath: \background-template\src\components\dialogs.vue
-->
<template>
  <div id="dialog-wrap">
    <el-dialog
      ref="dialog"
      width="900px"
      top="0"
      :modal-append-to-body="false"
      custom-class="dialog"
      :title="title"
      v-on="$listeners"
      v-bind="$attrs"
    >
      <template v-if="fullScreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-title">{{ title }}</span>
          <i
            :class="[
              'hand',
              'dialog-full',
              {
                'el-icon-full-screen': !fullScreenState,
                'el-icon-aim': fullScreenState,
              },
            ]"
            @click="fullScreenClick"
          ></i>
        </div>
      </template>
      <slot></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 存储之前的style状态， 用来切换全屏时的style
let deepStyle = null;

/**
 * @description: 全屏点击事件
 * @param {element} dom 需要修改魏全屏的dom
 * @param {boolean} state 当前状态
 */
function changeFullScreenState(el, state) {
  if (state) {
    // 全屏
    deepStyle = {
      top: el.style.top,
      left: el.style.left,
      width: el.style.width,
      transform: el.style.transform,
    };
    el.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      transform: none;
    `;
  } else {
    // 非全屏
    const { top, left, width, transform } = deepStyle;
    deepStyle = null;
    el.style.cssText = `
      position: absolute;
      top: ${top};
      right: auto;
      bottom: auto;
      left: ${left};
      width: ${width};
      transform: ${transform};
    `;
  }
}

export default {
  name: "dialogs",
  props: {
    /**
     * width height(maxHeight)
     */
    dialogConfig: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fullScreenState: false, // 全屏状态
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setStyle();
      this.addListenerMove();
    });
  },
  methods: {
    addListenerMove() {
      const el = this.$refs.dialog.$el;
      const dialog = el.querySelector(".el-dialog");
      const header = el.querySelector(".el-dialog__header");
      header.addEventListener("mousedown", (e) => {
        if (this.fullScreenState) return;
        const { clientX, clientY } = e;
        const { width: wrapW, height: wrapH } = el.getBoundingClientRect();
        const { left, top, width, height } = dialog.getBoundingClientRect();
        const move = (e) => {
          const { clientX: x, clientY: y } = e;
          let moveLeft = x - clientX + left + width / 2;
          moveLeft = moveLeft < width / 2 ? width / 2 : moveLeft;
          moveLeft =
            moveLeft > wrapW - width / 2 ? wrapW - width / 2 : moveLeft;
          dialog.style.left = `${moveLeft}px`;

          let moveTop = y - clientY + top;
          moveTop = moveTop < 0 ? 0 : moveTop;
          moveTop = moveTop > wrapH - height ? wrapH - height : moveTop;
          dialog.style.top = `${moveTop}px`;
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", move);
        });
      });
    },
    setStyle() {
      const { width = "", height = "" } = this.dialogConfig;
      const el = this.$refs.dialog.$el;
      const dialog = el.querySelector(".el-dialog");
      const dialogBody = dialog.querySelector(".el-dialog__body");
      width && (dialog.style.width = width);
      height && (dialogBody.style.maxHeight = height);
    },
    fullScreenClick() {
      const el = this.$refs.dialog.$el;
      const dialog = el.querySelector(".el-dialog");
      this.fullScreenState = !this.fullScreenState;
      changeFullScreenState(dialog, this.fullScreenState);
      if (this.fullScreenState) {
        const dialogBody = dialog.querySelector(".el-dialog__body");
        dialogBody.style.maxHeight = "none";
      } else {
        this.setStyle();
      }
    },
  },
  beforeDestroy() {
    if (deepStyle) {
      deepStyle = null;
    }
  },
};
</script>

<style lang="stylus" scoped>
#dialog-wrap
  ::v-deep .dialog
    border-radius 15px
    position absolute
    top 15vh
    left 50%
    transform translateX(-50%)
    .el-dialog__header
      border-bottom 1px solid #c0c4cc
      cursor move
      span
        user-select none
    .dialog-header
      line-height 24px
      font-size 18px
      color #303133
      padding-right 20px
      .dialog-full
        position absolute
        top 20px
        right 60px
        padding 0
        background transparent
        border none
        outline none
        cursor pointer
        font-size 16px
        &:hover
          color #1890ff
    .el-dialog__body
      min-height 300px
      max-height 800px
      overflow auto
</style>
