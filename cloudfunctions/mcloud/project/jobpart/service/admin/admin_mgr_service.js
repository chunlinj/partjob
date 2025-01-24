/**
 * Notes: 管理员管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const AdminModel = require('../../../../framework/platform/model/admin_model.js');
const LogModel = require('../../../../framework/platform/model/log_model.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

class AdminMgrService extends BaseProjectAdminService {

	//**管理员登录  */
	async adminLogin(name, password) {

		// 判断是否存在
		let where = {
			ADMIN_STATUS: 1,
			ADMIN_NAME: name,
			ADMIN_PASSWORD: md5Lib.md5(password)
		}
		let fields = 'ADMIN_ID,ADMIN_NAME,ADMIN_DESC,ADMIN_TYPE,ADMIN_LOGIN_TIME,ADMIN_LOGIN_CNT';
		let admin = await AdminModel.getOne(where, fields);
		if (!admin)
			this.AppError('管理员不存在或者已停用');

		let cnt = admin.ADMIN_LOGIN_CNT;

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: tokenTime,
			ADMIN_LOGIN_TIME: timeUtil.time(),
			ADMIN_LOGIN_CNT: cnt + 1
		}
		await AdminModel.edit(where, data);

		let type = admin.ADMIN_TYPE;
		let last = (!admin.ADMIN_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(admin.ADMIN_LOGIN_TIME);

		// 写日志
		this.insertLog('登录了系统', admin, LogModel.TYPE.SYS);

		return {
			token,
			name: admin.ADMIN_NAME,
			type,
			last,
			cnt
		}

	}

	// 清除日志
	async clearLog() {
		try {
			await LogModel.clear();
			return {
				cleared: true
			};
		} catch (err) {
			console.error(err);
			this.AppError('日志清理失败，请重试');
		}
	}

	/** 取得日志分页列表 */
	async getLogList({
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
			LOG_ADD_TIME: 'desc'
		};
		let fields = '*';
		let where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
				LOG_CONTENT: ['like', search]
			}, {
				LOG_ADMIN_DESC: ['like', search]
			}, {
				LOG_ADMIN_NAME: ['like', search]
			}];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type':
					// 按类型
					where.LOG_TYPE = Number(sortVal);
					break;
			}
		}
		let result = await LogModel.getList(where, fields, orderBy, page, size, true, oldTotal);


		return result;
	}

	/** 获取所有管理员 */
	async getMgrList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = {
			ADMIN_ADD_TIME: 'desc'
		}
		let fields = 'ADMIN_NAME,ADMIN_STATUS,ADMIN_PHONE,ADMIN_TYPE,ADMIN_LOGIN_CNT,ADMIN_LOGIN_TIME,ADMIN_DESC,ADMIN_EDIT_TIME,ADMIN_EDIT_IP';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		if (util.isDefined(search) && search) {
			where.or = [{
				ADMIN_NAME: ['like', search]
			},
			{
				ADMIN_PHONE: ['like', search]
			},
			{
				ADMIN_DESC: ['like', search]
			}
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.and.ADMIN_STATUS = Number(sortVal);
					break;
				case 'type':
					// 按类型
					where.and.ADMIN_TYPE = Number(sortVal);
					break;
			}
		}

		return await AdminModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	// 删除管理员
	async delMgr(id, myAdminId) {
		try {
			if (!id) this.AppError('管理员ID不能为空');
			if (id === myAdminId) this.AppError('不能删除自己');

			let admin = await AdminModel.getOne(id);
			if (!admin) {
				this.AppError('管理员不存在');
				return;
			}

			if (admin.ADMIN_TYPE == 1) {
				this.AppError('不能删除超级管理员');
				return;
			}

			await AdminModel.del(id);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('删除失败，请重试');
		}
	}

	// 添加管理员
	async insertMgr({
		name,
		desc,
		phone,
		password
	}) {
		try {
			if (!name) this.AppError('账号不能为空');
			if (!password) this.AppError('密码不能为空');

			// 判断是否存在
			let where = {
				ADMIN_NAME: name
			}
			let cnt = await AdminModel.count(where);
			if (cnt > 0)
				this.AppError('该账号已存在');

			// 加密
			let data = {
				ADMIN_NAME: name,
				ADMIN_DESC: desc,
				ADMIN_PHONE: phone,
				ADMIN_PASSWORD: md5Lib.md5(password),
				ADMIN_TYPE: 0
			}

			let id = await AdminModel.insert(data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('添加失败，请重试');
		}
	}

	// 修改管理员状态
	async statusMgr(id, status, myAdminId) {
		try {
			if (!id) this.AppError('管理员ID不能为空');
			if (id === myAdminId) this.AppError('不能修改自己的状态');

			let admin = await AdminModel.getOne(id);
			if (!admin) {
				this.AppError('管理员不存在');
				return;
			}

			if (admin.ADMIN_TYPE == 1) {
				this.AppError('不能修改超级管理员状态');
				return;
			}

			let data = {
				ADMIN_STATUS: status
			}
			await AdminModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('修改失败，请重试');
		}
	}

	/** 获取管理员信息 */
	async getMgrDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let mgr = await AdminModel.getOne(where, fields);
		if (!mgr) return null;

		return mgr;
	}

	// 修改管理员
	async editMgr(id, {
		name,
		desc,
		phone,
		password
	}) {
		try {
			if (!id) this.AppError('管理员ID不能为空');
			if (!name) this.AppError('账号不能为空');

			// 判断是否存在
			let where = {
				ADMIN_NAME: name,
				_id: ['<>', id]
			}
			let cnt = await AdminModel.count(where);
			if (cnt > 0)
				this.AppError('该账号已存在');

			let data = {
				ADMIN_NAME: name,
				ADMIN_DESC: desc,
				ADMIN_PHONE: phone
			}

			if (password) data.ADMIN_PASSWORD = md5Lib.md5(password);

			await AdminModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('修改失败，请重试');
		}
	}

	// 修改自己的密码
	async pwdtMgr(adminId, oldPassword, password) {
		try {
			if (!adminId) this.AppError('管理员ID不能为空');
			if (!oldPassword) this.AppError('旧密码不能为空');
			if (!password) this.AppError('新密码不能为空');

			let where = {
				_id: adminId,
				ADMIN_PASSWORD: md5Lib.md5(oldPassword)
			}
			let admin = await AdminModel.getOne(where);
			if (!admin)
				this.AppError('旧密码错误');

			let data = {
				ADMIN_PASSWORD: md5Lib.md5(password)
			}
			await AdminModel.edit(adminId, data);

			return {
				id: adminId
			};

		} catch (err) {
			console.error(err);
			this.AppError('修改失败，请重试');
		}
	}
}

module.exports = AdminMgrService;