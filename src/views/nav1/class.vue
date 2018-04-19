<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getCourses">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onCreate">Create Class</el-button>
				</el-form-item>
				<el-form-item>

					<el-button @click="onDownload">Download Excel</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="courses" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column type="expand" label="Products">
				<template scope="props">
					<el-table :data="props.row.data.sign_user" highlight-current-row v-loading="listLoading" style="width: 100%;">
						<el-table-column type="index" width="60">
						</el-table-column>
						<el-table-column prop="user.first_name" label="First Name" sortable/>
						<el-table-column prop="user.last_name" label="Last Name" width="200" sortable/>

						<el-table-column prop="user.phone" label="Phone"/>
						<el-table-column prop="user.email" label="Email"/>
						<el-table-column label="Payment">
							<template scope ="scope">
								<el-button v-if="scope.row.payment" type="success" size="small" @click="onUpdatePayment(props.row.data._id, scope.row._id, false)">Paid</el-button>
								<el-button v-else type="danger" size="small" @click="onUpdatePayment(props.row.data._id, scope.row._id, true)">Not Paid</el-button>
							</template>
						</el-table-column>
						<el-table-column label="Action">
							<template scope ="scope">
								<el-dropdown split-button type="primary" @command="onTransfer" size="small">
								Transfer
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item
									v-for="(item, key) in courses"
									:key="key"
									:command="item.data._id"
									:data-courses="props.row.data._id"
									:data-item="scope.row._id"
									v-if="item.data._id != props.row.data._id">{{item.data.name}}</el-dropdown-item>
								</el-dropdown-menu>
								</el-dropdown>
								<el-button type="danger" size="small" @click="onDelete(scope.$index, props.row.data, scope.row._id)">Delete</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="data.name" label="Name" width="200"/>
			<el-table-column prop="data.price" label="Price" width="100"/>
			<el-table-column prop="data.limit" label="Limit" width="100"/>
			<el-table-column prop="data.location" label="Location"/>
			<el-table-column prop="data.time" label="Date"/>
			<el-table-column prop="data.endTime" label="EndTime" width="120">
				<template scope="scope">
					<p>{{moment(scope.row.data.endTime)}}</p>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="img" label="FrontCover" sortable>
				<template scope ="scope">
					<img :src="scope.row.img" style="height: 80px;" />
				</template>
			</el-table-column> -->
			
			<el-table-column prop="data.order" label="Order" width="150" />
			<el-table-column label="Action">
				<template scope="scope">
					<el-button type="info" size="small" @click="onEdit(scope.$index, scope.row.data)">Edit</el-button>
					<!-- <el-button type="info" size="small" @click="onSetImg(scope.$index, scope.row)">Set Front Cover</el-button> -->
					<el-button type="danger" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row.data)">Delete</el-button>
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
		<el-dialog title="Edit Class Details" v-model="addChoreographiesVisible" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Class Details</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Name:</p></div></el-col>
					<el-col :span="8">
						<el-input v-model="form.name" placeholder="Please enter name"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Price:</p></div></el-col>
					<el-col :span="8">
						<el-input-number v-model="form.price" :min="0" label="Please enter price"></el-input-number>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Limit:</p></div></el-col>
					<el-col :span="8">
						<el-input-number v-model="form.limit" :min="0" label="Please enter limit"></el-input-number>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Location:</p></div></el-col>
					<el-col :span="8">
						<el-input v-model="form.location" placeholder="Please enter location"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Date:</p></div></el-col>
					<el-col :span="8">
						<el-input v-model="form.time" placeholder="Please enter Date"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>EndTime:</p></div></el-col>
					<el-col :span="8">
						<el-date-picker
						v-model 	= "form.endTime"
						type 		= "date"
						placeholder = "Please enter endtime">
						</el-date-picker>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4"><div class="grid-content bg-purple"><p>Level:</p></div></el-col>
					<el-col :span="8">
						<el-select
						value-key="level"
						v-model="form.level"
						placeholder="Please select a">
							<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
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
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Class Videos</h1></div></el-col>
			</el-row>
			<el-card class="box-card">
				<el-transfer
				v-model="form.courses"
      			:titles="['Source', 'Target']"
				:data="data"></el-transfer>
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
				_id    : null,
				data   : [],
				form   : {
					name     : '',
					price    : 0,
					limit    : 50,
					location : '',
					time     : '',
					level    : 4,
					endTime  : Date.now(),
					courses  : [],
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
				uploadUrl  : Vue.config.uploadUrl,
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
			onDelete(index, courses, item_id) {
				
				let body = querystring.stringify({courses : courses._id, item_id});
				fetch(Vue.config.apiUrl + '/class/apply',{
						method         : 'delete',
						headers        : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body
				})
				.then(response     => response.json())
				.then(result       => {
					console.log('result', result);
					courses.sign_user.splice(index, 1);
				})
				.catch(err => {});
			},
			onTransfer(transfer_id, event) {
				const courses = event.$attrs['data-courses'],
				item_id = event.$attrs['data-item'];

				console.log('transfer_id, courses, item_id', transfer_id, courses, item_id)

				let body = querystring.stringify({transfer_id, courses, item_id});
				fetch(Vue.config.apiUrl + '/class/apply/transfer',{
						method         : 'put',
						headers        : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body
				})
				.then(response     => response.json())
				.then(result       => {
					console.log('result', result);
					this.getCourses();
				})
				.catch(err => {});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			onSuccess(data, file) {
				this.img = data.msg;
			},
			onSeletct(_id, key, value) {
				let body = querystring.stringify({_id, value, key});
				fetch(Vue.config.apiUrl + '/class',{
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
			getForCourses() {
				fetch(Vue.config.apiUrl + '/courses?page='+this.page +'&per_page=1000',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			    })
			    .then(response => response.json())
			    .then(result => {
			      	for(let item of result.data) {
			      		this.data.push({
							key   : item._id,
							label : `${ item.name }`
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
				fetch(Vue.config.apiUrl + '/class?page='+this.page +'&per_page=20',{
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
			onDownload() {
				fetch(Vue.config.apiUrl + '/class/download',{
				method  : 'get',
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
				.then(response => response.json())
				.then(result => {
					self.location=Vue.config.apiUrl + '/upload/Choreographies.xlsx';
				})
				.catch(err => {
					console.log('err', err)
				});
			},
			handleDel: function (index, row) {
				let body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/class',{
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
				console.log('body', body)
				fetch(Vue.config.apiUrl + '/class',{
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
				fetch(Vue.config.apiUrl + '/class',{
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
			onUpdatePayment(courses_id, item_id, status) {
				let body = querystring.stringify({courses : courses_id, item_id: item_id});
				fetch(Vue.config.apiUrl + '/class/apply',{
					method  : 'put',
					headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
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
			selsChange: function (sels) {
				this.sels = sels;
			},
		},

		components: {
			'v-upload' : Upload
		},
		mounted() {
			this.getCourses();
			this.getForCourses();
		}
	}

</script>

<style scoped>

</style>