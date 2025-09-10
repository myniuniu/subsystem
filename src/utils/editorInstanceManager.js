// 全局编辑器实例管理器
class EditorInstanceManager {
  constructor() {
    this.instances = new Map(); // 存储编辑器实例
    this.domElements = new WeakMap(); // 存储DOM元素状态
    this.initializingElements = new Set(); // 正在初始化的DOM元素
  }

  // 检查DOM元素是否已被占用
  isDOMOccupied(editorElement, toolbarElement) {
    if (!editorElement || !toolbarElement) return false;
    
    // 检查是否有wangEditor相关属性
    const hasEditorAttrs = editorElement.hasAttribute('data-w-e-textarea') ||
                          editorElement.hasAttribute('contenteditable') ||
                          editorElement.classList.toString().includes('w-e-');
    
    const hasToolbarAttrs = toolbarElement.hasAttribute('data-w-e-toolbar') ||
                           toolbarElement.classList.toString().includes('w-e-');
    
    return hasEditorAttrs || hasToolbarAttrs;
  }

  // 生成唯一标识符
  generateInstanceId(editorElement, toolbarElement) {
    const editorId = editorElement?.id || 'editor';
    const toolbarId = toolbarElement?.id || 'toolbar';
    return `${editorId}-${toolbarId}-${Date.now()}`;
  }

