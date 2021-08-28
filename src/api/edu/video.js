import request from '@/utils/request'

export default{
    addVideo(video){
        return request({
            url: `/eduservice/edu-video/addVideo`,
            method: 'post',
            data:video
        })
    },
    updateVideo(video){
        return request({
            url: `/eduservice/edu-video/updateVideo`,
            method: 'post',
            data:video
        })
    },
    removeVideoById(videoId){
        return request({
            url: `/eduservice/edu-video/removeVideoById/${videoId}`,
            method: 'delete'
          })
    },
    getVideoInfoById(videoId){
        return request({
            url: `/eduservice/edu-video/getVideoInfoById/${videoId}`,
            method: 'get'
          })
    },
}