import request from '@/utils/request'

export default{
    //分页查询讲师
    pageList(page,limit,teacherQuery){
        return request({
            url: `/eduservice/edu-teacher/${page}/${limit}`,
            method: 'post',
            data:teacherQuery
          })
    },
    deleteById(id){
        return request({
            url: `/eduservice/edu-teacher/delete/${id}`,
            method: 'delete'
          })
    },
    save(teacher){
        return request({
            url: `/eduservice/edu-teacher/save`,
            method: 'post',
            data:teacher
          })
    }
}
