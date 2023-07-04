import vitePluginremoveConsole from 'vite-plugin-remove-console';

export default function removeConsole(env) {
  console.log('env',env)
  return env.VITE_APP_MODE=='production'?vitePluginremoveConsole():()=>{}
}
