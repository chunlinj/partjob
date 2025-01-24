/**
 * Notes: 用户管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2022-01-22  07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');

const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const UserModel = require('../../model/user_model.js');
const AdminHomeService = require('./admin_home_service.js');

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = 'EXPORT_USER_DATA';

class AdminUserService extends BaseProjectAdminService {


	/** 获得某个用户信息 */
	async getUser({
		userId,
		fields = '*'
	}) {
		let where = {
			USER_MINI_OPENID: userId,
		}
		return await UserModel.getOne(where, fields);
	}

	/** 取得用户分页列表 */
	async getUserList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_ADD_TIME: 'desc'
		};
		let fields = '*';


		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				USER_NAME: ['like', search]
			},
			{
				USER_MOBILE: ['like', search]
			},
			{
				USER_MEMO: ['like', search]
			},
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					where.and.USER_STATUS = Number(sortVal);
					break;
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'USER_ADD_TIME');
					break;
				}
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);


		// 为导出增加一个参数condition
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
	}

	// 修改用户状态
	async statusUser(id, status, reason) {
		try {
			let user = await UserModel.getOne(id);
			if (!user) {
				this.AppError('用户不存在');
				return;
			}

			let data = {
				USER_STATUS: status
			}
			
			if (status == UserModel.STATUS.UNCHECK) {
				if (!reason) this.AppError('请输入审核不通过理由');
				data.USER_CHECK_REASON = reason;
			} else {
				data.USER_CHECK_REASON = '';
			}

			await UserModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('修改失败，请重试');
		}
	}

	// 删除用户
	async delUser(id) {
		try {
			let user = await UserModel.getOne(id);
			if (!user) {
				this.AppError('用户不存在');
				return;
			}

			await UserModel.del(id);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('删除失败，请重试');
		}
	}

	// #####################导出用户数据

	/**获取用户数据 */
	async getUserDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_USER_DATA_KEY);
	}

	/**删除用户数据 */
	async deleteUserDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_USER_DATA_KEY);
	}

	/**导出用户数据 */
	async exportUserDataExcel(condition, fields) {
		try {
			let where = JSON.parse(decodeURIComponent(condition));

			// 取得数据
			let list = await UserModel.getAll(where, fields);

			// 数据格式化
			for (let k = 0; k < list.length; k++) {
				list[k].USER_STATUS_DESC = UserModel.getDesc('STATUS', list[k].USER_STATUS);
				list[k].USER_ADD_TIME = timeUtil.timestamp2Time(list[k].USER_ADD_TIME);
				list[k].USER_LOGIN_TIME = list[k].USER_LOGIN_TIME ? timeUtil.timestamp2Time(list[k].USER_LOGIN_TIME) : '未登录';

				// 生成行数据
				let row = {};
				for (let key in list[k]) {
					if (key.includes('USER_') && !key.includes('USER_MINI_OPENID')) {
						row[key.replace('USER_', '')] = list[k][key];
					}
				}
				list[k] = row;
			}

			// 生成Excel
			let filename = '用户数据' + timeUtil.time('YMD') + '.xlsx';
			await exportUtil.exportDataExcel(EXPORT_USER_DATA_KEY, filename, list);

			return {
				downloadUrl: await exportUtil.getExportDataURL(EXPORT_USER_DATA_KEY)
			};

		} catch (err) {
			console.error(err);
			this.AppError('导出失败，请重试');
		}
	}

}

module.exports = AdminUserService;