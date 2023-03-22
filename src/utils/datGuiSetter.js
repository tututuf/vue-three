import * as Three from 'three'

export default class GuiSetter {
  constructor(scene) {
    this.scene = scene
  }
  removeChild(child) {
    this.scene.remove(child)
  }
  addCube(width, height, depth) {
    const geometry = new Three.BoxGeometry(width, height, depth)
    const material = new Three.MeshLambertMaterial({ color: 0xffffff })
    const cube = new Three.Mesh(geometry, material)
    cube.castShadow = true

    cube.position.x = -10
    cube.position.y = 0
    cube.position.z = 0

    this.scene.add(cube)
  }
}