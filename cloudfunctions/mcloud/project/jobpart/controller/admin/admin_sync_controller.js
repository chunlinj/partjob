const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminSyncService = require('../../service/admin/admin_sync_service.js');

class AdminSyncController extends BaseProjectAdminController {

    
    /** 同步数据 */
    async syncData() {
        
        try {
            let service = new AdminSyncService();
         
            return await service.syncData();
            
        } catch (err) {
            console.error(err);
            this.AppError('同步失败，请重试');
        }
    }
}

module.exports = AdminSyncController; 