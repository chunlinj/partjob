class AdminImportService extends BaseProjectAdminService {
    async importCompanies(companies) {
        let success = 0;
        let update = 0;
        let fail = 0;
        
        for (let company of companies) {
            try {
                // 查询是否存在相同名称的企业
                let exists = await CateModel.getOne({
                    CATE_TITLE: company.CATE_TITLE
                });
                
                if (exists) {
                    // 更新已存在的企业
                    await CateModel.edit(exists._id, company);
                    update++;
                } else {
                    // 插入新企业
                    await CateModel.insert(company);
                    success++;
                }
            } catch (e) {
                console.error(e);
                fail++;
            }
        }
        
        return {
            success,
            update,
            fail
        };
    }
} 