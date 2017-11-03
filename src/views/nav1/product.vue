<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<!-- <el-input v-model="filters.name" placeholder="姓名"></el-input> -->
					<el-button @click="getProduct">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="createProduct">Create Product</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="products" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="Name" width="120" sortable>

				</el-table-column>
				<el-table-column prop="img" label="Photo"  sortable>
					<template scope ="scope">
						<div class="imgdiv" v-for="(item, index) in scope.row.img" :key="index" @click="onDefImg(scope.row._id, item._id)">
							<label v-if="item.def" class="defimg"><i class="el-icon-upload-success el-icon-check"></i></label>
							<img :src="item.path" style="height: 80px;margin: 5px;" />
						</div>
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
							v-for="item in orders"
							:key="item"
							:label="item"
							:value="item">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="Action" width="150">
					<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onEditor(scope.$index, scope.row)">Editor</el-button>
						<el-button type="danger" style="margin: 3px auto;" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--新增界面-->
			<el-dialog title="Create User" v-model="addFormVisible" :close-on-click-modal="false">
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h1>Product Details</h1></div></el-col>
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
					<el-col :span="24"><div class="grid-content bg-purple"><h1>Product Images</h1></div></el-col>
				</el-row>
				<el-card>
					<el-row>
						<el-upload
						ref       = "elupload"
						class     = "upload-demo"
						list-type = "picture-card"

						:action    = "uploadUrl"
						:multiple  = "false"
						:on-remove = "handleRemove"
						:file-list = "fileList"
						:on-success= "onSuccess">
							<el-button size="small" type="primary">click upload</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png/mp4文件</div>
						</el-upload>
					</el-row>
				</el-card>
				
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">Cancel</el-button>
					<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
				</div>
			</el-dialog>

		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	import Vue from 'vue';
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
				products       : [],
				orders         : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			}
		},
		methods: {
			onDefImg(_id, img_id) {
				const body = querystring.stringify({_id, img_id});
				fetch(Vue.config.apiUrl + '/product/image',{
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
						this.getProduct();
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
			onSeletct(_id, key, value) {
				if(this.loading) return;
				let body = querystring.stringify({_id, value, key});
				fetch(Vue.config.apiUrl + '/product',{
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
			getProduct() {
				let para = {
					page: this.page
				};
				this.loading = true;
				fetch(Vue.config.apiUrl + '/product',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						this.total    = result.total;
						this.products = result.data;
						this.loading  = false;
					}, 5000);
			      })
			      .catch(err => {console.log('获取商品出错')});
			},
			editProduct(obj, method) {
				this.addLoading = true;
				const body = querystring.stringify({...obj});
				fetch(Vue.config.apiUrl + '/product',{
			        method : method,
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
						this._id = null;
						this.addFormVisible = false;
						this.getProduct();
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
			addSubmit() {
				let method = 'post';
				if(this._id) {
					this.form._id = this._id;
					method = 'put';
				};
				this.form.img = JSON.stringify(this.fileList.map((val, index) => {
					if(index == 0) { return {path : val.url, def : true}}
					else { return {path : val.url}}
				}));
				this.editProduct(this.form, method)
			},
			onEditor(index, row) {
				this._id = row._id;
				this.form = row;
				this.fileList = row.img.map(val => {
					return {name : 'img', url : val.path}
				});
				this.addFormVisible = true;
			},
			handleDel(index, row) {
				this.loading = true;
				const body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/product',{
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
						this.getProduct();
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
			},
			onSuccess(data, file) {
				this.fileList.push({
					name : file.name,
					url  : data.msg
				})
			},
			createProduct() {
				this.addFormVisible = true;
			}
		},
		mounted() {
			this.getProduct();
		}
	};

</script>

<style scoped>
.imgdiv{
	display  : inline-block;
	position : relative;
	overflow : hidden;
}
.defimg {
	position      : absolute;
	right         : -15px;
	top           : -6px;
	width         : 40px;
	height        : 24px;
	background    : #13ce66;
	text-align    : center;
	-ms-transform : rotate(45deg);
	transform     : rotate(45deg);
	box-shadow    : 0 0 1pc 1px rgba(0,0,0,.2);
}
.defimg i {
	color         : #fff;
	font-size     : 11px;
	margin-top    : 11px;
	-ms-transform : rotate(-45deg) scale(.8);
	transform     : rotate(-45deg) scale(.8);
}
</style>

