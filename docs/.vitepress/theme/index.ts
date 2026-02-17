import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from '@giscus/vue'
import './style.css' 

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Giscus, {
        repo: "xieyccccc/xieycccccc.github.io", 
        repoId: "R_kgDOQDZLsg", // 这里需要替换为你自己的 repoId
        category: "Announcements", 
        categoryId: "DIC_kwDOQDZLss4C2oeW", // 这里需要替换为你自己的 categoryId
        mapping: "pathname",     
        strict: "0",
        reactionsEnabled: "1",   
        emitMetadata: "0",
        inputPosition: "top",    
        theme: "preferred_color_scheme", 
        lang: "zh-CN",
        loading: "lazy"
      })
    })
  }
}
