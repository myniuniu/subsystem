// 模拟选课数据生成器（移除对不存在服务的依赖，避免打包错误）

export const generateMockCourseData = () => {
  // 在当前项目中未使用该生成器，且缺少相关服务，返回空数组以避免打包错误
  return [];
};

// 课程-章-节-视频 层级模拟数据（选择两门课程）
export const MOCK_COURSE_CONTENT_HIERARCHY = [
  {
    id: 'org_ntm',
    type: 'course',
    title: '新教师教学方法培训',
    instructor: '教务处',
    chapters: [
      {
        id: 'ntm-1',
        type: 'chapter',
        title: '教学理念与课堂基础',
        sections: [
          {
            id: 'ntm-1-1',
            type: 'section',
            title: '以学生为中心与互动教学',
            videos: [
              {
                id: 'ntm-1-1-1',
                type: 'video',
                title: '以学生为中心的课堂组织',
                url: 'https://example.com/ntm-student-centered',
                duration: 900,
                progress: 30,
                instructor: '教务处'
              },
              {
                id: 'ntm-1-1-2',
                type: 'video',
                title: '互动教学的常用技巧',
                url: 'https://example.com/ntm-interactive-teaching',
                duration: 1000,
                progress: 0,
                instructor: '教务处'
              }
            ]
          },
          {
            id: 'ntm-1-2',
            type: 'section',
            title: '课堂管理与规则建立',
            videos: [
              {
                id: 'ntm-1-2-1',
                type: 'video',
                title: '高效课堂管理的策略',
                url: 'https://example.com/ntm-classroom-management',
                duration: 800,
                progress: 60,
                instructor: '教务处'
              }
            ]
          }
        ]
      },
      {
        id: 'ntm-2',
        type: 'chapter',
        title: '备课与教学设计',
        sections: [
          {
            id: 'ntm-2-1',
            type: 'section',
            title: '目标-活动-评价对齐',
            videos: [
              {
                id: 'ntm-2-1-1',
                type: 'video',
                title: '如何实现教学三对齐',
                url: 'https://example.com/ntm-alignment',
                duration: 1100,
                progress: 20,
                instructor: '教务处'
              }
            ]
          },
          {
            id: 'ntm-2-2',
            type: 'section',
            title: '教学案例与作业设计',
            videos: [
              {
                id: 'ntm-2-2-1',
                type: 'video',
                title: '优质教学案例解析',
                url: 'https://example.com/ntm-case-study',
                duration: 900,
                progress: 0,
                instructor: '教务处'
              },
              {
                id: 'ntm-2-2-2',
                type: 'video',
                title: '有效作业与反馈设计',
                url: 'https://example.com/ntm-homework-feedback',
                duration: 950,
                progress: 0,
                instructor: '教务处'
              }
            ]
          }
        ]
      },
      {
        id: 'ntm-3',
        type: 'chapter',
        title: '评价与教学反思',
        sections: [
          {
            id: 'ntm-3-1',
            type: 'section',
            title: '形成性评价与学习证据',
            videos: [
              {
                id: 'ntm-3-1-1',
                type: 'video',
                title: '如何设计形成性评价',
                url: 'https://example.com/ntm-formative-assessment',
                duration: 1000,
                progress: 10,
                instructor: '教务处'
              }
            ]
          },
          {
            id: 'ntm-3-2',
            type: 'section',
            title: '教学反思与改进',
            videos: [
              {
                id: 'ntm-3-2-1',
                type: 'video',
                title: '反思日志与同行互评',
                url: 'https://example.com/ntm-reflection-peer-review',
                duration: 800,
                progress: 0,
                instructor: '教务处'
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