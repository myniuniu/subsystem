// 模拟选课数据生成器（移除对不存在服务的依赖，避免打包错误）

export const generateMockCourseData = () => {
  // 在当前项目中未使用该生成器，且缺少相关服务，返回空数组以避免打包错误
  return [];
};

// 课程-章-节-视频 层级模拟数据（选择两门课程）
export const MOCK_COURSE_CONTENT_HIERARCHY = [
  {
    id: 201,
    type: 'course',
    title: '数据结构与算法基础',
    instructor: '王老师',
    chapters: [
      {
        id: '201-1',
        type: 'chapter',
        title: '线性结构',
        sections: [
          {
            id: '201-1-1',
            type: 'section',
            title: '数组与链表',
            videos: [
              {
                id: '201-1-1-1',
                type: 'video',
                title: '数组基础与时间复杂度',
                url: 'https://example.com/ds-array',
                duration: 900,
                progress: 80,
                instructor: '王老师'
              },
              {
                id: '201-1-1-2',
                type: 'video',
                title: '链表操作与工程实践',
                url: 'https://example.com/ds-linkedlist',
                duration: 1200,
                progress: 50,
                instructor: '王老师'
              }
            ]
          },
          {
            id: '201-1-2',
            type: 'section',
            title: '栈与队列',
            videos: [
              {
                id: '201-1-2-1',
                type: 'video',
                title: '栈与队列的实现',
                url: 'https://example.com/ds-stack-queue',
                duration: 1000,
                progress: 0,
                instructor: '王老师'
              }
            ]
          }
        ]
      },
      {
        id: '201-2',
        type: 'chapter',
        title: '树与图',
        sections: [
          {
            id: '201-2-1',
            type: 'section',
            title: '二叉树',
            videos: [
              {
                id: '201-2-1-1',
                type: 'video',
                title: '二叉树遍历方法',
                url: 'https://example.com/ds-binary-tree',
                duration: 1100,
                progress: 30,
                instructor: '王老师'
              }
            ]
          },
          {
            id: '201-2-2',
            type: 'section',
            title: '图与搜索',
            videos: [
              {
                id: '201-2-2-1',
                type: 'video',
                title: '图的表示与遍历',
                url: 'https://example.com/ds-graph',
                duration: 1200,
                progress: 10,
                instructor: '王老师'
              },
              {
                id: '201-2-2-2',
                type: 'video',
                title: 'DFS与BFS应用',
                url: 'https://example.com/ds-search',
                duration: 900,
                progress: 0,
                instructor: '王老师'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 204,
    type: 'course',
    title: '数据库设计与优化',
    instructor: '李老师',
    chapters: [
      {
        id: '204-1',
        type: 'chapter',
        title: '数据库基础与规范化',
        sections: [
          {
            id: '204-1-1',
            type: 'section',
            title: '关系模型与范式',
            videos: [
              {
                id: '204-1-1-1',
                type: 'video',
                title: '第一到第三范式讲解',
                url: 'https://example.com/db-normal-form',
                duration: 1000,
                progress: 70,
                instructor: '李老师'
              },
              {
                id: '204-1-1-2',
                type: 'video',
                title: '设计规范化的利与弊',
                url: 'https://example.com/db-normalization-pros-cons',
                duration: 800,
                progress: 40,
                instructor: '李老师'
              }
            ]
          },
          {
            id: '204-1-2',
            type: 'section',
            title: 'ER模型与约束',
            videos: [
              {
                id: '204-1-2-1',
                type: 'video',
                title: 'ER建模与实体关系',
                url: 'https://example.com/db-er-model',
                duration: 900,
                progress: 20,
                instructor: '李老师'
              },
              {
                id: '204-1-2-2',
                type: 'video',
                title: '完整性约束与外键设计',
                url: 'https://example.com/db-constraints-foreign-keys',
                duration: 850,
                progress: 10,
                instructor: '李老师'
              }
            ]
          }
        ]
      },
      {
        id: '204-2',
        type: 'chapter',
        title: '索引与查询优化',
        sections: [
          {
            id: '204-2-1',
            type: 'section',
            title: '索引类型与选择',
            videos: [
              {
                id: '204-2-1-1',
                type: 'video',
                title: 'B+树与哈希索引',
                url: 'https://example.com/db-index-types',
                duration: 1100,
                progress: 60,
                instructor: '李老师'
              },
              {
                id: '204-2-1-2',
                type: 'video',
                title: '覆盖索引与联合索引',
                url: 'https://example.com/db-covering-index',
                duration: 950,
                progress: 20,
                instructor: '李老师'
              }
            ]
          },
          {
            id: '204-2-2',
            type: 'section',
            title: 'SQL查询优化',
            videos: [
              {
                id: '204-2-2-1',
                type: 'video',
                title: '执行计划与优化器',
                url: 'https://example.com/db-explain-optimizer',
                duration: 1200,
                progress: 50,
                instructor: '李老师'
              },
              {
                id: '204-2-2-2',
                type: 'video',
                title: '索引提示与Join策略',
                url: 'https://example.com/db-query-join-hints',
                duration: 1000,
                progress: 30,
                instructor: '李老师'
              }
            ]
          },
          {
            id: '204-2-3',
            type: 'section',
            title: '事务与锁',
            videos: [
              {
                id: '204-2-3-1',
                type: 'video',
                title: '事务隔离级别与一致性',
                url: 'https://example.com/db-transaction-isolation',
                duration: 1100,
                progress: 40,
                instructor: '李老师'
              },
              {
                id: '204-2-3-2',
                type: 'video',
                title: '锁机制与并发控制',
                url: 'https://example.com/db-locks-concurrency',
                duration: 900,
                progress: 25,
                instructor: '李老师'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const getMockCourseContentHierarchy = () => MOCK_COURSE_CONTENT_HIERARCHY;

// 将课程层级数据扁平化为课程视频列表，便于原有列表直接展示
export const flattenCourseContentToVideos = (hierarchy) => {
  const videos = [];
  (hierarchy || []).forEach(course => {
    const courseId = course.id;
    const courseTitle = course.title;
    const defaultInstructor = course.instructor;
    (course.chapters || []).forEach(chapter => {
      (chapter.sections || []).forEach(section => {
        (section.videos || []).forEach(v => {
          videos.push({
            id: v.id,
            courseId,
            courseTitle,
            title: v.title,
            instructor: v.instructor || defaultInstructor,
            addTime: v.addTime || `${chapter.title} · ${section.title}`,
            url: v.url,
            videoInfo: {
              type: 'single_video',
              duration: v.duration || 0,
              progress: v.progress || 0
            }
          });
        });
      });
    });
  });
  return videos;
};

export default { generateMockCourseData, getMockCourseContentHierarchy, flattenCourseContentToVideos };