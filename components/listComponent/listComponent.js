// components/listComponent/listComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLike: {
      type: String,
      value: "0"
    },
    item:{
      type: Object,
      value: {
        title: "",
        author: "",
        reader: "",
        time: "",
        duration: ""
      }
    },
    playingId: {
      type: String,
      value: " "
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
