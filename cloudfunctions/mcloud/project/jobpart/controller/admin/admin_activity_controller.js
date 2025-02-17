/**
 * Notes: 职位模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2022-06-23 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminActivityService = require('../../service/admin/admin_activity_service.js');
const ActivityService = require('../../service/activity_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');
const ActivityModel = require('../../model/activity_model.js');

class AdminActivityController extends BaseProjectAdminController {

	/** 置顶与排序设定 */
	async sortActivity() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		await service.sortActivity(input.id, input.sort);
	}

	/** 首页设定 */
	async vouchActivity() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			vouch: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		await service.vouchActivity(input.id, input.vouch);
	}

	/** 状态修改 */
	async statusActivity() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.statusActivity(input.id, input.status);

	}

	/** 列表 */
	async getAdminActivityList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let adminService = new AdminActivityService();
		let result = await adminService.getAdminActivityList(input);

		let service = new ActivityService();

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].ACTIVITY_ADD_TIME = timeUtil.timestamp2Time(list[k].ACTIVITY_ADD_TIME, 'Y-M-D h:m:s');

			list[k].statusDesc = service.getJoinStatusDesc(list[k]);

			list[k].ACTIVITY_START = timeUtil.timestamp2Time(list[k].ACTIVITY_START, 'Y-M-D h:m');
			list[k].end = timeUtil.timestamp2Time(list[k].ACTIVITY_END, 'Y-M-D h:m'); 

			if (list[k].ACTIVITY_OBJ && list[k].ACTIVITY_OBJ.desc)
				delete list[k].ACTIVITY_OBJ.desc;
		}
		result.list = list;

		return result;

	}

	/** 发布 */
	async insertActivity() {
		await this.isAdmin();

		// 数据校验 
		let rules = {
			title: 'must|string|min:2|max:50|name=职位名称',
			cateId: 'string|name=企业',
			cateName: 'string|name=企业名称',
			order: 'must|int|min:0|max:9999|name=排序号',

			maxCnt: 'must|int|name=人数上限',
			start: 'must|string|name=申请开始时间',
			end: 'must|string|name=申请截止时间', 

			address: 'must|string|name=地点',
			addressGeo: 'must|object|name=地点GEO',

			cancelSet: 'must|int|name=取消设置',
			checkSet: 'must|int|name=审核设置', 

			forms: 'array|name=表单',

			joinForms: 'array|name=用户申请资料设置',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminActivityService();
		let result = await service.insertActivity(input);

		this.logOther('添加了职位《' + input.title + '》');

		return result;

	}

	/** 获取信息用于编辑修改 */
	async getActivityDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		let activity = await service.getActivityDetail(input.id);
		if (activity) {
			activity.ACTIVITY_START = timeUtil.timestamp2Time(activity.ACTIVITY_START, 'Y-M-D h:m');
			activity.ACTIVITY_END = timeUtil.timestamp2Time(activity.ACTIVITY_END, 'Y-M-D h:m'); 
		}

		return activity;

	}

	/** 编辑 */
	async editActivity() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=职位名称',
			cateId: 'string|name=企业',
			cateName: 'string|name=企业名称',

			maxCnt: 'must|int|name=人数上限',
			start: 'must|string|name=申请开始时间',
			end: 'must|string|name=申请截止时间', 

			address: 'must|string|name=地点',
			addressGeo: 'must|object|name=地点GEO',

			cancelSet: 'must|int|name=取消设置',
			checkSet: 'must|int|name=审核设置', 

			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',

			joinForms: 'array|name=用户申请资料设置',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminActivityService();
		let result = service.editActivity(input);

		this.logOther('修改了职位《' + input.title + '》');

		return result;
	}

	async clearActivityAll() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.clearActivityAll(input.id);
	}

	/** 删除 */
	async delActivity() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await ActivityModel.getOneField(input.id, 'ACTIVITY_TITLE');

		let service = new AdminActivityService();
		await service.delActivity(input.id);

		if (title)
			this.logOther('删除了职位《' + title + '》');

	}

	/** 更新图片信息 */
	async updateActivityForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminActivityService();
		return await service.updateActivityForms(input);
	}

	//########################## 名单
	/** 预约名单列表 */
	async getActivityJoinList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			activityId: 'must|id',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		let result = await service.getActivityJoinList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].ACTIVITY_JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].ACTIVITY_JOIN_ADD_TIME);

		}
		result.list = list;

		return result;

	}

	/** 申请状态修改 */
	async statusActivityJoin() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			activityJoinId: 'must|id',
			status: 'must|int|in:0,1,8,9,10,98,99',
			reason: 'string|max:200',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.statusActivityJoin(input.activityJoinId, input.status, input.reason);
	}

 

	/** 申请删除 */
	async delActivityJoin() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			activityJoinId: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.delActivityJoin(input.activityJoinId);
	}

	 
 

	/**************申请数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async activityJoinDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();

		if (input.isDel === 1)
			await service.deleteActivityJoinDataExcel(); //先删除

		return await service.getActivityJoinDataURL();
	}

	/** 导出数据 */
	async activityJoinDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			activityId: 'id|must',
			status: 'int|must|default=1'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.exportActivityJoinDataExcel(input);
	}

	/** 删除导出的申请数据文件 */
	async activityJoinDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminActivityService();
		return await service.deleteActivityJoinDataExcel();
	}
}

module.exports = AdminActivityController;