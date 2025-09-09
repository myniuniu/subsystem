// 全局编辑器菜单注册管理器
// 避免多个组件重复注册相同的wangEditor菜单

let registeredMenus = new Set()
let bootInstance = null

// 获取Boot实例
const getBootInstance = async () => {
  if (!bootInstance) {
    const { Boot } = await import('@wangeditor/editor')
    bootInstance = Boot
  }
  return bootInstance
}

// 注册评论菜单（全局单例）
export const registerCommentMenu = async () => {
  const menuKey = 'comment'
  
  // 如果已经注册过，直接返回
  if (registeredMenus.has(menuKey)) {
    return
  }
  
  try {
    const Boot = await getBootInstance()
    
    class CommentMenu {
      constructor() {
        this.title = '添加评论'
        this.iconSvg = `<svg viewBox="0 0 1024 1024"><path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zM293 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zM433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"/><path d="M894 345c-48.1-66-115.3-110.1-189-130v.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4 5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.8 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753.8c88.1-119.6 90.4-284.9 1-408.8zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-204.5 150.5-348 102zm505 17l-8 10 1 104-99-31-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1C613.7 829.9 680.7 798.6 734 734c96.1-115.3 92.3-281.9-8-389 138.8-35.2 274.9 32.9 339 154 65.8 123.8 60.5 259.8 14 364z"/></svg>`
        this.tag = 'button'
      }

      getValue(editor) {
        return ''
      }

      isActive(editor) {
        return false
      }

      isDisabled(editor) {
        const selectedText = editor.getSelectionText()
        return !selectedText || selectedText.trim() === ''
      }

      exec(editor, value) {
        if (this.isDisabled(editor)) {
          // 动态导入message以避免循环依赖
          import('antd').then(({ message }) => {
            message.warning('请先选中要评论的文本')
          })
          return
        }
        
        const selectedText = editor.getSelectionText()
        if (selectedText && selectedText.trim()) {
          // 弹出评论输入框
          const commentText = prompt('请输入评论内容：')
          if (commentText && commentText.trim()) {
            // 在选中文本后添加评论标记
            const commentHtml = `<span style="background-color: #fff3cd; border-bottom: 2px solid #ffc107; position: relative;" title="评论: ${commentText}">${selectedText}</span>`
            editor.dangerouslyInsertHtml(commentHtml)
            import('antd').then(({ message }) => {
              message.success('评论添加成功')
            })
          }
        }
      }
    }

    // 注册菜单
    Boot.registerMenu({
      key: menuKey,
      factory() {
        return new CommentMenu()
      }
    })
    
    registeredMenus.add(menuKey)
    console.log('评论菜单注册成功')
    
  } catch (error) {
    // 如果菜单已经注册过，忽略错误
    if (error.message && error.message.includes('Duplicated key')) {
      registeredMenus.add(menuKey)
      console.log('评论菜单已存在，跳过注册')
    } else {
      console.error('注册评论菜单失败:', error)
      throw error
    }
  }
}

// 清理注册状态（用于测试或重置）
export const clearMenuRegistry = () => {
  registeredMenus.clear()
  bootInstance = null
}