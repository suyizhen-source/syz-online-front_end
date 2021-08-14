import request from '@/utils/request'

export default{
    getNestedTreeList(courseId){
        return request({
            url: `/eduservice/edu-chapter/${courseId}`,
            method: 'get'
          })
    }
}