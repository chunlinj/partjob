const BaseProjectAdminService = require('./base_project_admin_service.js');
const ActivityModel = require('../../model/activity_model.js');
const CateModel = require('../../model/cate_model.js');
const AppError = require('../../../../framework/core/app_error.js');
const axios = require('axios');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminSyncService extends BaseProjectAdminService {

    constructor() {
        super();
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };
    }

    // 辅助方法：从HTML中提取文本
    extractText(html, selector) {
        const regex = new RegExp(`<${selector}[^>]*>([^<]*)</${selector}>`, 'i');
        const match = html.match(regex);
        return match ? match[1].trim() : '';
    }

    // 辅助方法：从HTML中提取链接
    extractLinks(html, className) {
        const regex = new RegExp(`<a[^>]*href="([^"]*)"[^>]*class="[^"]*${className}[^"]*"[^>]*>`, 'g');
        const links = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            links.push(match[1]);
        }
        return links;
    }

    async syncData() {
        try {
            // 获取青团社数据
            let result = await this.fetchQTSData();
            
            // 更新数据库
            let stats = await this.updateDatabase(result.jobs, result.companies);
            
            return {
                success: true,
                stats: stats
            };
            
        } catch (err) {
            console.error(err);
            throw new AppError('同步失败:' + err.message);
        }
    }

    async fetchQTSData() {
        // TODO: 实现爬虫逻辑
        // 这里暂时返回测试数据
        return {
            jobs: [],
            companies: []
        };
    }

    async getPage(url) {
        try {
            const response = await axios({
                url,
                method: 'GET',
                headers: this.headers,
                timeout: 30000,
                responseType: 'text',
                responseEncoding: 'utf8'
            });
            return response.data;
        } catch (err) {
            console.error('获取页面失败:', err);
            return null;
        }
    }

    generateId() {
        const now = new Date();
        const random = Math.floor(Math.random() * 9000) + 1000;
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${random}`;
    }

    parseMoney(moneyStr) {
        if (!moneyStr) return '';
        moneyStr = moneyStr.replace(/\s+/g, '');
        const numbers = moneyStr.match(/\d+/);
        if (!numbers) return moneyStr;
        
        if (moneyStr.includes('天')) return `${numbers[0]}/天`;
        if (moneyStr.includes('月')) return `${numbers[0]}/月`;
        if (moneyStr.includes('时')) return `${numbers[0]}/小时`;
        return moneyStr;
    }

    async parseJobDetail(url) {
        const html = await this.getPage(url);
        if (!html) return [null, null];

        try {
            const jobTitle = this.extractText(html, 'h1');
            if (!jobTitle) return [null, null];

            let startTime = Date.now();
            let endTime = startTime + (90 * 24 * 60 * 60 * 1000);

            const address = this.extractText(html, '.jobAddress span');
            const latitude = parseFloat(html.match(/latitude" value="([^"]*)"/) || [0, 0])[1];
            const longitude = parseFloat(html.match(/longitude" value="([^"]*)"/) || [0, 0])[1];
            const payType = this.extractText(html, '.jobTop div:first-child a:last-child') || '日结';
            const salary = this.parseMoney(this.extractText(html, '.jobTop div:first-child a:first-child'));
            const personReq = this.extractText(html, '.interaddr');
            const description = this.extractText(html, '.desccont');
            const contact = this.extractText(html, '.jobContact');

            const job = {
                ACTIVITY_ID: this.generateId(),
                ACTIVITY_TITLE: jobTitle,
                ACTIVITY_START: startTime,
                ACTIVITY_END: endTime,
                ACTIVITY_ORDER: 0,
                ACTIVITY_STATUS: 1,
                ACTIVITY_VOUCH: 0,
                ACTIVITY_ADDRESS: address,
                ACTIVITY_ADDRESS_GEO: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                ACTIVITY_OBJ: {
                    payType,
                    personReq,
                    description,
                    salary,
                    contact
                },
                ACTIVITY_SOURCE: '青团社',
                ACTIVITY_ADD_TIME: startTime
            };

            // 解析企业信息
            const companyUrl = (html.match(/href="([^"]*\/company\/[^"]*)"/) || [])[1];
            let company = null;
            if (companyUrl) {
                const companyHtml = await this.getPage(companyUrl);
                if (companyHtml) {
                    company = {
                        CATE_ID: this.generateId(),
                        CATE_NAME: this.extractText(companyHtml, '.companyName'),
                        CATE_TITLE: this.extractText(companyHtml, '.companyName'),
                        CATE_ORDER: 0,
                        CATE_STATUS: 1,
                        CATE_TYPE: this.extractText(companyHtml, '.companyType') || '其他',
                        CATE_SIZE: this.extractText(companyHtml, '.companySize') || '未知',
                        CATE_TRADE: this.extractText(companyHtml, '.companyTrade') || '其他',
                        CATE_DESC: this.extractText(companyHtml, '.companyDesc'),
                        CATE_ADDRESS: this.extractText(companyHtml, '.companyAddress'),
                        CATE_SOURCE: '青团社'
                    };
                }
            }

            return [job, company];
        } catch (err) {
            console.error('解析职位详情失败:', err);
            return [null, null];
        }
    }

    async updateDatabase(jobs, companies) {
        let stats = {
            jobs_added: 0,
            jobs_updated: 0,
            companies_added: 0,
            companies_updated: 0
        };

        // 更新企业数据
        for (let company of companies) {
            let exists = await CateModel.getOne({
                CATE_SOURCE: '青团社',
                CATE_TITLE: company.CATE_TITLE
            });

            if (exists) {
                await CateModel.edit(exists._id, company);
                stats.companies_updated++;
            } else {
                await CateModel.insert(company);
                stats.companies_added++;
            }
        }

        // 更新职位数据
        for (let job of jobs) {
            let exists = await ActivityModel.getOne({
                ACTIVITY_SOURCE: '青团社',
                ACTIVITY_TITLE: job.ACTIVITY_TITLE,
                ACTIVITY_ADDRESS: job.ACTIVITY_ADDRESS
            });

            if (exists) {
                await ActivityModel.edit(exists._id, job);
                stats.jobs_updated++;
            } else {
                await ActivityModel.insert(job);
                stats.jobs_added++;
            }
        }

        return stats;
    }
}

module.exports = AdminSyncService; 