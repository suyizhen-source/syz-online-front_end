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
    //根据ID删除讲师
    deleteById(id){
        return request({
            url: `/eduservice/edu-teacher/delete/${id}`,
            method: 'delete'
          })
    },
    //新增讲师
    save(teacher){
        return request({
            url: `/eduservice/edu-teacher/save`,
            method: 'post',
            data:teacher
          })
    },
    //根据ID获取讲师
    findById(id){
        return request({
            url: `/eduservice/edu-teacher/findById/${id}`,
            method: 'get'
          })
    },
    //根据ID修改讲师
    updateById(teacher){
        return request({
            url: `/eduservice/edu-teacher/update`,
            method: 'post',
            data:teacher
          })
    }
}
