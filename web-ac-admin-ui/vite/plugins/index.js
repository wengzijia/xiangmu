import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import removeConsole from './remove-console'
import { viteMockServe } from 'vite-plugin-mock'
export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    isBuild && vitePlugins.push(removeConsole(viteEnv))
    viteEnv.VITE_APP_MODE==='mock' && vitePlugins.push(viteMockServe({mockPath:'mock'}))
    return vitePlugins
}
