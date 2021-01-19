<template>
  <div id="app">
    <div class="left-container">
      <GoJsDesigner
        v-if="renderComponent"
        :preview="preview"
        @nodeOnClick="nodeOnClick"
        :data="data"
        ref="designer"
      >
      </GoJsDesigner>
    </div>
    <div class="right-container">
      <el-button size="small" @click="getJson" type="primary"
        >获取json</el-button
      >
      <br />
      <el-button
        size="small"
        @click="forceRerender(false)"
        style="margin: 0"
        type="primary"
        >编辑模式</el-button
      >
      <el-button
        size="small"
        @click="forceRerender(true)"
        style="margin: 0"
        type="success"
        >预览模式</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      renderComponent: true,
      preview: false,
      data: {
        class: "GraphLinksModel",
        copiesKey: false,
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        modelData: { position: "-731.943603515625 -528.6967468261719" },
        nodeDataArray: [
          {
            text: "开始",
            figure: "Circle",
            fill: "#4fba4f",
            key: -1,
            loc: "-630 -300",
          },
          { text: "步骤1", key: -2, loc: "-450 -300" },
          { text: "步骤2", key: -3, loc: "-330 -380" },
          { text: "步骤3", key: -4, loc: "-330 -220" },
          { text: "步骤", key: -5, loc: "-210 -300" },
          {
            text: "结束",
            figure: "Circle",
            fill: "#4fba4f",
            key: -6,
            loc: "-70 -300",
          },
        ],
        linkDataArray: [
          {
            from: -1,
            to: -2,
            fromPort: "R",
            toPort: "L",
            points: [
              -594.1162790697674,
              -299.99999999999994,
              -584.1162790697674,
              -299.99999999999994,
              -536.5171239098837,
              -299.99999999999994,
              -536.5171239098837,
              -300,
              -488.91796875,
              -300,
              -478.91796875,
              -300,
            ],
          },
          {
            from: -2,
            to: -3,
            fromPort: "R",
            toPort: "L",
            points: [
              -421.08203125,
              -300,
              -411.08203125,
              -300,
              -390.546875,
              -300,
              -390.546875,
              -380,
              -370.01171875,
              -380,
              -360.01171875,
              -380,
            ],
          },
          {
            from: -2,
            to: -4,
            fromPort: "",
            toPort: "L",
            points: [
              -421.08203125,
              -300,
              -411.08203125,
              -300,
              -390.5390625,
              -300,
              -390.5390625,
              -220,
              -369.99609375,
              -220,
              -359.99609375,
              -220,
            ],
          },
          {
            from: -3,
            to: -5,
            fromPort: "",
            toPort: "L",
            points: [
              -299.98828125,
              -380,
              -289.98828125,
              -380,
              -267.494140625,
              -380,
              -267.494140625,
              -300,
              -245,
              -300,
              -235,
              -300,
            ],
          },
          {
            from: -4,
            to: -5,
            fromPort: "R",
            toPort: "L",
            points: [
              -300.00390625,
              -220,
              -290.00390625,
              -220,
              -267.501953125,
              -220,
              -267.501953125,
              -300,
              -245,
              -300,
              -235,
              -300,
            ],
          },
          {
            from: -5,
            to: -6,
            fromPort: "R",
            toPort: "L",
            points: [
              -185,
              -300,
              -175,
              -300,
              -145.4418604651163,
              -300,
              -145.4418604651163,
              -300,
              -115.88372093023256,
              -300,
              -105.88372093023256,
              -300,
            ],
          },
        ],
      },
    };
  },
  methods: {
    getJson() {
      // eslint-disable-next-line no-console
      console.log(this.$refs.designer.getJSON());
      alert(this.$refs.designer.getJSON());
    },
    nodeOnClick(node) {
      // eslint-disable-next-line no-console
      console.log(node);
      alert(JSON.stringify(node))
    },
    forceRerender(preview) {
      this.preview = preview;
      // 从 DOM 中删除 my-component 组件
      this.renderComponent = false;

      this.$nextTick(() => {
        // 在 DOM 中添加 my-component 组件
        this.renderComponent = true;
      });
    },
  },
};
</script>

<style lang="scss">
body,
html {
  max-width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  height: 100%;
  .left-container {
    flex: 1;
    height: 100%;
  }
  .right-container {
    flex-basis: 150px;
    height: 100%;
    text-align: center;
  }
}
</style>
