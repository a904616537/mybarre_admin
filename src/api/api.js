import Vue from 'vue';
import request from './request'


export const requestLogin = params => { return request.post(`/admin/login`, params).then(res => res.data)};

export const getUserList = params => { return request.get(`/user/list`, { params: params }); };

export const getUserListPage = params => { return request.get(`/user/listpage`, { params: params }); };

export const removeUser = params => { return request.get(`/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return request.get(`/user/batchremove`, { params: params }); };

export const editUser = params => { return request.get(`/user/edit`, { params: params }); };

export const addUser = params => { return request.get(`/user/add`, { params: params }); };	