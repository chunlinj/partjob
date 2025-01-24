const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({
    data: {
        isLoad: false
    },

    onLoad: function(options) {
        if (!AdminBiz.isAdmin(this)) return;
        this.setData({ isLoad: true });
    },

    bindImportTap: async function(e) {
        try {
            let options = {
                title: '导入中'
            };

            await cloudHelper.callCloudSumbit('admin/sync_data', {
                companies: this.data.companies,
                jobs: this.data.jobs
            }, options).then(res => {
                pageHelper.showSuccToast('导入成功');
                
                console.log('导入结果:', res);
                this.setData({
                    result: res
                });
            });

        } catch (err) {
            console.error(err);
        }
    }
}) 