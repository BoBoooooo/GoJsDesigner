<!--
 * @file: GoJsDesigner 
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-11-15 19:52:02
-->

<template>
  <div class="designer-container">
    <div v-if="!preview" ref="toolbar" class="toolbar" />
    <div ref="diagram" class="diagram" />
  </div>
</template>

<script>
import go from "gojs";
// goJs 对象模板构造器
const { make } = go.GraphObject;

export default {
  name: "GoJsDesigner",
  props: {
    // 流程图json
    data: {
      type: Object,
      default: () => ({}),
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 视图层
      diagram: null,
      template: this.data,
      model: make(go.GraphLinksModel),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 注册事件
    eventBind() {
      // 注册节点点击事件
      this.diagram.addDiagramListener("ObjectSingleClicked", (e) => {
        // 此处需要判断点击的是否为node.否则点击line也会触发
        this.$emit("nodeOnClick", e.subject.part.jb);
      });
    },
    // 初始化
    init() {
      // 设置视图层
      this.diagram = this.getDiagram();

      if (!this.preview) {
        // 初始化工具栏
        this.diagram.nodeTemplate = this.getEditNodeTemplate();
        this.diagram.linkTemplate = this.getEditLinkTemplate();
        this.initToolbar();
      } else {
        // 设置节点模板
        this.diagram.nodeTemplate = this.getNodeTemplate();
        // 设置连线模板
        this.diagram.linkTemplate = this.getLinkTemplate();
        this.eventBind();
      }
      // 加载流程图
      this.loadDesigner();
    },
    // 节点模板
    getNodeTemplate() {
      // 返回节点模板
      return make(
        go.Node,
        // 模板内元素横向排列还是纵向排列
        "Spot",

        // { isShadowed: true },
        // 节点配置
        {
          // 定位的基准点设置在每个节点的中心处
          locationSpot: go.Spot.Center,
          // 禁止选中和拖动
          selectable: false,
          background: "#D1D1D1",
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),

        new go.Binding("angle").makeTwoWay(),
        // 节点背景色
        new go.Binding("background", "isHighlighted", (isHighlighted) => {
          switch (isHighlighted) {
            case "0":
              return "#F2F2F2"; // 未走过结点
            case "1":
              return "#91ADDD"; // 已走过结点
            case "2":
              return "#FEA200"; // 当前结点
            // case '-1':
            //   return '#67c23a'; // 开始结点
            // case '-2':
            //   return '#ff9c9d'; // 结束结点
            default:
              return "#F1F1F1";
          }
        }),
        // 定位
        new go.Binding("location", "loc", go.Point.parse),
        make(
          // GraphObjects包括：Shape图形、TextBlock文本、Picture图片、Panel面板
          go.TextBlock,
          "文本", // 默认文本
          // 配置TextBlock
          {
            font: "normal normal bold 16px Georgia",
            margin: 8,
            textAlign: "center",
          },
          // TextBlock.text参数的值绑定在Node.data.text
          new go.Binding("text", "text")
        )
      );
    },
    // 设置连线模板
    getLinkTemplate() {
      return make(
        go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 2,
          toShortLength: 4,
        },
        new go.Binding("points").makeTwoWay(),
        make(
          go.Shape, // the link path shape
          {
            strokeWidth: 1,
            stroke: "#ccc",
          },
          new go.Binding("strokeWidth", "isHighlighted", (isHighlighted) =>
            isHighlighted ? 3 : 1
          ),
          new go.Binding("stroke", "isHighlighted", (isHighlighted) =>
            isHighlighted ? "#015293" : "#ccc"
          )
        ),
        make(
          go.Shape, // the arrowhead
          {
            toArrow: "Standard",
            strokeWidth: 1,
            stroke: "#ccc",
          },
          new go.Binding("strokeWidth", "isHighlighted", (isHighlighted) =>
            isHighlighted ? 3 : 1
          ),
          new go.Binding("stroke", "isHighlighted", (isHighlighted) =>
            isHighlighted ? "#015293" : "#ccc"
          )
        ),
        make(
          go.Panel,
          "Auto",
          new go.Binding("visible", "isSelected").ofObject(),
          make(
            go.Shape,
            "RoundedRectangle", // the link shape
            { fill: "#F8F8F8", stroke: null },
            new go.Binding("strokeWidth", "isHighlighted", (isHighlighted) =>
              isHighlighted ? 3 : 1
            ),
            new go.Binding("stroke", "isHighlighted", (isHighlighted) =>
              isHighlighted ? "#015293" : "#ccc"
            )
          ),

          make(
            go.TextBlock,
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#919191",
              margin: 2,
              minSize: new go.Size(10, NaN),
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );
    },
    getEditNodeTemplate() {
      // 节点选中样式模板
      const nodeSelectionAdornmentTemplate = make(
        go.Adornment,
        "Auto",
        make(go.Shape, {
          fill: null,
          stroke: "deepskyblue",
          strokeWidth: 1.5,
          strokeDashArray: [4, 2],
        }),
        make(go.Placeholder)
      );

      // 节点中调整尺寸的端点模板
      const nodeResizeAdornmentTemplate = make(
        go.Adornment,
        "Spot",
        { locationSpot: go.Spot.Right },
        make(go.Placeholder),
        make(go.Shape, {
          alignment: go.Spot.TopLeft,
          cursor: "nw-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          alignment: go.Spot.Top,
          cursor: "n-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          alignment: go.Spot.TopRight,
          cursor: "ne-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),

        make(go.Shape, {
          alignment: go.Spot.Left,
          cursor: "w-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          alignment: go.Spot.Right,
          cursor: "e-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),

        make(go.Shape, {
          alignment: go.Spot.BottomLeft,
          cursor: "se-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          alignment: go.Spot.Bottom,
          cursor: "s-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          alignment: go.Spot.BottomRight,
          cursor: "sw-resize",
          desiredSize: new go.Size(6, 6),
          fill: "lightblue",
          stroke: "deepskyblue",
        })
      );

      // 阶段旋转样式模板
      const nodeRotateAdornmentTemplate = make(
        go.Adornment,
        { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
        make(go.Shape, "Circle", {
          name: "CIRCLE",
          cursor: "pointer",
          desiredSize: new go.Size(7, 7),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        make(go.Shape, {
          geometryString: "M3.5 7 L3.5 30",
          isGeometryPositioned: true,
          stroke: "deepskyblue",
          strokeWidth: 1.5,
          strokeDashArray: [4, 2],
        })
      );

      // 节点模板
      return make(
        go.Node,
        "Spot",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          selectable: true,
          selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        {
          resizable: true,
          resizeObjectName: "PANEL",
          resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        },
        {
          rotatable: true,
          rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        },
        new go.Binding("angle").makeTwoWay(),
        // 创建节点主要部分：具有链接端点的文字面板
        make(
          go.Panel,
          "Auto",
          { name: "PANEL" },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
            go.Size.stringify
          ),
          make(
            go.Shape,
            "Rectangle",
            {
              portId: "",
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer",
              fill: "white",
              strokeWidth: 2,
            },
            new go.Binding("figure")
          ),
          make(
            go.TextBlock,
            {
              font: "normal normal bold 16px Georgia",
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        ),
        // 创建节点的四个链接端点
        this.makePort("T", go.Spot.Top, true, true),
        this.makePort("L", go.Spot.Left, true, true),
        this.makePort("R", go.Spot.Right, true, true),
        this.makePort("B", go.Spot.Bottom, true, true),
        {
          // 注册节点鼠标事件
          mouseEnter: (e, node) => {
            this.showSmallPorts(node, true);
          },
          mouseLeave: (e, node) => {
            this.showSmallPorts(node, false);
          },
        }
      );
    },
    // 控制节点的链接端点显隐
    showSmallPorts(node, show) {
      node.ports.each((port) => {
        if (port.portId !== "") {
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    },
    makePort(name, spot, output, input) {
      return make(go.Shape, "Circle", {
        fill: null, // 默认不可见;
        // 显性时为灰色小圆点
        stroke: null,
        desiredSize: new go.Size(7, 7), // 端点尺寸
        alignment: spot, // 对齐端口
        alignmentFocus: spot, // 限制位置在节点内
        portId: name, // 声明该对象为一个端口
        fromSpot: spot,
        toSpot: spot, // 声明将在节点的那个位置连接这个端口
        fromLinkable: output,
        toLinkable: input, // 声明该端口是否允许绘制向外/内端口
        cursor: "pointer",
      });
    },
    // 视图层
    getDiagram() {
      const designerMode = {
        // 背景网格，间隙正好和节点高度相同方便对齐
        grid: make(
          go.Panel,
          "Grid",
          make(go.Shape, "LineH", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 4,
          }),
          make(go.Shape, "LineV", {
            stroke: "gray",
            strokeWidth: 0.5,
            interval: 4,
          })
        ),
        // 允许拖动
        allowDrop: true,
        // 拖动节点时自动吸附到网格点
        "draggingTool.isGridSnapEnabled": true,
        // 允许拖出一个终点不在任何节点上的连线
        "linkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.isUnconnectedLinkValid": true,
        // 拖动连线时在20范围内吸附节点
        "linkingTool.portGravity": 20,
        "relinkingTool.portGravity": 20,
        // 当选中连线时，连线起点标记
        "relinkingTool.fromHandleArchetype": make(go.Shape, "Diamond", {
          segmentIndex: 0,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "tomato",
          stroke: "darkred",
        }),
        // 当选中连线时，连线终点标记
        "relinkingTool.toHandleArchetype": make(go.Shape, "Diamond", {
          segmentIndex: -1,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "darkred",
          stroke: "tomato",
        }),
        "linkReshapingTool.handleArchetype": make(go.Shape, "Diamond", {
          desiredSize: new go.Size(7, 7),
          fill: "lightblue",
          stroke: "deepskyblue",
        }),
        // 允许撤销
        "undoManager.isEnabled": true,
      };

      const previewMode = {
        // 禁止滚轮
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone,
        // 禁止拖动
        contentAlignment: go.Spot.Center,
      };

      return make(
        go.Diagram,
        this.$refs.diagram,
        this.preview ? previewMode : designerMode
      );
    },
    // 设置连线模板
    getEditLinkTemplate() {
      const linkSelectionAdornmentTemplate = make(
        go.Adornment,
        "Link",
        make(
          go.Shape,
          // isPanelMain declares that this Shape shares the Link.geometry
          {
            isPanelMain: true,
            fill: null,
            stroke: "deepskyblue",
            strokeWidth: 0,
          }
        ) // use selection object's strokeWidth
      );
      return make(
        go.Link, // the whole link panel
        {
          selectable: true,
          selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
        },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
        },
        new go.Binding("points").makeTwoWay(),
        make(
          go.Shape, // the link path shape
          { isPanelMain: true, strokeWidth: 2 }
        ),
        make(
          go.Shape, // the arrowhead
          { toArrow: "Standard", stroke: null }
        ),
        make(
          go.Panel,
          "Auto",
          new go.Binding("visible", "isSelected").ofObject(),
          make(
            go.Shape,
            "RoundedRectangle", // the link shape
            { fill: "#F8F8F8", stroke: null }
          ),
          make(
            go.TextBlock,
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#919191",
              margin: 2,
              minSize: new go.Size(10, NaN),
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );
    },
    // 重绘图表
    redraw() {
      this.$nextTick(() => {
        this.init();
        // 设置数据层
        this.diagram.model = this.getModel();
      });
    },
    // 数据层
    getModel() {
      const { model } = this;
      model.nodeDataArray = JSON.parse(this.data).nodeDataArray || [];
      model.linkDataArray = JSON.parse(this.data).linkDataArray || [];
      return model;
    },
    // 初始化工具栏
    initToolbar() {
      // 初始化左侧工具栏
      make(go.Palette, this.$refs.toolbar, {
        maxSelectionCount: 1,
        nodeTemplateMap: this.diagram.nodeTemplateMap,
        // 工具栏内容
        model: new go.GraphLinksModel([
          { text: "开始", figure: "Circle", fill: "#4fba4f" },
          { text: "步骤" },
          { text: "结束", figure: "Circle", fill: "#4fba4f" },
        ]),
      });
    },
    getJSON() {
      this.diagram.model.modelData.position = go.Point.stringify(
        this.diagram.position
      );
      return this.diagram.model.toJson();
    },
    loadDesigner() {
      // 加载json
      this.diagram.model = go.Model.fromJson(
        this.data
          ? this.data
          : '{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[],"linkDataArray":[]}'
      );
      const pos = this.diagram.model.modelData.position;
      if (pos) this.diagram.initialPosition = go.Point.parse(pos);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.designer-container {
  height: 100%;
  & > div {
    float: left;
    border: solid 1px black;
    height: calc(100% - 2px);
  }
  .toolbar {
    width: 80px;
    overflow: hidden;
    background: whitesmoke;
    text-align: center;
  }
  .diagram {
    width: calc(100% - 90px);
  }
}
</style>
