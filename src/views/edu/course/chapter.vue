<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterNestedList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}

                <span class="acts">
                    
                    <el-button style="" type="text">编辑</el-button>
                    <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
     <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
export default {
    data(){
        return{
            courseId: '', // 所属课程
            chapterNestedList: [],// 章节嵌套课时列表
            saveBtnDisabled:false,
            chapter:{ //封装章节数据
                title: '',
                sort: 0
            },
            video: {
                title: '',
                sort: 0,
                free: 0,
                videoSourceId: ''
            },
            dialogChapterFormVisible:false,//章节弹框
            dialogVideoFormVisible:false //小节弹框
        }
        
    },
    created(){
      this.init()
    },
    methods:{
      init(){
        if(this.$route.params && this.$route.params.id){
          this.courseId = this.$route.params.id
          // 根据id获取课程基本信息
          this.fetchChapterNestedListByCourseId()
        }
      },
      fetchChapterNestedListByCourseId() {
         chapter.getNestedTreeList(this.courseId)
         .then(response => {
            this.chapterNestedList = response.data.items
     　　})
　　　　},
      previous(){
          //跳转到第一步
          this.$router.push({path:'/edu/course/info/'+this.courseId})
      },
      next(){
            //跳转到第三步
          this.$router.push({path:'/edu/course/publish/'+this.courseId})
      },
      //弹出添加章节页面
      openChapterDialog() {
          //弹框
          this.dialogChapterFormVisible = true
          //表单数据清空
          this.chapter.title = ''
          this.chapter.sort = 0
      },
      //修改章节弹框数据回显
      openEditChatper(chapterId){
          //弹框
          this.dialogChapterFormVisible = true
          chapter.getChapterInfoById(chapterId)
          .then(response =>{
            this.chapter=response.data.item
          })
      },
      //删除章节
      removeChapter(chapterId){
        this.$confirm('此操作将删除章节, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {  //点击确定，执行then方法
              //调用删除的方法
              chapter.removeChapterById(chapterId)
                  .then(response =>{//删除成功
                  //提示信息
                  this.$message({
                      type: 'success',
                      message: '删除成功!'
                  });
                  //刷新页面
                  this.init()
              })
          }) //点击取消，执行catch方法
      },
      saveOrUpdate(){
        if(!this.chapter.id){
          this.saveChapter()
        }else{
          this.updateChapter()
        }
      },
      //添加章节
      saveChapter(){
        this.chapter.courseId=this.courseId
          chapter.addChapter(this.chapter)
          .then(response =>{
            this.dialogChapterFormVisible=false
            this.$message({
                  type: 'success',
                  message: '添加课程信息成功!'
              });
            this.init()
          })
      },
      //修改章节
      updateChapter(){
        chapter.updateChapter(this.chapter)
          .then(response =>{
            this.dialogChapterFormVisible=false
            this.$message({
                  type: 'success',
                  message: '修改课程信息成功!'
              });
            this.init()
            this.chapter.id=''
          })
      }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>