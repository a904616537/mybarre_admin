<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button @click="getUsers">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">Create User</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="first_name" label="First Name" width="130" sortable/>
			<el-table-column prop="last_name" label="Last Name" width="130" sortable/>
			
			<el-table-column prop="email" label="Email" width="120" sortable />
			<el-table-column prop="phone" label="Mobile" min-width="150" sortable />

			
			<el-table-column prop="is_payment" label="Course Fee" sortable>
				<template scope ="scope">
					<el-button v-if="scope.row.is_payment" type="success" size="small" @click="onUpdatePayment(scope.row._id, false)">Paid</el-button>
					<el-button v-else type="danger" size="small" @click="onUpdatePayment(scope.row._id, true)">Not Paid</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="level" label="Member Status" min-width="180" sortable>
				<template scope ="scope">
					<el-select
					v-model="scope.row.level"
					placeholder="Please select a"
					@change="onSeletct(scope.row._id, 'level', scope.row.level)">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			
			<el-table-column label="Action" width="300">
				<template scope="scope">
					<el-button type="info" size="small" @click="onShowVideo(scope.row)">Downloads</el-button>
					<el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">Details</el-button>
					<el-button type="success" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Approve</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="Editor" v-model="editFormVisible" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Personal Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Name:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.first_name + ' ' + editForm.last_name}}</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Email:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.email}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Address:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.address}}</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Date Of Birth: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.birth}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Nationality:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.nationality}}</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Occupation:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.occupation}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Phone Number:</p></div></el-col>
					<el-col :span="20"><div class="grid-content bg-purple"><p>{{editForm.phone}}</p></div></el-col>
				</el-row>
			</el-card>

			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Studio Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Name: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.studio_name}}</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Address: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.studio_address}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Manager Name: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.manager}}</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Phone Number: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.studio_phone}}</p></div></el-col>
				</el-row>
			</el-card>

			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Background and Motivation</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>How did you find out about the MYbarre Instructor Training Course?</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>{{editForm.motivation1}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Please elaborate on your motivation for joining the training?</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>{{editForm.motivation2}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Please list your exercised fitness disciplines, certification level and years of experience</h3></div></el-col>
				</el-row>
				<el-row>
					<el-table
					:data="editForm.experience"
					style="width: 100%">
						<el-table-column
						prop="discipline"
						label="Discipline"
						width="180">
						</el-table-column>
						<el-table-column
						prop="level"
						label="Certification / Level"
						width="180">
						</el-table-column>
						<el-table-column
						prop="years"
						label="Years of experience">
						</el-table-column>
					</el-table>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Do you have any prior MYbarre, bellet or pilates experience?</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>{{editForm.bellet}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Is there anything else you would like to share with us about yourself or fitness / dance experience</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>{{editForm.share_experience}}</p></div></el-col>
				</el-row>
			</el-card>

			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Practical Information</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>VPN: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.isvpn}}</p></div></el-col>

					<el-col :span="4"><div class="grid-content bg-purple"><p>QQ: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.QQ}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Downloading your music: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.music}}</p></div></el-col>
				</el-row>
			</el-card>
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Medical Information</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Heart condition: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.heart_condition}}</p></div></el-col>

					<el-col :span="4"><div class="grid-content bg-purple"><p>Workout: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.workout}}</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>High blood: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>{{editForm.high_blood}}</p></div></el-col>
				</el-row>
			</el-card>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Close</el-button>
				<el-button type="primary" :disabled="editForm.audit" @click.native="editSubmit(editForm._id)" :loading="editLoading">Approve</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="Create User" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="First Name" prop="first_name">
					<el-input v-model="addForm.first_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Last Name" prop="last_name">
					<el-input v-model="addForm.last_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop  = "Email" label = "Email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item prop="Birthdate" label="Birth">
					<el-input v-model="addForm.birth" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="Mobile" label="Phone Number">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item prop="Nationality" label="Nationality">
					<el-input v-model="addForm.nationality"></el-input>
				</el-form-item>
				<el-form-item prop="Occupation" label="Occupation">
					<el-input v-model="addForm.occupation"></el-input>
				</el-form-item>
				<el-form-item prop="Address" label="Address">
					<el-input v-model="addForm.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!--下载界面-->
		<el-dialog title="Video List" v-model="downloadVisible" :close-on-click-modal="false">
			<el-row v-for="(item, index) in videos" :key="index">
				<el-col :span="8">
					<div class="grid-content">
						<img :src="item.img" style="height: 85px;">
					</div>
				</el-col>
				<el-col :span="14">
					<div class="grid-content">{{item.name}}</div>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="downloadVisible = false">Colse</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import Vue from 'vue';
	import util from '../../common/js/util'
	import querystring from 'querystring';
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters     : {},
				users       : [],
				videos      : [],
				total       : 0,
				page        : 1,
				sels        : [],//列表选中列
				listLoading : false,
				editForm    : {},
				editFormVisible : false,//编辑界面是否显示
				editLoading     : false,
				downloadVisible : false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					first_name: [
						{ required: true, message: 'Please enter your name', trigger: 'blur' },
					],
					last_name: [
						{ required: true, message: 'Please enter your name', trigger: 'blur' },
					],
					email : [
						{ required : true, message: 'Please enter your email address', trigger: 'blur' },
						{ type : 'email', message: 'Please enter your email address', trigger: 'blur,change' }
					],
					phone : [
						{ required : true, message: 'Please enter your mobile nnumber', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
				},
				options : [{
					value: 0,
					label: 'Pre Course Instructor'
				},{
					value: 1,
					label: 'Instructor in Training'
				},{
					value: 2,
					label: 'MBI (MYbarre Instructor)'
				},{
					value: 3,
					label: 'MBI Elite'
				},{
					value: 3,
					label: 'MBI Master'
				}]
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page
				};
				this.listLoading = true;
				fetch(Vue.config.apiUrl + '/user',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						console.log('result user', result)
						this.total       = result.total;
						this.users       = result.data;
						this.listLoading = false;
					}, 1000);
			      })
			      .catch(err => {});
			},
			onShowVideo(row) {
				this.videos = row.videos;
				this.downloadVisible = true;
			},
			//批准
			handleDel: function (index, row) {
				this.listLoading = true;

				const body = querystring.stringify({_id:row._id ,audit:true});

				fetch(Vue.config.apiUrl + '/user/audit',{
			        method : 'post',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body
			      })
			      .then(response => response.json())
			      .then(result => {
			      	setTimeout(() => {
			      		this.$message({
							message : 'Submitted successfully, the email has been sent.',
							type    : 'success'
						});
						this.editFormVisible = false;
						this.getUsers();
			      	}, 1000);
			      })
			      .catch(err => {});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
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
			//编辑
			editSubmit: function (_id) {

				this.listLoading = true;

				const body = querystring.stringify({_id ,audit:true});

				fetch(Vue.config.apiUrl + '/user/audit',{
			        method : 'post',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body
			      })
			      .then(response => response.json())
			      .then(result => {

			      	setTimeout(() => {
			      		if(result.status) {
			      			this.$message({
								message : 'Submitted successfully, the email has been sent.',
								type    : 'success'
							});
							this.editFormVisible = false;
							this.getUsers();
			      		} else {

			      		}
			      		
			      	}, 1000);
			      })
			      .catch(err => {});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							const body = querystring.stringify(para);
							fetch(Vue.config.apiUrl + '/register',{
						        method : 'post',
						        headers : {
						          'Content-Type' : 'application/x-www-form-urlencoded'
						        },
						        body
						      })
						      .then(response => response.json())
						      .then(result => {
						      	setTimeout(() => {
						      		if(result.status) {
						      			this.$message({
											message : 'Submitted successfully.',
											type    : 'success'
										});
										this.addLoading = false;
										this.addFormVisible = false;
										this.$refs['addForm'].resetFields();
										this.getUsers();
						      		} else {
						      			this.$message({
											message : 'Mobile phone/email has been registered.',
											type    : 'error'
										});
										this.addLoading = false;
						      		}
						      	}, 1000);
						      })
						      .catch(err => {
						      	this.$message({
										message : 'Commit failure, network error!',
										type    : 'error'
									});
						      });
					}
				});
			},
			onSeletct(_id, key, value) {
				let body = querystring.stringify({_id, level : value});
				fetch(Vue.config.apiUrl + '/user/level/' + _id,{
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
						this.getUsers();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
				})
				.catch(err => {});
			},
			onUpdatePayment(_id, is_payment) {
				let body = querystring.stringify({_id, is_payment});
				fetch(Vue.config.apiUrl + '/user/payment',{
						method         : 'post',
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
						this.getUsers();
					} else {
						this.$message({
							type    : 'error',
							message : 'Failure'
						});
					}
				})
				.catch(err => {});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>