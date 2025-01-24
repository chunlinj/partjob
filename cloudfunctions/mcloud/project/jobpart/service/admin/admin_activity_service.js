/**
 * Notes: 职位后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2022-06-23 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const ActivityService = require('../activity_service.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const ActivityModel = require('../../model/activity_model.js');
const ActivityJoinModel = require('../../model/activity_join_model.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const CateModel = require('../../model/cate_model.js');
const UserModel = require('../../model/user_model.js');

// 导出申请数据KEY
const EXPORT_ACTIVITY_JOIN_DATA_KEY = 'EXPORT_ACTIVITY_JOIN_DATA';

class AdminActivityService extends BaseProjectAdminService {


	async statCateCnt(id) {
		if (!id) return;
		let cnt = await ActivityModel.count({ ACTIVITY_CATE_ID: id });
		await CateModel.edit(id, { CATE_CNT: cnt });
	}


	/**取得分页列表 */
	async getAdminActivityList({
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

		orderBy = orderBy || {
			'ACTIVITY_ORDER': 'asc',
			'ACTIVITY_END': 'desc',
			'ACTIVITY_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_JOIN_CNT,ACTIVITY_TITLE,ACTIVITY_CATE_ID,ACTIVITY_CATE_NAME,ACTIVITY_EDIT_TIME,ACTIVITY_ADD_TIME,ACTIVITY_ORDER,ACTIVITY_STATUS,ACTIVITY_VOUCH,ACTIVITY_MAX_CNT,ACTIVITY_START,ACTIVITY_END,ACTIVITY_CANCEL_SET,ACTIVITY_CHECK_SET,ACTIVITY_QR,ACTIVITY_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ACTIVITY_TITLE: ['like', search] },
				{ ACTIVITY_CATE_NAME: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type': {
					if (sortVal) where.and['ACTIVITY_OBJ.type'] = String(sortVal);
					break;
				}
				case 'pay': {
					if (sortVal) where.and['ACTIVITY_OBJ.pay'] = String(sortVal);
					break;
				}
				case 'biz': {
					if (sortVal) where.and['ACTIVITY_OBJ.biz'] = String(sortVal);
					break;
				}
				case 'cateId': {
					where.and.ACTIVITY_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.ACTIVITY_STATUS = Number(sortVal);
					break;
				}
				case 'vouch': {
					where.and.ACTIVITY_VOUCH = 1;
					break;
				}
				case 'top': {
					where.and.ACTIVITY_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'ACTIVITY_ADD_TIME');
					break;
				}
			}
		}

		return await ActivityModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**置顶与排序设定 */
	async sortActivity(id, sort) {
		try {
			// 数据校验
			if (!id) this.AppError('职位ID不能为空');
			if (sort < 0) this.AppError('排序号不能小于0');

			// 获取职位信息
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 更新数据
			let data = {
				ACTIVITY_ORDER: sort,
				ACTIVITY_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await ActivityModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('排序操作失败，请重试');
		}
	}

	/**获取信息 */
	async getActivityDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let activity = await ActivityModel.getOne(where, fields);
		if (!activity) return null;

		return activity;
	}


	/**首页设定 */
	async vouchActivity(id, vouch) {
		try {
			// 数据校验
			if (!id) this.AppError('职位ID不能为空');
			if (vouch !== 0 && vouch !== 1) this.AppError('推荐状态值错误');

			// 获取职位信息
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 更新数据
			let data = {
				ACTIVITY_VOUCH: vouch,
				ACTIVITY_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await ActivityModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('首页推荐设置失败，请重试');
		}
	}

	/**添加 */
	async insertActivity({
		title,
		cateId,
		cateName,

		maxCnt,
		start,
		end,

		address,
		addressGeo,

		cancelSet,
		checkSet,

		order,
		forms,
		joinForms,
	}) {
		try {
			// 数据校验
			if (!title) this.AppError('职位名称不能为空');
			if (!address) this.AppError('工作地点不能为空');

			// 处理表单数据
			let activityObj = {};
			if (forms && forms.length > 0) {
				forms.forEach(form => {
					activityObj[form.mark] = form.val;
				});
			}

			// 转换时间
			let timestamp = Math.floor(new Date().getTime() / 1000);
			start = timeUtil.time2Timestamp(start);
			end = timeUtil.time2Timestamp(end);

			// 准备数据
			let data = {
				ACTIVITY_TITLE: title,
				ACTIVITY_CATE_ID: cateId,
				ACTIVITY_CATE_NAME: cateName,
				ACTIVITY_MAX_CNT: maxCnt,
				ACTIVITY_START: start,
				ACTIVITY_END: end,
				ACTIVITY_ADDRESS: address,
				ACTIVITY_ADDRESS_GEO: addressGeo,
				ACTIVITY_CANCEL_SET: cancelSet,
				ACTIVITY_CHECK_SET: checkSet,
				ACTIVITY_ORDER: order || 9999,
				ACTIVITY_STATUS: 1,
				ACTIVITY_FORMS: forms || [],
				ACTIVITY_JOIN_FORMS: joinForms || [],
				ACTIVITY_OBJ: activityObj,
				ACTIVITY_ADD_TIME: timestamp,
				ACTIVITY_EDIT_TIME: timestamp,
			}

			// 插入数据
			let id = await ActivityModel.insert(data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('添加失败，请重试');
		}
	}

	//#############################   
	/** 清空 */
	async clearActivityAll(activityId) {
		try {
			// 数据校验
			if (!activityId) this.AppError('职位ID不能为空');

			// 获取职位信息
			let activity = await ActivityModel.getOne(activityId);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 删除该职位下的所有申请记录
			await ActivityJoinModel.del({ ACTIVITY_JOIN_ACTIVITY_ID: activityId });

			// 更新职位的申请数量
			await ActivityModel.edit(activityId, { ACTIVITY_JOIN_CNT: 0 });

			return {
				id: activityId
			};

		} catch (err) {
			console.error(err);
			this.AppError('清空失败，请重试');
		}
	}


	/**删除数据 */
	async delActivity(id) {
		try {
			// 数据校验
			if (!id) this.AppError('职位ID不能为空');

			// 获取职位信息
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 删除职位记录
			await ActivityModel.del(id);

			// 删除该职位下的所有申请记录
			await ActivityJoinModel.del({ ACTIVITY_JOIN_ACTIVITY_ID: id });

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('删除失败，请重试');
		}
	}

	// 更新forms信息
	async updateActivityForms({
		id,
		hasImageForms
	}) {
		try {
			// 数据校验
			if (!id) this.AppError('职位ID不能为空');

			// 获取职位信息
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 获取原有表单数据
			let forms = activity.ACTIVITY_FORMS;
			if (!forms) forms = [];

			// 更新图片表单
			for (let i = 0; i < forms.length; i++) {
				for (let j = 0; j < hasImageForms.length; j++) {
					if (forms[i].mark == hasImageForms[j].mark) {
						forms[i].val = hasImageForms[j].val;
						break;
					}
				}
			}

			// 更新数据
			let data = {
				ACTIVITY_FORMS: forms,
				ACTIVITY_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await ActivityModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('更新失败，请重试');
		}
	}

	/**更新数据 */
	async editActivity({id, 
		title,
		cateId,
		cateName,
		maxCnt,
		start,
		end,
		address,
		addressGeo,
		checkSet,
		cancelSet,
		order,
		forms
	}) {
		try {
			// 数据校验 
			if (!id) this.AppError('职位ID不能为空');
			if (!title) this.AppError('职位标题不能为空');
			if (!cateId) this.AppError('企业不能为空');

			// 查询职位是否存在
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 生成开始时间和结束时间
			let startTime = timeUtil.time2Timestamp(start);
			let endTime = timeUtil.time2Timestamp(end);
			if (startTime > endTime) this.AppError('开始时间不能大于结束时间');

			// 更新数据
			let data = {
				ACTIVITY_TITLE: title,
				ACTIVITY_CATE_ID: cateId,
				ACTIVITY_CATE_NAME: cateName,
				ACTIVITY_MAX_CNT: maxCnt,
				ACTIVITY_START: startTime,
				ACTIVITY_END: endTime,
				ACTIVITY_START_DAY: start,
				ACTIVITY_END_DAY: end,
				ACTIVITY_ORDER: order,
				ACTIVITY_CHECK_SET: checkSet,
				ACTIVITY_CANCEL_SET: cancelSet,
				ACTIVITY_ADDRESS: address,
				ACTIVITY_ADDRESS_GEO: addressGeo,
				ACTIVITY_FORMS: forms,
				ACTIVITY_OBJ: dataUtil.dbForms2Obj(forms),
				ACTIVITY_EDIT_TIME: timeUtil.time()
			}

			await ActivityModel.edit(id, data);

			// 更新对应企业的职位数量
			await this.statCateCnt(cateId);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('编辑失败，请重试');
		}
	}

	/**修改状态 */
	async statusActivity(id, status) {
		try {
			// 数据校验
			if (!id) this.AppError('职位ID不能为空');
			if (status !== 0 && status !== 1) this.AppError('状态值错误');

			// 获取职位信息
			let activity = await ActivityModel.getOne(id);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 更新数据
			let data = {
				ACTIVITY_STATUS: status,
				ACTIVITY_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await ActivityModel.edit(id, data);

			let statusDesc = (status == 0) ? '停用' : '正常';

			return {
				id,
				statusDesc
			};

		} catch (err) {
			console.error(err);
			this.AppError('状态修改失败，请重试');
		}
	}

	//#############################
	/**申请分页列表 */
	async getActivityJoinList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		activityId,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'ACTIVITY_JOIN_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_JOIN_ACTIVITY_TITLE,ACTIVITY_JOIN_ACTIVITY_CATE_NAME,ACTIVITY_JOIN_ACTIVITY_ID,ACTIVITY_JOIN_ADD_TIME,ACTIVITY_JOIN_FORMS,ACTIVITY_JOIN_ID,ACTIVITY_JOIN_OBJ,ACTIVITY_JOIN_REASON,ACTIVITY_JOIN_STATUS,ACTIVITY_JOIN_USER_ID,user.USER_NAME,user.USER_MOBILE';

		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: activityId
		};
		if (util.isDefined(search) && search) {
			where['ACTIVITY_JOIN_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型  
					where.ACTIVITY_JOIN_STATUS = Number(sortVal);
					break;
			}
		}


		let joinParams = {
			from: UserModel.CL,
			localField: 'ACTIVITY_JOIN_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await ActivityJoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**修改申请状态  
	 */
	async statusActivityJoin(activityJoinId, status, reason = '') {
		try {
			// 数据校验
			if (!activityJoinId) this.AppError('预约记录ID不能为空');

			// 获取申请记录
			let activityJoin = await ActivityJoinModel.getOne(activityJoinId);
			if (!activityJoin) {
				this.AppError('预约记录不存在');
				return;
			}

			// 更新数据
			let data = {
				ACTIVITY_JOIN_STATUS: status,
				ACTIVITY_JOIN_REASON: reason,
				ACTIVITY_JOIN_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await ActivityJoinModel.edit(activityJoinId, data);

			return {
				id: activityJoinId
			};

		} catch (err) {
			console.error(err);
			this.AppError('状态修改失败，请重试');
		}
	}




	/** 删除申请 */
	async delActivityJoin(activityJoinId) {
		try {
			// 数据校验
			if (!activityJoinId) this.AppError('预约记录ID不能为空');

			// 获取申请记录
			let activityJoin = await ActivityJoinModel.getOne(activityJoinId);
			if (!activityJoin) {
				this.AppError('预约记录不存在');
				return;
			}

			// 删除申请记录
			await ActivityJoinModel.del(activityJoinId);

			// 更新对应职位的申请数量
			let activityId = activityJoin.ACTIVITY_JOIN_ACTIVITY_ID;
			let cnt = await ActivityJoinModel.count({ ACTIVITY_JOIN_ACTIVITY_ID: activityId });
			await ActivityModel.edit(activityId, { ACTIVITY_JOIN_CNT: cnt });

			return {
				id: activityJoinId
			};

		} catch (err) {
			console.error(err);
			this.AppError('删除失败，请重试');
		}
	}


	// #####################导出申请数据
	/**获取申请数据 */
	async getActivityJoinDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}

	/**删除申请数据 */
	async deleteActivityJoinDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}

	/**导出申请数据 */
	async exportActivityJoinDataExcel({
		activityId,
		status
	}) {
		try {
			// 数据校验
			if (!activityId) this.AppError('职位ID不能为空');

			// 获取职位信息
			let activity = await ActivityModel.getOne(activityId);
			if (!activity) {
				this.AppError('职位不存在');
				return;
			}

			// 查询条件
			let where = {
				ACTIVITY_JOIN_ACTIVITY_ID: activityId
			};
			if (status !== -1) where.ACTIVITY_JOIN_STATUS = status;

			// 查询申请记录
			let orderBy = {
				ACTIVITY_JOIN_ADD_TIME: 'desc'
			};
			let list = await ActivityJoinModel.getAll(where, 'ACTIVITY_JOIN_FORMS,ACTIVITY_JOIN_STATUS,ACTIVITY_JOIN_ADD_TIME', orderBy);

			// 处理数据
			let data = [];
			for (let k = 0; k < list.length; k++) {
				let forms = list[k].ACTIVITY_JOIN_FORMS;
				let row = {};
				for (let j in forms) {
					row[forms[j].title] = forms[j].val;
				}
				row['申请时间'] = timeUtil.timestamp2Time(list[k].ACTIVITY_JOIN_ADD_TIME);
				row['状态'] = this.getJoinStatusDesc(list[k].ACTIVITY_JOIN_STATUS);
				data.push(row);
			}

			// 生成Excel
			let filename = `${activity.ACTIVITY_TITLE}申请名单.xlsx`;
			await exportUtil.exportDataExcel(EXPORT_ACTIVITY_JOIN_DATA_KEY, filename, data);

			return {
				downloadUrl: await exportUtil.getExportDataURL(EXPORT_ACTIVITY_JOIN_DATA_KEY)
			};

		} catch (err) {
			console.error(err);
			this.AppError('导出失败，请重试');
		}
	}
}

module.exports = AdminActivityService;