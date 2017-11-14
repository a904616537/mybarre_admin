<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getOrder">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<!-- <el-button type="primary" v-on:click="createProduct">Create Product</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="orders" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column type="expand" label="Products">
					<template scope="props">
						<el-form v-for="(item, index) in props.row.order_item" :key="index" label-position="left" inline class="demo-table-expand">
							<el-form-item label="Product Name:">
								<span>{{ item.product.name }}</span>
							</el-form-item>
							<el-form-item label="Quantity:">
								<span>{{ item.number }}</span>
							</el-form-item>
							<el-form-item label="Unit Price: ">
								<span>{{ item.product.price }}</span>
							</el-form-item>
							<el-form-item label="Subtotal: ">
								<span>{{ item.total }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="_id" label="Order_Id" width="180" sortable></el-table-column>
				<el-table-column label="Address">
					 <template scope="scope">
						<el-popover trigger="hover" placement="top">
						<p>Recipients: {{ scope.row.address?scope.row.address.recipients:'' }}</p>
						<p>Phone: {{ scope.row.address?scope.row.address.phone:'' }}</p>
						<p>Email: {{ scope.row.address?scope.row.address.email:'' }}</p>
						<p>Delivery: {{ scope.row.address?scope.row.address.type:'' }}</p>
						<p>Address: {{ scope.row.address?scope.row.address.address:'' }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{scope.row.address?scope.row.address.recipients:''}}</el-tag>
						</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="User">
					 <template scope="scope">
						<el-popover trigger="hover" placement="top">
						<p>Name: {{ scope.row.user?scope.row.user.first_name+' '+scope.row.user.last_name:'' }}</p>
						<p>Phone: {{ scope.row.user?scope.row.user.phone:'' }}</p>
						<p>Email: {{ scope.row.user?scope.row.user.email:'' }}</p>
						<p>Level: {{ scope.row.user?getLevel(scope.row.user.level):'' }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{scope.row.user?scope.row.user.first_name+scope.row.user.last_name:''}}</el-tag>
						</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="address.type" label="Delivery" width="200" sortable></el-table-column>
				<el-table-column prop="total" label="Purchase Total" width="120" sortable>
					<template scope="scope">
						<p>¥ {{scope.row.total}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="CreateTime" label="Time" width="120" sortable>
					<template scope="scope">
						<p>{{moment(scope.row.CreateTime)}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="Status" width="100" sortable>
					<template scope="scope">
						<el-button v-if="scope.row.status" type="success" size="small" @click="editOrder(scope.row._id, false)">Complete</el-button>
						<el-button v-else type="warning" size="small" @click="editOrder(scope.row._id, true)">Pending</el-button>
						
					</template>
					
				</el-table-column>

				<!-- <el-table-column label="Action" width="150">
					<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onEditor(scope.$index, scope.row)">Editor</el-button>
						<el-button type="danger" style="margin: 3px auto;" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
					</template>
				</el-table-column> -->
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
				form : {
					name  : '',
					price : 0,
					order : 10,
				},
				uploadUrl      : Vue.config.uploadUrl,
				loading        : false,
				total          : 0,
				addFormVisible : false,
				addLoading     : false,
				filters        : {},
				fileList       : [],
				orders       : [],
				orders         : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			}
		},
		methods: {
			moment(date) {
				return moment(date).format('YYYY-MM-DD, h:mm:ss');
			},
			getOrder() {
				let para = {
					page: this.page
				};
				this.loading = true;
				fetch(Vue.config.apiUrl + '/order',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	console.log('order result', result)
					return new Promise((resolve, reject) => {
						this.orders = result.data;
						this.loading  = false;
					}, 5000);
			      })
			      .catch(err => {console.log('获取订单出错')});
			},
			getLevel(level) {
				switch(level) {
					case 0:
						return 'Pre Course Instructor';
					case 1:
					return 'Instructor in Training';
					case 2:
					return 'MBI (MYbarre Instructor)';
					case 3:
					return 'MBI Elite / MBI Master';
				}

			},
			editOrder(_id, status) {
				this.addLoading = true;
				const body = querystring.stringify({_id, status});
				fetch(Vue.config.apiUrl + '/order',{
			        method : 'put',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					this.addLoading = false;
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getOrder();
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
			handleRemove(file, fileList) {
				this.fileList = fileList;
			}
		},
		mounted() {
			this.getOrder();
		}
	};

</script>

<style scoped>
</style>

