<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getPicture">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onCreate">Create Picture</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="pictures" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="Name" width="100" sortable/>
			<el-table-column prop="img" label="FrontCover" sortable>
				<template scope ="scope">
					<img :src="scope.row.img" style="height: 80px;" />
				</template>
			</el-table-column>

			<el-table-column prop="order" label="Order" width="100" sortable>
				<template scope ="scope">
					<el-select
					value-key="order"
					v-model="scope.row.order"
					placeholder="Please select a"
					@change="onSeletct(scope.row._id, 'order', scope.row.order)">
						<el-option
						v-for="item in [0, 1,2,3,4,5,6,7,8,9,10]"
						:key="item"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			
			<el-table-column label="Action" width="150">
				<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onSetImg(scope.$index, scope.row)">Set Front Cover</el-button>
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onSetPicture(scope.$index, scope.row)">Set Picture</el-button>
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
		<el-dialog title="Create User" v-model="addFormVisible" :close-on-click-modal="false">
			<el-upload
			ref="elupload"
			class     = "upload-demo"
			action    = "http://106.14.94.210:8082/upload"
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
				vide_id        : '',
				isPicture        : false,
				filters        : {},
				pictures         : [],
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
					label: 'public'
				},{
					value: 1,
					label: '第一阶段'
				},{
					value: 2,
					label: '第二阶段'
				},{
					value: 3,
					label: '第三阶段'
				},{
					value: 4,
					label: '第四阶段'
				}]
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getPicture();
			},
			onSetImg(index, row) {
				this.isPicture = false;
				this.vide_id = row._id;
				this.addFormVisible = true;
			},
			onSetPicture(index, row) {
				this.isPicture = true;
				this.vide_id = row._id;
				this.fileList = row.SmallPic.map(val => {
					return {
						name : val,
						url  : val
					}
				})
						
				this.addFormVisible = true;
			},
			handleRemove(file, fileList) {
				// console.log('file', fileList);
				this.fileList = fileList;
			},
			onSuccess(data, file) {
				if(this.isPicture) {
					this.fileList.push({
						name : file.name,
						url  : data.msg})
				} else {
					this.img = data.msg;
				}
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
				fetch(Vue.config.apiUrl + '/picture',{
						method         : 'put',
						headers        : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body
				})
				.then(response     => response.json())
				.then(result       => {
					console.log('result', result)
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						// this.getPicture();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
				})
				.catch(err => {});
			},
			getPicture() {
				let para = {
					page: this.page
				};
				this.listLoading = true;
				fetch(Vue.config.apiUrl + '/picture',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	setTimeout(() => {
						this.total       = result.total;
						this.pictures    = result.data;
						this.listLoading = false;
			      	}, 1000);
			      })
			      .catch(err => {});
			},
			handleDel: function (index, row) {
				let body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/picture',{
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
						this.getPicture();
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
				this.$prompt('Please enter picture name', 'Create Picture', {
					confirmButtonText : 'OK',
					cancelButtonText  : 'Cancel'
				}).then(({ value }) => {

					const body = querystring.stringify({name : value});
					fetch(Vue.config.apiUrl + '/picture',{
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
							this.getPicture();
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
				if(this.isPicture) {
					const files = this.fileList.map(val => val.url);
					body = querystring.stringify({_id : this.vide_id, value: files, key : 'SmallPic'});
				} else {
					body = querystring.stringify({_id : this.vide_id, value: this.img, key : 'img'});
				}
				fetch(Vue.config.apiUrl + '/picture',{
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
						this.getPicture();
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
			this.getPicture();
		}
	}

</script>

<style scoped>

</style>