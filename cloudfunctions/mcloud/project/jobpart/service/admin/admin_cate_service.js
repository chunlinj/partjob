/**
 * Notes: 活动后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2022-06-23 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const CateModel = require('../../model/cate_model.js');
const ActivityModel = require('../../model/activity_model.js');

class AdminCateService extends BaseProjectAdminService {


	async sortCate(id, sort) {
		try {
			// 数据校验
			if (!id) this.AppError('分类ID不能为空');
			if (sort < 0) this.AppError('排序号不能小于0');

			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 更新数据
			let data = {
				CATE_ORDER: sort,
				CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await CateModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('排序操作失败，请重试');
		}
	}

	async statusCate(id, status) {
		try {
			// 数据校验
			if (!id) this.AppError('分类ID不能为空');
			if (status !== 0 && status !== 1) this.AppError('状态值错误');

			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 更新数据
			let data = {
				CATE_STATUS: status,
				CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await CateModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('状态修改失败，请重试');
		}
	}

	async getAdminCateList({
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
			'CATE_ORDER': 'asc',
			'CATE_ADD_TIME': 'desc'
		};
		let fields = 'CATE_OBJ,CATE_VOUCH,CATE_ORDER,CATE_STATUS,CATE_TITLE,CATE_CNT,CATE_QR';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				CATE_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'vouch': {
					where.and.CATE_VOUCH = 1;
					break;
				}
				case 'trade': {
					where.and['CATE_OBJ.trade'] = sortVal;
					break;
				}
				case 'size': {
					where.and['CATE_OBJ.size'] = sortVal;
					break;
				}
				case 'type': {
					where.and['CATE_OBJ.type'] = sortVal;
					break;
				}
				case 'star': {
					where.and['CATE_OBJ.star'] = sortVal;
					break;
				}
				case 'top': {
					where.and.CATE_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'CATE_ADD_TIME');
					break;
				}
				case 'status':
					// 按类型
					where.and.CATE_STATUS = Number(sortVal);
					break;
			}
		}

		return await CateModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async delCate(id) {
		try {
			// 数据校验
			if (!id) this.AppError('分类ID不能为空');

			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 判断分类下是否有职位
			let activityCount = await ActivityModel.count({
				ACTIVITY_CATE_ID: id
			});
			if (activityCount > 0) {
				this.AppError('该分类下还有职位信息，不能删除');
				return;
			}

			// 删除分类
			await CateModel.del(id);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('删除失败，请重试');
		}
	}

   
   /**
     * 插入分类数据
     * @param {Object} param0
     * @param {string} title 分类标题
     * @param {number} order 排序号
     * @param {Array} forms 表单数据
     */
    async insertCate({ title, order, forms }) {
        try {
            console.log('准备插入分类数据:');
            console.log('Title:', title);
            console.log('Order:', order);
            console.log('Forms:', forms);

            // 处理表单数据
            let cateObj = {};
            if (forms && forms.length > 0) {
                forms.forEach(form => {
                    cateObj[form.mark] = form.val; // 将表单的 mark 字段作为对象的键，val 作为值
                });
            }

            // 准备插入数据
            let data = {
                CATE_TITLE: title,
                CATE_ORDER: order || 9999, // 排序号，默认为 9999
                CATE_FORMS: forms || [], // 原始表单数据
                CATE_OBJ: cateObj, // 处理后的对象数据
                CATE_STATUS: 1, // 默认状态为 1
                CATE_ADD_TIME: Math.floor(new Date().getTime() / 1000), // 当前时间戳
                CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000), // 当前时间戳
                _pid: this.getProjectId(), // 项目 ID
            };

            // 插入数据
            let result = await CateModel.insert(data);
            console.log('分类数据插入成功:', result);

            return {
                code: 200,
                msg: '分类数据插入成功',
                id: result,
            };
        } catch (err) {
            console.error('分类数据插入失败:', err);

            return {
                code: 500,
                msg: '分类数据插入失败',
                error: err,
            };
        }
    }

	async getCateDetail(id) {
		let fields = '*';

		let cate = await CateModel.getOne(id, fields);
		if (!cate) return null;

		return cate;
	}

	/**首页设定 */
	async vouchCate(id, vouch) {
		try {
			// 数据校验
			if (!id) this.AppError('分类ID不能为空');
			if (vouch !== 0 && vouch !== 1) this.AppError('推荐状态值错误');

			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 更新数据
			let data = {
				CATE_VOUCH: vouch,
				CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await CateModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('首页推荐设置失败，请重试');
		}
	}

	async editCate({
		id,
		title,
		order,
		forms
	}) {
		try {
			// 数据校验 
			if (!title) this.AppError('标题不能为空');

			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 处理表单数据
			let cateObj = {};
			if (forms && forms.length > 0) {
				forms.forEach(form => {
					cateObj[form.mark] = form.val;
				});
			}

			// 更新数据
			let data = {
				CATE_TITLE: title,
				CATE_ORDER: order || 9999,
				CATE_FORMS: forms || [],
				CATE_OBJ: cateObj,
				CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000)
			}

			await CateModel.edit(id, data);

			return {
				id
			};

		} catch (err) {
			console.error(err);
			this.AppError('编辑失败，请重试');
		}
	}

	async updateCateForms({
		id,
		hasImageForms
	}) {
		// 更新图片表单
		try {
			// 获取分类信息
			let cate = await CateModel.getOne(id);
			if (!cate) {
				this.AppError('分类不存在');
				return;
			}

			// 获取原有表单数据
			let forms = cate.CATE_FORMS;
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
				CATE_FORMS: forms,
				CATE_EDIT_TIME: Math.floor(new Date().getTime() / 1000), // 更新时间
			}

			await CateModel.edit(id, data);

			return {
				code: 200,
				msg: '更新成功'
			};

		} catch (err) {
			console.error(err);
			this.AppError('更新失败，请重试');
		}
	}


}

module.exports = AdminCateService;