"use client"
// 是的,加上"use client"就是CSR(客户端渲染)模式,组件在浏览器端执行,可以使用浏览器API和React hooks
// 不加的话默认是SSR(服务器端渲染)模式,组件在Node.js服务器上预渲染,不能使用客户端特性
// 这是Next.js 13+ App Router的新特性,用于优化性能和SEO
import { BookComponent } from "./book-component"

export function AutoLeftTurnBook() {
  return <BookComponent mode="auto-left" showControls={false} />
}

