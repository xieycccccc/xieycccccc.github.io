import DefaultTheme from 'vitepress/theme'
import { h, defineComponent } from 'vue'
import Giscus from '@giscus/vue'
import './style.css'

const CommentsWrapper = () =>
  h('div', { class: 'giscus-wrapper' }, [
    h(Giscus, {
      repo: "xieycccccc/xieycccccc.github.io",
      repoId: "R_kgDOQDZLsg",
      category: "Announcements",
      categoryId: "DIC_kwDOQDZLss4C2oeW",
      mapping: "pathname",
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: "top",
      theme: "transparent_dark",
      lang: "zh-CN",
      loading: "lazy"
    })
  ])

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    setup() {
      return () =>
        h(DefaultTheme.Layout, null, {
          'doc-after': () => h(CommentsWrapper),
          // 让评论区和卡片同宽对齐（直接用 vp-doc 容器宽度）
          'home-features-after': () => h(CommentsWrapper)
        })
    }
  })
}