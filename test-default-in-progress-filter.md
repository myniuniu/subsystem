# 默认显示进行中项目功能实现

## 功能描述
根据【时间周期类业务的状态机管理规范】和【进行中业务的进度可视化与学习建议规范】，为小黑屋的组织培训分类新增了默认只显示进行中项目的功能。

## 实现的功能特性

### 1. 默认筛选设置
- **初始状态**: 页面加载时默认只显示"进行中"状态的组织培训项目
- **自动筛选**: 基于培训的开始时间和结束时间，自动判断并筛选进行中的项目
- **状态识别**: 使用 `getTrainingStatusInfo()` 函数智能识别培训状态

### 2. 可视化控制开关
在组织培训分类下，标题区域新增了一个控制开关：

#### 开关样式和功能
- **位置**: 主题数量统计右侧
- **样式**: 小尺寸开关，带有图标标识
- **开启状态**: 🔄 图标 + "仅显示进行中"文字
- **关闭状态**: "全部" 文字 + "显示全部状态"文字
- **默认状态**: 开启（`showInProgressOnly = true`）

#### 交互逻辑
- **开启时**: 只显示状态为"进行中"的培训项目
- **关闭时**: 显示所有状态的培训项目（未开始、进行中、已结束）
- **实时响应**: 切换开关立即更新列表显示
- **分类限制**: 只在"组织培训"分类下显示此控制开关

### 3. 智能筛选逻辑

#### 筛选条件组合
```javascript
// 在组织培训分类下，默认只显示进行中的项目
if (showInProgressOnly) {
  filtered = filtered.filter(note => {
    const statusInfo = getTrainingStatusInfo(note);
    return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
  });
}
```

#### 状态判断标准
- **未开始**: 当前时间 < 开始时间
- **进行中**: 开始时间 ≤ 当前时间 < 结束时间
- **已结束**: 当前时间 ≥ 结束时间

## 用户体验优化

### 1. 默认聚焦重点
- **提高效率**: 用户首次进入即可看到需要关注的进行中项目
- **减少干扰**: 避免已结束或未开始的项目分散注意力
- **突出紧迫性**: 进行中的项目通常需要立即行动

### 2. 灵活性保证
- **可切换**: 用户可以随时切换查看全部状态
- **状态保持**: 在当前会话中保持用户的选择
- **视觉反馈**: 清晰的开关状态和文字说明

### 3. 信息完整性
关闭筛选后可以看到完整的培训信息：
- 📅 未开始的培训（规划阶段）
- 🔄 进行中的培训（当前重点）
- ✅ 已结束的培训（历史记录）

## 技术实现细节

### 1. 状态管理
```javascript
const [showInProgressOnly, setShowInProgressOnly] = useState(true); // 默认只显示进行中
```

### 2. 筛选逻辑更新
```javascript
useEffect(() => {
  // ... 其他筛选逻辑
  
  // 在组织培训分类下，默认只显示进行中的项目
  if (showInProgressOnly) {
    filtered = filtered.filter(note => {
      const statusInfo = getTrainingStatusInfo(note);
      return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
    });
  }
  
  setFilteredNotes(filtered);
}, [notes, selectedCategory, selectedTags, searchTerm, showInProgressOnly]);
```

### 3. UI组件集成
```jsx
{selectedCategory === 'organizational_training' && (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Switch 
      size="small"
      checked={showInProgressOnly}
      onChange={setShowInProgressOnly}
      checkedChildren="🔄"
      unCheckedChildren="全部"
    />
    <Text style={{ fontSize: '12px', color: '#666' }}>
      {showInProgressOnly ? '仅显示进行中' : '显示全部状态'}
    </Text>
  </div>
)}
```

## 测试验证步骤

### 1. 基础功能测试
1. 进入小黑屋页面
2. 确认默认选中"组织培训"分类
3. 验证默认只显示进行中的培训项目
4. 检查开关是否处于开启状态，显示"🔄 仅显示进行中"

### 2. 开关切换测试
1. 点击开关，切换到关闭状态
2. 验证显示所有状态的培训项目
3. 检查文字变更为"显示全部状态"
4. 再次点击开关，确认回到只显示进行中状态

### 3. 分类切换测试
1. 切换到其他分类（如"学习主题"）
2. 确认开关控件不显示
3. 切换回"组织培训"分类
4. 确认开关重新显示，状态保持

### 4. 数据验证测试
1. 在开关开启状态下，计算显示的项目数量
2. 关闭开关，验证项目数量是否增加
3. 确认增加的项目为未开始或已结束状态

## 预期效果

### ✅ 用户体验提升
- **快速聚焦**: 用户立即看到需要关注的进行中培训
- **减少认知负荷**: 避免信息过载
- **提高行动效率**: 直接关注需要学习的内容

### ✅ 功能完整性
- **保持灵活**: 可随时查看全部状态
- **状态清晰**: 不同状态有明确的视觉区分
- **操作简单**: 一键切换显示模式

### ✅ 符合业务逻辑
- **突出重点**: 进行中的培训是当前优先级最高的
- **时间敏感**: 帮助用户把握学习时机
- **进度管理**: 配合进度可视化功能，提升学习效率

## 后续优化建议

1. **记忆用户偏好**: 可考虑在localStorage中保存用户的筛选偏好
2. **快捷键支持**: 添加键盘快捷键快速切换显示模式
3. **统计信息增强**: 在开关旁显示各状态的数量统计
4. **提醒功能**: 对即将开始或即将结束的培训添加特殊标识

## 相关文件
- `/src/components/SmartNotes.jsx` - 主要修改文件，添加状态管理和UI控件
- `/src/utils/trainingStatusUtils.js` - 状态判断工具函数

根据【时间周期类业务的状态机管理规范】，此功能完美体现了状态机的自动管理和差异化展示，提升了用户对进行中业务的关注度和管理效率。