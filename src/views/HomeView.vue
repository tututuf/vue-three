<template>
  <div>
    <div ref="threeBox"></div>
    <div ref="statsBox"></div>
  </div>
</template>

<script>
import * as Three from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import Dat from 'dat.gui'
import GuiSetter from '@/utils/datGuiSetter'

export default {
  data() {
    return {
      ctrlObj: {
        rotationSpeed: 0.01,
        jumpSpeed: 0.01
      },
      ctrl: new Dat.GUI(),
      camera: undefined,
      render: undefined,
      scene: undefined,
      guiSetter: undefined
    }
  },
  mounted() {
    this.initThreeView()
    window.onresize = e => {
      console.log(e);
      this.onWindowResize(e)
    }
  },
  methods: {
    /**
     * 自适应窗口大小
     */
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.render.setSize(window.innerWidth, window.innerHeight)
    },
    initThreeView() {
      const _self = this

      this.setDatGui()

      this.scene = new Three.Scene() // 创建场景
      this.scene.fog = new Three.Fog(0x111111, 0.01, 100)
      this.guiSetter = new GuiSetter(this.scene)
      this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) // 创建相机
      this.camera.position.set(-30, 60, 30)
      this.camera.lookAt(this.scene.position)
      this.render = new Three.WebGLRenderer()  // 创建渲染器
      this.render.setSize(window.innerWidth, window.innerHeight)  // 渲染画面的大小
      this.render.shadowMap.enabled = true
      this.$refs.threeBox.appendChild(this.render.domElement)

      const axes = new Three.AxesHelper(50)
      this.scene.add(axes)

      const geometry = new Three.BoxGeometry(8, 8, 8) // 创建立方体
      const material = new Three.MeshLambertMaterial({ color: 0xa155f120 }) // 设置基础材质 （Basic设置点光源无效）
      const cube = new Three.Mesh(geometry, material) // 结合立方体和他的材质
      this.scene.add(cube) // 将立方体加入场景
      this.scene.isRotate = true
      cube.castShadow = true // 显示立方体倒影
      cube.position.set(0, 8, 0)

      const planeGeometry = new Three.PlaneGeometry(100, 100) // 新建地面
      const planeMaterial = new Three.MeshLambertMaterial({ color: 0xdddddd }) // 创建lambert材质
      const plane = new Three.Mesh(planeGeometry, planeMaterial) // 结合材质形状创建地面
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(15, 0, 0)
      plane.receiveShadow = true // 地面可显示倒影
      this.scene.add(plane) // 将地面加入场景

      const spotLight = new Three.SpotLight(0xFFFFFF) // 创建聚光灯对象
      spotLight.castShadow = true // 聚光灯获得倒影
      spotLight.shadow.mapSize = new Three.Vector2(1024, 1024)
      spotLight.position.set(-20, 100, 50)
      spotLight.shadow.camera.far = 130
      spotLight.shadow.camera.near = 40
      this.scene.add(spotLight)

      const ambient = new Three.AmbientLight({ color: 0xAAAAAA }) // 创建ambient光源，lambert需要光源才能显示
      this.scene.add(ambient)
      const stats = this.addStats()
      renderScene()
      var gap = 0
      function renderScene() {  // 平滑渲染
        cube.rotation.x += _self.ctrlObj.rotationSpeed   // 旋转方块
        cube.rotation.y += _self.ctrlObj.rotationSpeed
        cube.rotation.z += _self.ctrlObj.rotationSpeed

        gap += _self.ctrlObj.jumpSpeed
        cube.position.x = 20 * (Math.sin(gap)) // 方块跳跃
        cube.position.y = 6 + 20 * (Math.abs(Math.cos(gap)))

        // _self.scene.traverse(function (obj) {
        //   // if (obj.isRotate) {
        //   //   obj.rotation.x += _self.ctrlObj.rotationSpeed
        //   //   obj.rotation.y += _self.ctrlObj.rotationSpeed
        //   //   obj.rotation.z += _self.ctrlObj.rotationSpeed
        //   // }
        //   // console.log(obj.isRotate);
        // })
        stats.update()
        requestAnimationFrame(renderScene)
        _self.render.render(_self.scene, _self.camera)
      }
    },
    /**
     * 显示帧数，性能检测
     */
    addStats() {
      const stats = new Stats()
      stats.setMode(0)
      this.$refs.statsBox.appendChild(stats.domElement)
      return stats
    },
    /**
     * 设置dat.gui速度调试
     */
    setDatGui() {
      this.ctrl.add(this.ctrlObj, "rotationSpeed", 0, 1)
      this.ctrl.add(this.ctrlObj, "jumpSpeed", 0, 1)
    },
    /**
     * 
     */
    removeObject() {
      this.scene.removeObject
    }
  }
}
</script>
