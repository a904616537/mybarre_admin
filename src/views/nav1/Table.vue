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
			
			<el-table-column prop="email" label="Email" min-width="150" sortable />
			
			<el-table-column prop="is_payment" label="Course Fee" sortable>
				<template scope ="scope">
					<el-button v-if="scope.row.is_payment" type="success" size="small" @click="onUpdatePayment(scope.row._id, false)">Paid</el-button>
					<el-button v-else type="danger" size="small" @click="onUpdatePayment(scope.row._id, true)">Not Paid</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="level" label="Member Status" min-width="180" :filters="level_filter" :filter-method="onLevelfilter">
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
		<!-- <el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->
		<el-dialog title="Editor" v-model="editFormVisible" :close-on-click-modal="false" :before-close="onClose">
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Personal Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Name:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input style="width : 100px;" v-model="editForm.first_name" @blur="onUpdate(editForm._id, 'first_name', editForm.first_name)" placeholder="noooo" size="mini"></el-input>
						<el-input style="width : 100px;" v-model="editForm.last_name" @blur="onUpdate(editForm._id, 'last_name', editForm.last_name)" placeholder="noooo" size="mini"></el-input></p>
					</div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Email:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.email" @blur="onUpdate(editForm._id, 'email', editForm.email)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Address:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.address" @blur="onUpdate(editForm._id, 'address', editForm.address)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Date Of Birth: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.birth" @blur="onUpdate(editForm._id, 'birth', editForm.birth)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Nationality:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.nationality" @blur="onUpdate(editForm._id, 'nationality', editForm.nationality)" placeholder="noooo" size="mini"></el-input>
						</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Occupation:</p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.occupation" @blur="onUpdate(editForm._id, 'occupation', editForm.occupation)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Phone Number:</p></div></el-col>
					<el-col :span="20"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.phone" @blur="onUpdate(editForm._id, 'phone', editForm.phone)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
			</el-card>

			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Studio Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Name: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.studio_name" @blur="onUpdate(editForm._id, 'studio_name', editForm.studio_name)" placeholder="noooo" size="mini"></el-input>
						</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Address: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.studio_address" @blur="onUpdate(editForm._id, 'studio_address', editForm.studio_address)" placeholder="noooo" size="mini"></el-input>
						</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Manager Name: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.manager" @blur="onUpdate(editForm._id, 'manager', editForm.manager)" placeholder="noooo" size="mini"></el-input>
						</p></div></el-col>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Studio Phone Number: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.studio_phone" @blur="onUpdate(editForm._id, 'studio_phone', editForm.studio_phone)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
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
					<el-col :span="24"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.motivation1" @blur="onUpdate(editForm._id, 'motivation1', editForm.motivation1)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Please elaborate on your motivation for joining the training?</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.motivation2" @blur="onUpdate(editForm._id, 'motivation2', editForm.motivation2)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
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
					<el-col :span="24"><div class="grid-content bg-purple"><p>
					<el-input v-model="editForm.bellet" @blur="onUpdate(editForm._id, 'bellet', editForm.bellet)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h3>Is there anything else you would like to share with us about yourself or fitness / dance experience</h3></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.share_experience" @blur="onUpdate(editForm._id, 'share_experience', editForm.share_experience)" placeholder="noooo" size="mini"></el-input></p></div></el-col>
				</el-row>
			</el-card>

			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Practical Information</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>VPN: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.isvpn" @blur="onUpdate(editForm._id, 'isvpn', editForm.isvpn)" placeholder="noooo" size="mini"></el-input></p></div></el-col>

					<el-col :span="4"><div class="grid-content bg-purple"><p>QQ: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.QQ" @blur="onUpdate(editForm._id, 'QQ', editForm.QQ)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Downloading your music: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
					<el-input v-model="editForm.music" @blur="onUpdate(editForm._id, 'music', editForm.music)" placeholder="noooo" size="mini"></el-input>
				</p></div></el-col>
				</el-row>
			</el-card>
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Medical Information</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Heart condition: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.heart_condition" @blur="onUpdate(editForm._id, 'heart_condition', editForm.heart_condition)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>

					<el-col :span="4"><div class="grid-content bg-purple"><p>Workout: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p>
						<el-input v-model="editForm.workout" @blur="onUpdate(editForm._id, 'workout', editForm.workout)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>High blood: </p></div></el-col>
					<el-col :span="8"><div class="grid-content bg-purple"><p><el-input v-model="editForm.high_blood" @blur="onUpdate(editForm._id, 'high_blood', editForm.high_blood)" placeholder="noooo" size="mini"></el-input>
					</p></div></el-col>
				</el-row>
			</el-card>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="onClose">Close</el-button>
				<el-button type="primary" :disabled="!editForm.audit" @click.native="editSubmit(editForm._id)" :loading="editLoading">Reset Password</el-button>
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
		<el-dialog title="Video Download History" v-model="downloadVisible" :close-on-click-modal="false">
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
				<el-button @click.native="downloadVisible = false">CLOSE</el-button>
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
				level_filter : [{
					value: 0,
					text: 'Pre Course Instructor'
				},{
					value: 1,
					text: 'Instructor in Training'
				},{
					value: 2,
					text: 'MBI (MYbarre Instructor)'
				},{
					value: 3,
					text: 'MBI Elite'
				},{
					value: 3,
					text: 'MBI Master'
				}],
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
			onClose() {
				this.editFormVisible = false;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;

				fetch(Vue.config.apiUrl + '/user?page='+this.page +'&per_page=1000',{
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
			onLevelfilter(val, row) {
				return row.level == val;
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
			onUpdate(_id, key, value) {
				let body = querystring.stringify({_id, key, value});
				fetch(Vue.config.apiUrl + '/user',{
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
					} else {
						this.$message({
							type    : 'error',
							message : result.err
						});
					}
				})
				.catch(err => {});
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
		beforeMount() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>