  // 彻底清理DOM元素
  async cleanupDOM(editorElement, toolbarElement) {
    if (editorElement) {
      // 移除所有wangEditor相关属性
      editorElement.removeAttribute('data-w-e-textarea');
      editorElement.removeAttribute('contenteditable');
      editorElement.removeAttribute('data-slate-editor');
      editorElement.removeAttribute('data-slate-node');
      
      // 移除所有wangEditor相关类名
      const classList = editorElement.classList;
      const classesToRemove = [];
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].startsWith('w-e-')) {
          classesToRemove.push(classList[i]);
        }
      }
      classesToRemove.forEach(cls => classList.remove(cls));
      
      // 清空内容
      editorElement.innerHTML = '';
      
      // 重置样式
      editorElement.style.cssText = '';
    }
    
    if (toolbarElement) {
      // 移除工具栏相关属性
      toolbarElement.removeAttribute('data-w-e-toolbar');
      
      // 移除工具栏相关类名
      const classList = toolbarElement.classList;
      const classesToRemove = [];
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].startsWith('w-e-')) {
          classesToRemove.push(classList[i]);
        }
      }
      classesToRemove.forEach(cls => classList.remove(cls));
      
      // 清空内容
      toolbarElement.innerHTML = '';
      
      // 重置样式
      toolbarElement.style.cssText = '';
    }
    
    // 等待DOM完全清理
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 检查是否正在初始化
  isInitializing(editorElement) {
    return this.initializingElements.has(editorElement);
  }

  // 标记开始初始化
  markInitializing(editorElement) {
    this.initializingElements.add(editorElement);
  }

  // 标记初始化完成
  markInitialized(editorElement) {
    this.initializingElements.delete(editorElement);
  }

  // 注册编辑器实例
  registerInstance(instanceId, editorInstance, toolbarInstance, editorElement, toolbarElement) {
    const instance = {
      id: instanceId,
      editor: editorInstance,
      toolbar: toolbarInstance,
      editorElement,
      toolbarElement,
      createdAt: Date.now()
    };
    
    this.instances.set(instanceId, instance);
    this.domElements.set(editorElement, instanceId);
    this.domElements.set(toolbarElement, instanceId);
    
    console.log(`编辑器实例已注册: ${instanceId}`);
    return instance;
  }

  // 销毁编辑器实例
  async destroyInstance(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    console.log(`开始销毁编辑器实例: ${instanceId}`);
    
    try {
      // 销毁工具栏
      if (instance.toolbar) {
        await new Promise(resolve => {
          try {
            instance.toolbar.destroy();
            console.log(`工具栏已销毁: ${instanceId}`);
          } catch (error) {
            console.warn(`工具栏销毁失败: ${instanceId}`, error);
          }
          resolve();
        });
      }
      
      // 销毁编辑器
      if (instance.editor) {
        await new Promise(resolve => {
          try {
            instance.editor.destroy();
            console.log(`编辑器已销毁: ${instanceId}`);
          } catch (error) {
            console.warn(`编辑器销毁失败: ${instanceId}`, error);
          }
          resolve();
        });
      }
      
      // 清理DOM
      await this.cleanupDOM(instance.editorElement, instance.toolbarElement);
      
      // 从管理器中移除
      this.instances.delete(instanceId);
      this.domElements.delete(instance.editorElement);
      this.domElements.delete(instance.toolbarElement);
      this.markInitialized(instance.editorElement);
      
      console.log(`编辑器实例已完全销毁: ${instanceId}`);
      
    } catch (error) {
      console.error(`销毁编辑器实例失败: ${instanceId}`, error);
    }
  }

  // 根据DOM元素查找实例ID
  getInstanceIdByElement(element) {
    return this.domElements.get(element);
  }

  // 销毁所有实例
  async destroyAllInstances() {
    const instanceIds = Array.from(this.instances.keys());
    for (const instanceId of instanceIds) {
      await this.destroyInstance(instanceId);
    }
  }

  // 创建编辑器的便捷方法
  async createEditor({
    instanceId,
    editorContainer,
    toolbarContainer,
    initialContent = '<p><br></p>',
    onChange = () => {},
    onReady = () => {}
  }) {
    // 检查是否正在初始化
    if (this.isInitializing(editorContainer)) {
      throw new Error('编辑器正在初始化中，请稍后重试');
    }

    // 检查DOM是否被占用
    if (this.isDOMOccupied(editorContainer, toolbarContainer)) {
      console.warn('DOM元素已被占用，开始清理...');
      await this.cleanupDOM(editorContainer, toolbarContainer);
    }

    // 标记开始初始化
    this.markInitializing(editorContainer);

    try {
      // 导入并注册评论菜单
      const { registerCommentMenu } = await import('./editorMenuRegistry');
      await registerCommentMenu();

      // 编辑器配置
      const editorConfig = {
        placeholder: '请输入内容...',
        onChange(editor) {
          const html = editor.getHtml();
          onChange(html);
        },
        MENU_CONF: {
          uploadImage: {
            server: '/api/upload-image',
            fieldName: 'image',
            maxFileSize: 5 * 1024 * 1024,
            allowedFileTypes: ['image/*'],
            onFailed(file, res) {
              console.log('上传失败', file, res);
            },
            onError(file, err, res) {
              console.log('上传出错', file, err, res);
            }
          }
        }
      };

      // 工具栏配置
      const toolbarConfig = {
        toolbarKeys: [
          'headerSelect', 'blockquote', '|',
          'bold', 'italic', 'underline', 'through', 'code', 'sup', 'sub', 'clearStyle', '|',
          'color', 'bgColor', '|',
          'fontSize', 'fontFamily', 'lineHeight', '|',
          'bulletedList', 'numberedList', 'todo', '|',
          'emotion', 'insertLink', 'insertImage', 'insertTable', 'codeBlock', '|',
          'comment', '|',
          'undo', 'redo', '|',
          'fullScreen'
        ]
      };

      // 动态导入wangEditor
      const { createEditor, createToolbar } = await import('@wangeditor/editor');

      // 创建编辑器
      const editor = createEditor({
        selector: editorContainer,
        html: initialContent,
        config: editorConfig,
        mode: 'default'
      });

      // 创建工具栏
      const toolbar = createToolbar({
        editor,
        selector: toolbarContainer,
        config: toolbarConfig,
        mode: 'default'
      });

      // 注册实例
      const instance = this.registerInstance(
        instanceId,
        editor,
        toolbar,
        editorContainer,
        toolbarContainer
      );

      // 标记初始化完成
      this.markInitialized(editorContainer);

      // 调用就绪回调
      onReady();

      return { editor, toolbar, instanceId };

    } catch (error) {
      // 初始化失败，清理状态
      this.markInitialized(editorContainer);
      console.error('编辑器初始化失败:', error);
      throw error;
    }
  }

  // 销毁编辑器的便捷方法
  async destroyEditor(instanceId) {
    await this.destroyInstance(instanceId);
  }

  // 手动清理初始化状态的公共方法
  clearInitializingState(editorElement) {
    this.markInitialized(editorElement);
  }

  // 获取实例统计信息
  getStats() {
    return {
      totalInstances: this.instances.size,
      initializingCount: this.initializingElements.size,
      instances: Array.from(this.instances.values()).map(instance => ({
        id: instance.id,
        createdAt: instance.createdAt,
        age: Date.now() - instance.createdAt
      }))
    };
  }
}

// 创建全局单例
const editorInstanceManager = new EditorInstanceManager();

export default editorInstanceManager;