<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getCourses">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onCreate">Create Choreographies</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="courses" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="Name"/>
			<!-- <el-table-column prop="img" label="FrontCover" sortable>
				<template scope ="scope">
					<img :src="scope.row.img" style="height: 80px;" />
				</template>
			</el-table-column> -->
			
			<el-table-column prop="order" label="Order" width="150" />
			<el-table-column label="Action">
				<template scope="scope">
					<el-button type="info" size="small" @click="onEdit(scope.$index, scope.row)">Edit</el-button>
					<!-- <el-button type="info" size="small" @click="onSetImg(scope.$index, scope.row)">Set Front Cover</el-button> -->
					<el-button type="danger" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<!--新增界面-->
		<el-dialog title="Edit Courses Details" v-model="addChoreographiesVisible" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Courses Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Name:</p></div></el-col>
					<el-col :span="8">
						<el-input v-model="form.name" placeholder="Please enter name"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Order:</p></div></el-col>
					<el-col :span="8">
						<el-select
						value-key="order"
						v-model="form.order"
						placeholder="Please select a">
							<el-option
							v-for="item in orders"
							:key="item"
							:label="item"
							:value="item">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
			</el-card>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addChoreographiesVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmitCourses" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>
		<el-dialog title="Create Choreographies" v-model="addFormVisible" :close-on-click-modal="false">
			<el-upload
			ref="elupload"
			class     = "upload-demo"
			list-type = "picture"
			:action   = "uploadUrl"
			:multiple = "false"
           :on-remove = "handleRemove"
           :file-list = "fileList"
           :on-success= "onSuccess">
				<el-button size="small" type="primary">click upload</el-button>
				<div slot="tip" class="el-upload__tip">Accepted file types: JPG, PNG, and MP4</div>
			</el-upload>
			<!-- <v-upload :maxNumberOfFiles="1" :showSuccess="showSuccess"></v-upload> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import Vue         from 'vue';
	import moment      from 'moment';
	import util        from '../../common/js/util'
	import Upload      from '../../components/Upload';
	import querystring from 'querystring';

	export default {
		data() {
			return {
				_id            : null,
				form           : {
					name     : '',
					order    : 10
				},
				courses_id     : '',
				filters        : {},
				courses        : [],
				total          : 0,
				page           : 1,
				listLoading    : false,
				sels           : [], //列表选中列
				fileList       : [],
				addFormVisible : false,
				addChoreographiesVisible : false,
				addLoading : false,
				addForm    : {},
				orders     : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				uploadUrl  : Vue.config.uploadUrl
			}
		},
		methods: {
			moment(date) {
				return moment(date).format('YYYY-MM-DD, h:mm:ss');
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCourses();
			},
			onSetImg(index, row) {
				this.courses_id = row._id;
				this.addFormVisible = true;
			},
			onEdit(index, row) {
				this._id = row._id;
				this.form = row;

				this.addChoreographiesVisible = true;
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			onSuccess(data, file) {
				this.img = data.msg;
			},
			onSeletct(_id, key, value) {
				let body = querystring.stringify({_id, value, key});
				fetch(Vue.config.apiUrl + '/courses',{
						method         : 'put',
						headers        : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body
				})
				.then(response     => response.json())
				.then(result       => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						// this.getVideo();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
				})
				.catch(err => {});
			},
			getCourses() {
				let para = {
					page: this.page
				};
				this.listLoading = true;
				console.log('Vue.config.apiUrl', Vue.config.apiUrl)
				fetch(Vue.config.apiUrl + '/courses?page='+this.page +'&per_page=20',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	setTimeout(() => {
						this.total       = result.total;
						this.courses     = result.data;
						this.listLoading = false;
			      	}, 1000);
			      })
			      .catch(err => {});
			},
			handleDel: function (index, row) {
				let body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/courses',{
			        method : 'delete',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body
			      })
			      .then(response => response.json())
			      .then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getCourses();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
			      })
			      .catch(err => {});
			},
			onCreate() {
				this._id = null;
				this.addChoreographiesVisible = true;
			},
			addSubmitCourses() {
				this.form.endTime = moment(this.form.endTime).format('LLLL');
				let body = querystring.stringify(this.form);
				let method = 'post';
				if(this._id) {
					method = 'put';
					this.form._id = this._id;
					body = querystring.stringify(this.form);
				}
				fetch(Vue.config.apiUrl + '/courses',{
			        method : method,
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body
			      })
			      .then(response => response.json())
			      .then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getCourses();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
			      })
			      .catch(err => {});
			      this.addChoreographiesVisible = false;
			},
			//新增
			addSubmit: function () {
				let body = querystring.stringify({_id : this.courses_id, value: this.img, key : 'img'});
				fetch(Vue.config.apiUrl + '/courses',{
			        method : 'put',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body
			      })
			      .then(response => response.json())
			      .then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getCourses();
						this.$refs.elupload.clearFiles();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
			      })
			      .catch(err => {});
			      this.addFormVisible = false;
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},

		components: {
			'v-upload' : Upload
		},
		mounted() {
			this.getCourses();
		}
	}

</script>

<style scoped>

</style>