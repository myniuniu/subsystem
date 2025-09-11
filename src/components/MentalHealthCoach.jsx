import React, { useEffect } from 'react'

const MentalHealthCoach = ({ onNavigate }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('MentalHealthCoach received message:', event.data)
      if (event.data && event.data.type === 'NAVIGATE_TO_EVALUATION') {
        console.log('Forwarding navigation request to parent')
        if (onNavigate) {
          onNavigate('my-evaluation')
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
        src="/gen-html/mental-health-coach.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px'
        }}
        title="心理健康辅导场景模拟"
      />
    </div>
  )
}

export default MentalHealthCoach