<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getStudio">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<!-- <el-button type="primary" v-on:click="createProduct">Create Product</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="studios" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column type="expand" label="Products">
					<template scope="props">
						<el-form  label-position="left" inline class="demo-table-expand">
							<el-row :gutter="20">
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Name:"><span>{{ props.row?props.row.name:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Email:"><span>{{ props.row?props.row.email:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="WechatId:"><span>{{ props.row?props.row.wechat:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Telephone:"><span>{{ props.row?props.row.phone:'' }}</span></el-form-item>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Studio Name:"><span>{{ props.row?props.row.studio_name:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Location:"><span>{{ props.row?props.row.location:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="grid-content bg-purple">
										<el-form-item label="Studio Address:"><span>{{ props.row?props.row.address:'' }}</span></el-form-item>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Studio Telephone:"><span>{{ props.row?props.row.studio_phone:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="grid-content bg-purple">
										<el-form-item label="Studio Website:"><span>{{ props.row?props.row.website:'' }}</span></el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="grid-content bg-purple">
										<el-form-item label="Dates Interested:"><span>{{ props.row?props.row.interested:'' }}</span></el-form-item>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="Name" width="180" sortable></el-table-column>
				<el-table-column prop="wechat" label="Wechat ID"></el-table-column>
				<el-table-column prop="email" label="Email"></el-table-column>
				<el-table-column prop="phone" label="Telephone" width="200" sortable></el-table-column>
				<el-table-column prop="CreateTime" label="Time" width="120" sortable>
					<template scope="scope">
						<p>{{moment(scope.row.createTime)}}</p>
					</template>
				</el-table-column>

				<el-table-column label="Action" width="150">
					<template scope="scope">
						<!-- <el-button type="info" style="margin: 3px auto;" size="small" @click="onEditor(scope.$index, scope.row)">Editor</el-button> -->
						<el-button type="danger" style="margin: 3px auto;" size="small" @click="deleteStudio(scope.row._id)">Delete</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	import Vue         from 'vue';
	import moment      from 'moment';
	import querystring from 'querystring';

	export default {
		data() {
			return {
				_id : null,
				loading        : false,
				filters        : {},
				studios         : []
			}
		},
		methods: {
			moment(date) {
				return moment(date).format('YYYY-MM-DD, h:mm:ss');
			},
			getStudio() {
				let para = {
					page: this.page
				};
				this.loading = true;
				fetch(Vue.config.apiUrl + '/studio',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	console.log('studio result', result)
					return new Promise((resolve, reject) => {
						this.studios = result.data;
						this.loading  = false;
					}, 5000);
			      })
			      .catch(err => {console.log('获取订单出错')});
			},
			editOrder(_id, key, value) {
				const body = querystring.stringify({_id, key, value});
				fetch(Vue.config.apiUrl + '/studio',{
			        method : 'put',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getStudio();
					} else this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
				.catch(err => {
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
			},
			deleteStudio(_id) {
				const body = querystring.stringify({_id});
				fetch(Vue.config.apiUrl + '/studio',{
			        method : 'delete',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getStudio();
					} else this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
				.catch(err => {
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
			}
		},
		mounted() {
			this.getStudio();
		}
	};

</script>

<style scoped>
</style>

