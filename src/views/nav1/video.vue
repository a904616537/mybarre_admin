<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getVideo">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onCreate">Create Video</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="videos" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="Name" width="200" sortable>
				<template scope ="scope">
					<el-input v-model="scope.row.name" @blur="onSeletct(scope.row._id, 'name', scope.row.name)" placeholder="noooo" size="mini"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="img" label="FrontCover" sortable>
				<template scope ="scope">
					<img :src="scope.row.img" style="height: 80px;" />
				</template>
			</el-table-column>
			<el-table-column prop="path" label="Video Path" sortable />

			<el-table-column prop="order" label="Order" width="100" sortable>
				<template scope ="scope">
					<el-select
					value-key="order"
					v-model="scope.row.order"
					placeholder="Please select a"
					@change="onSeletct(scope.row._id, 'order', scope.row.order)">
						<el-option
						v-for="item in [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
						:key="item"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>

			<el-table-column prop="courses" label="courses" width="180" sortable>
				<template scope ="scope">
					<el-select
					value-key="courses"
					v-model="scope.row.courses"
					placeholder="Please select a"
					@change="onSeletctCouerses(scope.row._id, 'courses', scope.row.courses)">
						<el-option
						v-for="item in coursess"
						:key="item._id"
						:label="item.name"
						:value="item._id">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			
			<el-table-column prop="level" label="level" width="200" sortable>
				<template scope ="scope">
					<el-select
					value-key="level"
					v-model="scope.row.level"
					placeholder="Please select a"
					@change="onSeletctLevel(scope.row._id, 'level', scope.row.level)">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="Action" width="150">
				<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onSetImg(scope.$index, scope.row)">Set Front Cover</el-button>
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onSetVideo(scope.$index, scope.row)">Set Video</el-button>
						<el-button type="danger" style="margin: 3px auto;" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
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
		<el-dialog title="Create Video" v-model="addFormVisible" :close-on-click-modal="false">
			<el-upload
			ref="elupload"
			class     = "upload-demo"
			:action    = "uploadUrl"
			list-type = "picture"
			:multiple = "false"
			:on-remove = "handleRemove"
			:file-list = "fileList"
			:on-success= "onSuccess">
				<el-button size="small" type="primary">click upload</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png/mp4文件</div>
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
	import Vue from 'vue';
	import util from '../../common/js/util'
	import Upload from '../../components/Upload';
	import querystring from 'querystring';

	export default {
		data() {
			return {
				uploadUrl : Vue.config.uploadUrl,
				vide_id        : '',
				isVideo        : false,
				filters        : {},
				videos         : [],
				total          : 0,
				page           : 1,
				listLoading    : false,
				sels           : [], //列表选中列
				fileList       : [],
				addFormVisible : false,
				addLoading     : false,
				addForm        : {},
				coursess : [],
				options : [{
					value: 0,
					label: 'Public Availability'
				},{
					value: 1,
					label: 'Pre Course Instructor'
				},{
					value: 2,
					label: 'Instructor in Training'
				},{
					value: 3,
					label: 'MBI (MYbarre Instructor)'
				},{
					value: 4,
					label: 'MBI Elite'
				},{
					value: 4,
					label: 'MBI Master'
				}]
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getVideo();
			},
			onSetImg(index, row) {
				this.isVideo = false;
				this.vide_id = row._id;
				this.addFormVisible = true;
			},
			onSetVideo(index, row) {
				this.isVideo = true;
				this.vide_id = row._id;
				this.addFormVisible = true;
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			onSuccess(data, file) {
				this.img = data.msg;
			},
			onSeletctCouerses(_id, key, value) {
				this.onSeletct(_id, key, value);
			},
			onSeletctLevel(_id, key, value) {
				this.onSeletct(_id, key, value);
			},
			onSeletct(_id, key, value) {
				if(this.listLoading) return;
				let body = querystring.stringify({_id, value, key});
				fetch(Vue.config.apiUrl + '/video',{
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
			getVideo() {
				let para = {
					page: this.page
				};
				this.listLoading = true;
				fetch(Vue.config.apiUrl + '/video',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	setTimeout(() => {
			      		this.total       = result.total;
						this.videos       = result.data;
						this.listLoading = false;
			      	}, 1000);
			      })
			      .catch(err => {});
			},
			getCoures() {
				fetch(Vue.config.apiUrl + '/courses/list',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      		this.coursess = result.data;
			      })
			      .catch(err => {});
			},
			handleDel: function (index, row) {
				let body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/video',{
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
						this.getVideo();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
			      })
			      .catch(err => {});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					first_name  : '',
					last_name   : '',
					email       : '',
					birth       : '',
					address     : '',
					nationality : '',
					occupation  : ''
				};
			},
			onCreate() {
				this.$prompt('Please enter video name', 'Create Video', {
					confirmButtonText : 'OK',
					cancelButtonText  : 'Cancel'
				}).then(({ value }) => {

					const body = querystring.stringify({name : value, courses : this.coursess.length > 0? this.coursess[0]._id: ''});
					fetch(Vue.config.apiUrl + '/video',{
				        method : 'post',
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
							this.getVideo();
				      	} else {
				      		this.$message({
								type    : 'error',
								message : 'Submit failure'
							});
				      	}
				      })
				      .catch(err => {
				      	this.$message({
							type    : 'error',
							message : 'Submit failure'
						});
				      });
					
				}).catch(() => {
					this.$message({
						type    : 'info',
						message : 'Cancel'
					});
				});
			},
			//编辑
			editSubmit: function (_id) {
			},
			//新增
			addSubmit: function () {
				let body = '';
				if(this.isVideo) {
					body = querystring.stringify({_id : this.vide_id, value: this.img, key : 'path'});
				} else {
					body = querystring.stringify({_id : this.vide_id, value: this.img, key : 'img'});
				}
				fetch(Vue.config.apiUrl + '/video',{
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
						this.getVideo();
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
		created() {
			this.getVideo();
			this.getCoures();
		}
	}

</script>

<style scoped>

</style>