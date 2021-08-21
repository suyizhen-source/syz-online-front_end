<template>
<div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>
  <el-form-item label="课程分类">
    <!-- 一级分类 -->
  <el-select
    v-model="courseInfo.subjectParentId"
    placeholder="请选择" @change="subjectLevelOneChanged">
    <el-option
      v-for="subject in subjectNestedList"
      :key="subject.id"
      :label="subject.title"
      :value="subject.id"/>
  </el-select>
  <!-- 二级分类 -->
 <el-select v-model="courseInfo.subjectId" 
    placeholder="请选择">
    <el-option
     v-for="subject in subSubjectList"
     :key="subject.value"
     :label="subject.title"
     :value="subject.id"/>
 </el-select>
  </el-form-item>
  <el-form-item label="课程讲师">
  <el-select
    v-model="courseInfo.teacherId"
    placeholder="请选择">
    <el-option
      v-for="teacher in teacherList"
      :key="teacher.id"
      :label="teacher.name"
      :value="teacher.id"/>
  </el-select>
  </el-form-item>
  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>
  <el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
  </el-form-item>
  <el-form-item label="课程封面">
  <el-upload
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :action="BASE_API+'/eduoss/upload'"
    class="avatar-uploader">
    <img :src="courseInfo.cover" width="150" height="150">
  </el-upload>
</el-form-item>
  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>
  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
    components: { Tinymce },
    data(){
        return{
            courseInfo:{
                title: '',
                subjectId: '',
                subjectParentId:'',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '/static/default.png',
                price: 0
            },
            courseId: '',
            teacherList:[],
            subjectNestedList:[],//一级分类列表
            subSubjectList:[],//二级分类列表
            BASE_API: process.env.BASE_API,
            saveBtnDisabled:false
        }
    },
    created(){
        //初始化课程分类
        this.getSubjectNestedList()
        //初始化所有讲师
        this.getTeacherList()
        // 数据回显
        if(this.$route.params && this.$route.params.id){
          this.courseId = this.$route.params.id
          this.getCourseInfo()
        }
    },
    watch: {  //监听
    //路由变化方式，路由发生变化，方法就会执行
    $route(to, from) { 
      this.courseInfo={
                title: '',
                subjectId: '',
                subjectParentId:'',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '/static/default.png',
                price: 0
            }
      this.courseId=''
      }
  },
    methods:{
         getCourseInfo(){
            // 根据id获取课程基本信息
            course.getCourseInfoFormById(this.courseId)
            .then(response => {
              this.courseInfo=response.data.courseInfoVo
              for(let i = 0; i < this.subjectNestedList.length; i++){
                 if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId){
                     this.subSubjectList = this.subjectNestedList[i].children
                 }
              }
            })
        },
        getTeacherList(){
            course.getTeacherList()
            .then(response =>{
                this.teacherList = response.data.items
            })
        },
        getSubjectNestedList(){
            subject.getAllSubject()
            .then(response =>{
               this.subjectNestedList = response.data.items
            })
        },
        subjectLevelOneChanged(value){
           for (let i = 0; i < this.subjectNestedList.length; i++) {
           if (this.subjectNestedList[i].id === value) {
               this.subSubjectList = this.subjectNestedList[i].children
               this.courseInfo.subjectId = ''
           }
          }
        },
        handleAvatarSuccess(res, file){
          this.courseInfo.cover = res.data.url
        },
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
           this.$message.error('上传头像图片大小不能超过 2MB!')
          }
           return isJPG && isLt2M
          },
        saveOrUpdate(){
            if(!this.courseId){
              this.addCourse()
            }else{
              this.updateCourse()
            }
        },
        addCourse(){
          course.addCourseInfo(this.courseInfo)
            .then(response =>{
                 this.$message({
                   type: 'success',
                   message: '添加课程信息成功!'
               });
               //跳转到第二步
               this.$router.push({path:'/edu/course/chapter/'+response.data.courseId})
            })
        },
        updateCourse(){
          course.updateCourseInfo(this.courseInfo)
          .then(response =>{
            //提示信息
            this.$message({
              type: 'success',
              message: '修改课程信息成功!'
            });
            //跳转到第二步
            this.$router.push({path:'/edu/course/chapter/'+this.courseId})
          })
        }
    }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>