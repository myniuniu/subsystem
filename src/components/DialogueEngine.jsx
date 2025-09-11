import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, Lightbulb, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import './DialogueEngine.css';

const DialogueEngine = ({ scenario, onComplete, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameState, setGameState] = useState({
    isActive: true,
    startTime: Date.now(),
    score: 0,
    responses: [],
    skillScores: {
      empathy: 0,
      listening: 0,
      problemIdentification: 0,
      intervention: 0,
      ethics: 0
    }
  });
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 对话流程配置
  const dialogueFlow = {
    'academic-stress': {
      steps: [
        {
          studentMessage: scenario.initialMessage,
          choices: [
            {
              text: "我理解你现在的压力，能具体告诉我你最担心的是什么吗？",
              type: "empathy",
              score: 8,
              feedback: "很好的共情回应，让学生感受到理解和关怀。",
              nextStep: 1
            },
            {
              text: "期末考试确实很重要，你平时的学习成绩怎么样？",
              type: "information",
              score: 6,
              feedback: "收集信息是必要的，但可以先表达共情。",
              nextStep: 1
            },
            {
              text: "睡不着觉很正常，很多学生都会这样，不用太担心。",
              type: "minimizing",
              score: 3,
              feedback: "避免轻视学生的感受，这可能让他们觉得不被理解。",
              nextStep: 1
            }
          ]
        },
        {
          studentMessage: "我主要担心如果考不好，会让父母失望，而且可能影响我的奖学金。我平时成绩还可以，但总觉得自己准备不够充分。",
          choices: [
            {
              text: "听起来你承受着来自多方面的压力。让我们一起分析一下，哪些担心是现实的，哪些可能是过度焦虑？",
              type: "cognitive",
              score: 9,
              feedback: "优秀的认知重构技巧，帮助学生理性分析问题。",
              nextStep: 2
            },
            {
              text: "你的成绩还可以，说明你有能力应对考试。我们来制定一个复习计划吧。",
              type: "solution",
              score: 7,
              feedback: "提供解决方案很好，但可以先处理情绪问题。",
              nextStep: 2
            },
            {
              text: "父母的期望确实会给人压力，但你要学会为自己而学习。",
              type: "advice",
              score: 5,
              feedback: "建议过于直接，缺乏对学生情感的深入理解。",
              nextStep: 2
            }
          ]
        },
        {
          studentMessage: "你说得对，我可能确实有些过度担心了。但是我还是很难控制这种焦虑的感觉，特别是晚上的时候。",
          choices: [
            {
              text: "焦虑是一种正常的情绪反应。我可以教你一些放松技巧，比如深呼吸和渐进性肌肉放松，这些可以帮助你改善睡眠。",
              type: "intervention",
              score: 9,
              feedback: "很好的干预策略，提供了具体可行的解决方法。",
              nextStep: 3
            },
            {
              text: "你可以试试运动或者听音乐来放松自己。",
              type: "general_advice",
              score: 6,
              feedback: "建议有用但过于笼统，缺乏专业的指导。",
              nextStep: 3
            },
            {
              text: "如果焦虑严重影响睡眠，你可能需要看医生开一些药物。",
              type: "medical",
              score: 4,
              feedback: "过早建议药物治疗，应该先尝试心理干预技巧。",
              nextStep: 3
            }
          ]
        },
        {
          studentMessage: "这些方法听起来很有用，我愿意尝试。你能具体教我怎么做深呼吸吗？",
          choices: [
            {
              text: "当然可以。首先，找一个舒适的姿势坐好，然后慢慢用鼻子吸气4秒，屏住呼吸4秒，再用嘴巴慢慢呼气6秒。我们现在就可以一起练习。",
              type: "technique",
              score: 10,
              feedback: "完美的技巧指导，具体、清晰且实用。",
              nextStep: 4
            },
            {
              text: "深呼吸就是慢慢吸气再慢慢呼气，你可以网上搜索更详细的方法。",
              type: "vague",
              score: 4,
              feedback: "指导过于模糊，没有提供足够的专业支持。",
              nextStep: 4
            },
            {
              text: "深呼吸很简单，你自己多练习就会了。我们来谈谈你的学习计划吧。",
              type: "dismissive",
              score: 3,
              feedback: "忽视了学生的具体需求，转移话题过于突然。",
              nextStep: 4
            }
          ]
        }
      ]
    },
    'social-anxiety': {
      steps: [
        {
          studentMessage: scenario.initialMessage,
          choices: [
            {
              text: "在人前表现确实需要勇气。能告诉我具体是什么让你感到紧张吗？是担心说错话，还是害怕被评判？",
              type: "exploration",
              score: 9,
              feedback: "很好的探索性问题，帮助深入了解焦虑的具体原因。",
              nextStep: 1
            },
            {
              text: "很多人都有演讲恐惧，这很正常。你需要多练习就会好的。",
              type: "normalizing",
              score: 5,
              feedback: "正常化有一定帮助，但过于简化了问题。",
              nextStep: 1
            },
            {
              text: "你为什么会觉得大家在看你的笑话？有什么具体的证据吗？",
              type: "challenging",
              score: 6,
              feedback: "挑战认知偏差是好的，但方式可能过于直接。",
              nextStep: 1
            }
          ]
        }
        // 更多步骤...
      ]
    }
    // 其他场景的对话流程...
  };

  useEffect(() => {
    // 初始化对话
    if (scenario && dialogueFlow[scenario.id]) {
      const firstStep = dialogueFlow[scenario.id].steps[0];
      addMessage('student', firstStep.studentMessage);
      setTimeout(() => {
        setCurrentChoices(firstStep.choices);
        setShowChoices(true);
      }, 1500);
    }
  }, [scenario]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender, content, type = 'text') => {
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleChoiceSelect = (choice) => {
    // 添加咨询师回应
    addMessage('counselor', choice.text);
    
    // 更新游戏状态
    const newScore = gameState.score + choice.score;
    const newSkillScores = { ...gameState.skillScores };
    newSkillScores[choice.type] = (newSkillScores[choice.type] || 0) + choice.score;
    
    setGameState(prev => ({
      ...prev,
      score: newScore,
      skillScores: newSkillScores,
      responses: [...prev.responses, {
        step: currentStep,
        choice: choice.text,
        score: choice.score,
        type: choice.type
      }]
    }));

    // 显示反馈
    setFeedback({
      message: choice.feedback,
      score: choice.score,
      type: choice.type
    });

    setShowChoices(false);

    // 继续到下一步
    setTimeout(() => {
      setFeedback(null);
      proceedToNextStep(choice.nextStep);
    }, 3000);
  };

  const proceedToNextStep = (nextStep) => {
    const flow = dialogueFlow[scenario.id];
    if (nextStep < flow.steps.length) {
      setCurrentStep(nextStep);
      const step = flow.steps[nextStep];
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('student', step.studentMessage);
        
        setTimeout(() => {
          setCurrentChoices(step.choices);
          setShowChoices(true);
        }, 1500);
      }, 2000);
    } else {
      // 对话结束
      completeScenario();
    }
  };

  const completeScenario = () => {
    const endTime = Date.now();
    const duration = Math.round((endTime - gameState.startTime) / 1000);
    
    const finalResults = {
      scenarioId: scenario.id,
      score: gameState.score,
      duration,
      skillScores: gameState.skillScores,
      responses: gameState.responses,
      completedAt: new Date().toISOString()
    };

    addMessage('system', '场景训练完成！正在生成评估报告...', 'completion');
    
    setTimeout(() => {
      onComplete(finalResults);
    }, 2000);
  };

  const resetScenario = () => {
    setMessages([]);
    setCurrentStep(0);
    setGameState({
      isActive: true,
      startTime: Date.now(),
      score: 0,
      responses: [],
      skillScores: {
        empathy: 0,
        listening: 0,
        problemIdentification: 0,
        intervention: 0,
        ethics: 0
      }
    });
    setShowChoices(false);
    setCurrentChoices([]);
    setFeedback(null);
    
    // 重新开始对话
    if (scenario && dialogueFlow[scenario.id]) {
      const firstStep = dialogueFlow[scenario.id].steps[0];
      setTimeout(() => {
        addMessage('student', firstStep.studentMessage);
        setTimeout(() => {
          setCurrentChoices(firstStep.choices);
          setShowChoices(true);
        }, 1500);
      }, 500);
    }
  };

  const getElapsedTime = () => {
    const elapsed = Math.round((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return <CheckCircle size={16} className="text-green-600" />;
    if (score >= 6) return <Lightbulb size={16} className="text-yellow-600" />;
    return <AlertTriangle size={16} className="text-red-600" />;
  };

  return (
    <div className="dialogue-engine">
      {/* 头部信息 */}
      <div className="dialogue-header">
        <div className="scenario-info">
          <h2 className="scenario-title">{scenario.title}</h2>
          <div className="scenario-meta">
            <div className="student-name">
              <span>学生: {scenario.studentProfile.name}</span>
            </div>
            <div className="timer">
              <Clock size={16} />
              <span>{getElapsedTime()}</span>
            </div>
            <div className="current-score">
              <span>当前得分: {gameState.score}</span>
            </div>
          </div>
        </div>
        
        <div className="dialogue-actions">
          <button className="reset-btn" onClick={resetScenario}>
            <RotateCcw size={16} />
            重新开始
          </button>
          <button className="back-btn" onClick={onBack}>
            返回
          </button>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="dialogue-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'student' ? '👤' : 
                 message.sender === 'counselor' ? '👨‍⚕️' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message student">
              <div className="message-avatar">👤</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 反馈显示 */}
        {feedback && (
          <div className="feedback-panel">
            <div className="feedback-header">
              {getScoreIcon(feedback.score)}
              <span className="feedback-title">反馈</span>
              <span className={`feedback-score ${getScoreColor(feedback.score)}`}>
                +{feedback.score}分
              </span>
            </div>
            <div className="feedback-message">{feedback.message}</div>
          </div>
        )}

        {/* 选择区域 */}
        {showChoices && currentChoices.length > 0 && (
          <div className="choices-panel">
            <div className="choices-header">
              <Lightbulb size={16} />
              <span>请选择你的回应方式：</span>
            </div>
            <div className="choices-list">
              {currentChoices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-button"
                  onClick={() => handleChoiceSelect(choice)}
                >
                  <div className="choice-text">{choice.text}</div>
                  <div className="choice-meta">
                    <span className="choice-type">{choice.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueEngine;