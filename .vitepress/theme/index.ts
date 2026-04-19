import DefaultTheme from 'vitepress/theme'
import './custom.css'
import AsunJsonConverter from './AsunJsonConverter.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AsunJsonConverter', AsunJsonConverter)
  },
} satisfies Theme
