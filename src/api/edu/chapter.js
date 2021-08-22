import request from '@/utils/request'

export default{
    getNestedTreeList(courseId){
        return request({
            url: `/eduservice/edu-chapter/${courseId}`,
            method: 'get'
          })
    },
    addChapter(chapter){
        return request({
            url: `/eduservice/edu-chapter/addChapter`,
            method: 'post',
            data:chapter
          })
    },
    getChapterInfoById(chapterId){
        return request({
            url: `/eduservice/edu-chapter/getChapterInfoById/${chapterId}`,
            method: 'get'
          })
    },
    updateChapter(chapter){
        return request({
            url: `/eduservice/edu-chapter/updateChapter`,
            method: 'post',
            data:chapter
          })
    },
    removeChapterById(chapterId){
        return request({
            url: `/eduservice/edu-chapter/removeChapterById/${chapterId}`,
            method: 'delete'
          })
    }
}