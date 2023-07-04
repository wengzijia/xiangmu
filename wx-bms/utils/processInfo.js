const info = [
  {
    name: "印刷",
    id: 0,
    list: [
      {
        /**参数标题 */
        label: "印刷类型",
        /**组件类型 */
        type: "radio",
        /**是否必填 */
        required: true,
        /**是否显示*/
        isShow: true,
        /** picker和单选组件选中后的值 */
        value: "普通印刷",
        /** 依赖数据组 {label:依赖参数标题,value:依赖选中的值} */
        parentAttr: [],
        key:'paper_type',
        /**校验正则字符串 */
        checkRegStr: "",
        /**校验不通过提示语 */
        checkTip: "",
        /** 参数属性数组  radio */
        attr: [
          {
            /**展示的值 */
            label: "普通印刷",
            /**实际组合需要的值 */
            value: "普通印刷",
            /** 多选时是否选中的值 */
            isSelect: true,
          },
          {
            /**参数标题 */
            label: "UV印刷",
            /**参数标题 */
            value: "UV印刷",
          },
        ],
      },
      {
        label: "上机机台",
        type: "radio",
        required: true,
        isShow: true,
        key:"process_device_type",
        value: "对开",
        attr: [
          {
            label: "对开",
            value: "对开",
          },
          {
            label: "四开",
            value: "四开",
          },
          {
            label: "六开",
            value: "六开",
          },
        ],
      },
      {
        label: "印刷尺寸",
        type: "sizeInput",
        required: true,
        key:'area',
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "印刷数量",
        type: "input",
        required: true,
        isShow: true,
        key: "number",
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "印刷颜色",
        type: "checkbox",
        required: true,
        isShow: true,
        key:"process_color",
        parentAttr: [
          {
            label: "印刷类型",
            value: "普通印刷",
          },
        ],
        value: "",
        attr: [
          {
            label: "多色(CMYK)",
            value: "多色(CMYK)",
            isSelect: true,
          },
        ],
      },
      {
        label: "印刷颜色",
        type: "checkbox",
        required: true,
        key:"process_color",
        isShow: false,
        parentAttr: [
          {
            label: "印刷类型",
            value: "UV印刷",
          },
        ],
        values: ["多色(CMYK)"],
        attr: [
          {
            label: "多色(CMYK)",
            value: true,
            isSelect: true,
          },
          {
            label: "白墨",
            value: false,
            isSelect: false,
          },
          {
            label: "磨砂",
            value: false,
            isSelect: false,
          },
        ],
      },
      {
        label: "专色数量",
        type: "picker",
        key:"process_color_num",
        required: false,
        isShow: true,
        value: "0",
        isShowPicker: false,
        attr: [
          {
            name: "0",
            label: "0",
            value: "0",
          },
          {
            name: "1",
            label: "1",
            value: "1",
          },
          {
            name: "2",
            label: "2",
            value: "2",
          },
          {
            name: "3",
            label: "3",
            value: "3",
          },
          {
            name: "4",
            label: "4",
            value: "4",
          },
        ],
      },
    ],
  },

  {
    name: "CTP制版",
    id: 1,
    list: [
      {
        label: "开料尺寸",
        type: "sizeInput",
        key:'area',
        required: true,
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        /**参数标题 */
        label: "上机机台",
        /**组件类型 */
        type: "radio",
        key:'process_device_type',
        /**是否必填 */
        required: true,
        /**是否显示*/
        isShow: true,
        /** picker和单选组件选中后的值 */
        value: "对开",
        /** 依赖数据组 {label:依赖参数标题,value:依赖选中的值} */
        parentAttr: [],
        /** 参数属性数组  radio */
        attr: [
          {
            /**展示的值 */
            label: "对开",
            /**实际组合需要的值 */
            value: "对开",
            /** 多选时是否选中的值 */
            isSelect: true,
          },
          {
            /**参数标题 */
            label: "四开",
            /**参数值*/
            value: "四开",
          },
          {
            /**参数标题 */
            label: "六开",
            /**参数值 */
            value: "六开",
          },
        ],
      },
      {
        label: "印刷方式",
        type: "radio",
        required: true,
        isShow: true,
        value: "单面印刷",
        key:'paper_type',
        attr: [
          {
            label: "单面印刷",
            value: "单面印刷",
          },
          {
            label: "双面印刷",
            value: "双面印刷",
          },
        ],
      },
      {
        label: "制版数量",
        type: "input",
        required: true,
        isShow: true,
        key: "number",
        value: "单面印刷",
        attr: [
          {
            label: "单面",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "制版数量",
        type: "input",
        required: true,
        isShow: false,
        key: "back_number",
        value: "",
        parentAttr: [
          {
            label: "印刷方式",
            value: "双面印刷",
          },
        ],
        attr: [
          {
            label: "背面",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "覆膜",
    id: 2,
    list: [
      {
        label: "覆膜尺寸",
        type: "sizeInput",
        required: true,
        key:'area',
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },

      {
        label: "覆膜数量",
        type: "input",
        required: true,
        key:"number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "覆膜类型",
        type: "picker",
        required: true,
        isShow: true,
        key:"paper_type",
        value: "选择类型",
        isShowPicker: false,
        attr: [
          {
            name: "哑胶",
            label: "哑胶",
            value: "哑胶",
          },
          {
            name: "光胶",
            label: "光胶",
            value: "光胶",
          },
          {
            name: "防刮花哑膜",
            label: "防刮花哑膜",
            value: "防刮花哑膜",
          },
          {
            name: "镭射膜",
            label: "镭射膜",
            value: "镭射膜",
          },
          {
            name: "预涂光膜",
            label: "预涂光膜",
            value: "预涂光膜",
          },
          {
            name: "预涂哑膜",
            label: "预涂哑膜",
            value: "预涂哑膜",
          },
          {
            name: "触感膜",
            label: "触感膜",
            value: "触感膜",
          },
          // {
          //   name: "逆向",
          //   label: "逆向",
          //   value: "逆向",
          // },
          {
            name: "防刮花光膜",
            label: "防刮花光膜",
            value: "防刮花光膜",
          },
        ],
      },
      {
        label: "操作员",
        type: "picker",
        required: true,
        isShow: false,
        key:"operator_name",
        value: "",
        isShowPicker: false,
        attr2: [],
        attr: [],
      },
    ],
  },
  {
    name: "过油",
    id: 3,
    list: [
      {
        label: "过油尺寸",
        type: "sizeInput",
        required: true,
        key:'area',
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },

      {
        label: "过油数量",
        type: "input",
        required: true,
        isShow: true,
        key: "number",
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "过油类型",
        type: "picker",
        required: true,
        isShow: true,
        key:"paper_type",
        value: "光油",
        isShowPicker: false,
        attr: [
          {
            name: "光油",
            label: "光油",
            value: "光油",
          },
          {
            name: "哑油",
            label: "哑油",
            value: "哑油",
          },
          {
            name: "防刮油",
            label: "防刮油",
            value: "防刮油",
          },
        ],
      },
    ],
  },
  {
    name: "局部UV",
    id: 4,
    list: [
      {
        label: "UV尺寸",
        type: "sizeInput",
        required: true,
        key:'area',
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },

      {
        label: "UV数量",
        type: "input",
        required: true,
        key: "number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "烫金",
    id: 5,
    list: [
      {
        label: "烫金数量",
        type: "input",
        required: true,
        key: "number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "烫金类型",
        type: "checkbox",
        required: true,
        key:"paper_type",
        isShow: true,
        value: "",
        values: ["普通烫金"],
        attr: [
          {
            label: "普通烫金",
            value: "普通烫金",
            isSelect: true,
          },
          {
            label: "浮雕烫金",
            value: "浮雕烫金",
            isSelect: false,
          },
        ],
      },

      {
        label: "烫金颜色",
        type: "checkbox",
        required: true,
        key:'process_color',
        isShow: true,
        values: ["金色"],
        attr: [
          {
            label: "金色",
            value: "金色",
            isSelect: true,
          },
          {
            label: "浅金",
            value: "浅金",
            isSelect: false,
          },
          {
            label: "红金",
            value: "红金",
            isSelect: false,
          },
          {
            label: "蓝金",
            value: "蓝金",
            isSelect: false,
          },
          {
            label: "紫金",
            value: "紫金",
            isSelect: false,
          },
          {
            label: "黑金",
            value: "黑金",
            isSelect: false,
          },
          {
            label: "粉金",
            value: "粉金",
            isSelect: false,
          },
          {
            label: "绿金",
            value: "绿金",
            isSelect: false,
          },
          {
            label: "哑银",
            value: "哑银",
            isSelect: false,
          },
          {
            label: "银色",
            value: "银色",
            isSelect: false,
          },
          {
            label: "镭射银",
            value: "镭射银",
            isSelect: false,
          },
          {
            label: "其他金料",
            value: "其他金料",
            isSelect: false,
          },
        ],
      },
    ],
  },
  {
    name: "击凸",
    id: 6,
    list: [
     
      {
        label: "击凸数量",
        type: "input",
        required: true,
        key: "number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "纸张尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "击凸类型",
        type: "radio",
        required: false,
        isShow: true,
        value: "",
        key:'paper_type',
        attr: [
          {
            label: "普通击凸",
            value: "普通击凸",
            isSelect: true,
          },
          {
            label: "浮雕击凸",
            value: "浮雕击凸",
            isSelect: false,
          },
        ],
      }
    ],
  },
  {
    name: "击凹",
    id: 7,
    list: [
      {
        label: "击凹数量",
        type: "input",
        required: true,
        key: "number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "纸张尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
    ],
  },
  {
    name: "啤",
    id: 8,
    list: [
      {
        label: "啤数量",
        type: "input",
        required: true,
        key: "number",
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "啤尺寸",
        type: "sizeInput",
        required: "true",
        key:'area',
        isShow: true,
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },

      {
        label: "操作员",
        type: "picker",
        required: true,
        isShow: false,
        key:"operator_name",
        value: "",
        isShowPicker: false,
        attr2: [],
        attr: [],
      },
    ],
  },
  {
    name: "贴窗",
    id: 9,
    list: [
      {
        label: "贴窗数量",
        type: "input",
        required: true,
        isShow: true,
        key: "number",
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
      {
        label: "贴窗尺寸",
        type: "sizeInput",
        required: false,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "贴窗类型",
        type: "radio",
        required: true,
        isShow: true,
        key:"paper_type",
        value: "单面贴窗",
        attr: [
          {
            label: "单面贴窗",
            value: "单面贴窗",
          },
          {
            label: "跨二面贴窗",
            value: "跨二面贴窗",
          },
          {
            label: "跨三面贴窗",
            value: "跨三面贴窗",
          },
        ],
      },
    ],
  },
  {
    name: "粘盒",
    id: 10,
    list: [
      {
        label: "粘盒数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  // 2022/4/18
  {
    name: "装订",
    id: 10,
    list: [
      {
        label: "装订类型",
        type: "radio",
        key: "paper_type",
        required: true,
        isShow: true,
        value: "骑马订",
        attr: [
          {
            label: "骑马订",
            value: "骑马订",
          },
          {
            label: "无线胶装",
            value: "无线胶装",
          },
          {
            label: "锁线胶装",
            value: "锁线胶装",
          },
          
        ],
      },
      {
        label: "装订数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "贴合",
    id: 10,
    list: [
      {
        label: "贴合尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "贴合数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "裱绒",
    id: 10,
    list: [
      {
        label: "裱绒尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "裱绒数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "底部背胶",
    id: 10,
    list: [
      {
        label: "背胶面积",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "背胶数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "磁铁",
    id: 10,
    list: [
      {
        label: "磁铁尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "磁铁数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "纸张",
    id: 10,
    list: [
      {
        label: "纸张类型",
        type: "radio",
        key: "paper_type",
        required: true,
        isShow: true,
        value: "里纸",
        attr: [
          {
            label: "里纸",
            value: "里纸",
          },
          {
            label: "面纸",
            value: "面纸",
          },
        ],
      },
      {
        label: "纸张尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "纸张数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "啤版",
    id: 10,
    list: [
      {
        label: "刀线长度",
        type: "sizeInput",
        required: false,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "刀线长度",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "刀模数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "菲林",
    id: 10,
    list: [
      {
        label: "菲林尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "菲林数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
  {
    name: "制版",
    id: 10,
    list: [
      {
        label: "制版尺寸",
        type: "sizeInput",
        required: true,
        isShow: true,
        key:'area',
        attr: [
          {
            label: "长",
            value: "",
            unit: "X",
          },
          {
            label: "宽",
            value: "",
            unit: "mm",
          },
        ],
      },
      {
        label: "制版数量",
        type: "input",
        key: "number",
        required: true,
        isShow: true,
        value: "",
        attr: [
          {
            label: "",
            value: "",
            unit: "张",
          },
        ],
      },
    ],
  },
];

export default info;
