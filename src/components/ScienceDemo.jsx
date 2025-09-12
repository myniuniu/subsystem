import React, { useEffect } from 'react'

const ScienceDemo = ({ onNavigate }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('ScienceDemo received message:', event.data)
      // 可以在这里处理来自iframe的消息
      if (event.data && event.data.type === 'NAVIGATE_BACK') {
        console.log('Forwarding navigation request to parent')
        if (onNavigate) {
          onNavigate('scenario-library')
        }
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onNavigate])

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/gen-html/science_demo_home.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px'
        }}
        title="科学演示场景模拟"
      />
    </div>
  )
}

export default ScienceDemo